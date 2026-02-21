from typing import Dict, Any
from .base_agent import BaseAgent
from models import TeacherRequest, TeacherResponse, Question
import json


class TeacherAgent(BaseAgent):
    """Personalized Teacher Agent - Teaches concepts aligned with student's grade and syllabus"""
    
    def _get_system_prompt(self) -> str:
        return """You are the Personalized Teacher Agent in a multi-agent AI learning system.

Your responsibility is to teach academic concepts strictly aligned with the student's grade, school board and official syllabus.

You always receive: student_core_profile, learning_style_profile, academic_history, weak_concepts, mastered_concepts

You must:
1. Adapt explanations to the student's preferred learning style (visual, story-based, step-by-step, practice-first, etc.).
2. Personalize explanations and examples using the student's hobbies, sports, interests and daily life.
3. Explain concepts in small, progressive steps.
4. Check understanding after each concept using short formative questions.
5. Avoid unnecessary theory beyond the student's grade level.
6. Never introduce content that is outside the approved syllabus.
7. Keep language suitable for the student's age and reading level.

When teaching, structure your response as JSON with these fields:
- explanation: Main teaching content (use markdown for formatting)
- examples: List of 2-3 personalized examples
- formative_questions: List of 2-3 simple questions to check understanding (each with question_text, question_type, correct_answer, and options if MCQ)
- visual_aids_suggested: List of visual aids that would help (e.g., "diagram of water cycle", "graph showing linear equations")
- next_steps: What the student should practice next

Always personalize based on the student's profile!"""
    
    async def process(self, request_data: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Process a teaching request"""
        concept = request_data.get("concept", "")
        subject = request_data.get("subject", "")
        topic = request_data.get("topic", "")
        additional_context = request_data.get("additional_context", "")
        
        # Build context string
        context_str = self._build_context_string(context)
        
        # Build the teaching prompt
        prompt = f"""{self.system_prompt}

{context_str}

**Teaching Request:**
Subject: {subject}
Topic: {topic}
Concept to Teach: {concept}
{f'Additional Context: {additional_context}' if additional_context else ''}

Please teach this concept to the student. Remember to:
- Use their learning style ({context.get('learning_style_profile', {}).get('primary_style', 'step-by-step')})
- Include examples from their interests: {', '.join(context.get('student_core_profile', {}).get('interests', []))}
- Keep it appropriate for grade {context.get('student_core_profile', {}).get('grade', 'N/A')}
- Use simple language for age {context.get('student_core_profile', {}).get('age', 'N/A')}

Provide your response in JSON format with the fields specified in your system prompt."""
        
        # Generate response
        response_text = await self._generate_response(prompt)
        
        # Parse response
        try:
            response_data = self._parse_json_response(response_text)
            
            # Ensure all required fields exist
            if "explanation" not in response_data:
                response_data["explanation"] = response_text
            
            if "examples" not in response_data:
                response_data["examples"] = []
            
            if "formative_questions" not in response_data:
                response_data["formative_questions"] = []
            
            if "visual_aids_suggested" not in response_data:
                response_data["visual_aids_suggested"] = []
            
            if "next_steps" not in response_data:
                response_data["next_steps"] = "Practice the examples provided and try the formative questions."
            
            return response_data
            
        except Exception as e:
            # Fallback response
            return {
                "explanation": response_text,
                "examples": [],
                "formative_questions": [],
                "visual_aids_suggested": [],
                "next_steps": "Review the explanation and practice similar problems."
            }
