from typing import Dict, Any, List
from .base_agent import BaseAgent
import json
import uuid


class AssessmentAgent(BaseAgent):
    """Exam & Assessment Agent - Generates personalized assessments and provides diagnostics"""
    
    def _get_system_prompt(self) -> str:
        return """You are the Personalized Exam and Assessment Agent.

You always receive: student_core_profile, academic_history, weak_concepts, mastered_concepts, learning_style_profile

Your responsibilities:
1. Generate individualized quizzes, tests and mock exams.
2. Prioritize weak_concepts while maintaining syllabus coverage.
3. Control difficulty progression from easy to advanced.
4. Generate clear marking schemes or answer rubrics.
5. Analyse student answers and identify error patterns.
6. Produce a short diagnostic learning report.
7. Update mastery and weakness signals for each concept.

You must not reuse generic or identical tests for different students.

When generating an assessment, structure your response as JSON with these fields:
- questions: List of questions (each with question_id, question_text, question_type, subject, topic, difficulty, correct_answer, options if MCQ, marks)
- total_marks: Total marks for the assessment
- marking_scheme: Brief description of how to mark
- time_limit_minutes: Recommended time limit

When evaluating answers, structure your response as JSON with:
- student_answers: List of evaluated answers (each with question_id, is_correct, marks_awarded, feedback)
- total_marks: Total marks possible
- marks_obtained: Marks the student got
- percentage: Percentage score
- diagnostic_report: Detailed analysis of performance
- error_patterns: List of common errors identified
- concepts_to_review: List of concepts that need more work
- mastery_updates: Suggested updates to concept mastery levels"""
    
    async def process(self, request_data: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Process an assessment request (generation or evaluation)"""
        
        # Check if this is generation or evaluation
        if "student_answers" in request_data:
            return await self._evaluate_assessment(request_data, context)
        else:
            return await self._generate_assessment(request_data, context)
    
    async def _generate_assessment(self, request_data: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Generate a new assessment"""
        assessment_type = request_data.get("assessment_type", "quiz")
        subject = request_data.get("subject", "")
        topics = request_data.get("topics", [])
        difficulty_level = request_data.get("difficulty_level", "mixed")
        num_questions = request_data.get("number_of_questions", 10)
        
        # Build context string
        context_str = self._build_context_string(context)
        
        # Get student info
        student_profile = context.get("student_core_profile", {})
        academic = context.get("academic_history", {})
        weak_concepts = academic.get("weak_concepts", [])[:5]
        
        # Build the generation prompt
        prompt = f"""{self.system_prompt}

{context_str}

**Assessment Generation Request:**
Assessment Type: {assessment_type}
Subject: {subject}
Topics: {', '.join(topics)}
Difficulty Level: {difficulty_level}
Number of Questions: {num_questions}
Student Grade: {student_profile.get('grade', 'N/A')}
School Board: {student_profile.get('school_board', 'N/A')}

**Weak Concepts to Prioritize:**
{chr(10).join([f"- {c.get('concept_name', 'Unknown')}" for c in weak_concepts]) if weak_concepts else "No weak concepts identified"}

Please generate a {assessment_type} with {num_questions} questions. Remember to:
- Focus 60% of questions on weak concepts
- Use difficulty level: {difficulty_level}
- Make questions appropriate for grade {student_profile.get('grade', 'N/A')}
- Align with {student_profile.get('school_board', 'N/A')} syllabus
- Include a mix of question types (MCQ, short answer, etc.)
- Provide clear correct answers and marking scheme

Generate unique, non-generic questions tailored to this student.

Provide your response in JSON format with the fields specified in your system prompt."""
        
        # Generate response
        response_text = await self._generate_response(prompt)
        
        # Parse response
        try:
            response_data = self._parse_json_response(response_text)
            
            # Ensure all required fields exist
            if "questions" not in response_data:
                response_data["questions"] = []
            
            # Add UUIDs to questions if not present
            for q in response_data["questions"]:
                if "question_id" not in q:
                    q["question_id"] = str(uuid.uuid4())
            
            if "total_marks" not in response_data:
                response_data["total_marks"] = sum(q.get("marks", 1) for q in response_data["questions"])
            
            if "marking_scheme" not in response_data:
                response_data["marking_scheme"] = "Award full marks for correct answers, partial marks for partially correct answers."
            
            if "time_limit_minutes" not in response_data:
                response_data["time_limit_minutes"] = num_questions * 3  # 3 minutes per question
            
            return response_data
            
        except Exception as e:
            return {
                "questions": [],
                "total_marks": 0,
                "marking_scheme": "Standard marking",
                "time_limit_minutes": 30,
                "error": str(e)
            }
    
    async def _evaluate_assessment(self, request_data: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Evaluate student's answers"""
        questions = request_data.get("questions", [])
        student_answers = request_data.get("student_answers", [])
        
        # Build context string
        context_str = self._build_context_string(context)
        
        # Build the evaluation prompt
        prompt = f"""{self.system_prompt}

{context_str}

**Assessment Evaluation Request:**

Please evaluate the following student answers and provide detailed feedback.

**Questions and Answers:**
{json.dumps({"questions": questions, "student_answers": student_answers}, indent=2)}

Please evaluate each answer and provide:
1. Whether the answer is correct
2. Marks awarded
3. Specific feedback for improvement
4. Overall diagnostic report identifying error patterns
5. Concepts that need review
6. Suggested mastery level updates

Provide your response in JSON format with the evaluation fields specified in your system prompt."""
        
        # Generate response
        response_text = await self._generate_response(prompt)
        
        # Parse response
        try:
            response_data = self._parse_json_response(response_text)
            
            # Ensure all required fields exist
            if "student_answers" not in response_data:
                response_data["student_answers"] = student_answers
            
            if "diagnostic_report" not in response_data:
                response_data["diagnostic_report"] = "Assessment evaluated. Review feedback for each question."
            
            if "error_patterns" not in response_data:
                response_data["error_patterns"] = []
            
            if "concepts_to_review" not in response_data:
                response_data["concepts_to_review"] = []
            
            return response_data
            
        except Exception as e:
            return {
                "student_answers": student_answers,
                "diagnostic_report": response_text,
                "error_patterns": [],
                "concepts_to_review": [],
                "error": str(e)
            }
