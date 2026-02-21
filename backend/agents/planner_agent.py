from typing import Dict, Any
from .base_agent import BaseAgent
from datetime import datetime, timedelta
import json


class PlannerAgent(BaseAgent):
    """Learning Planner Agent - Creates realistic study plans based on student profile"""
    
    def _get_system_prompt(self) -> str:
        return """You are the Learning Planner Agent in a personalized education system.

You always receive: student_core_profile, academic_history, weak_concepts, mastered_concepts, behavioral_profile, recent_sessions

Your responsibilities:
1. Create realistic daily and weekly study plans.
2. Allocate more time to weak_concepts and revision cycles.
3. Balance learning load to avoid cognitive overload.
4. Adjust pacing based on motivation, attention level and recent performance.
5. Recommend revision, practice and assessment moments.
6. Produce plans that fit the student's real schedule and energy level.

All plans must remain syllabus-aligned and age-appropriate.

When creating a plan, structure your response as JSON with these fields:
- daily_tasks: List of tasks for each day (each with task_id, title, description, subject, estimated_duration_minutes, priority)
- weekly_goals: List of 3-5 achievable weekly goals
- revision_schedule: Dictionary mapping dates to concepts to revise
- total_study_hours: Total recommended study hours
- break_intervals: List of recommended break times
- notes: Additional guidance or motivation for the student

Consider the student's:
- Attention span (don't create tasks longer than their attention span)
- Preferred study time (schedule important tasks during peak energy)
- Weak concepts (allocate 60% of time to these)
- Motivation level (adjust task difficulty and variety)"""
    
    async def process(self, request_data: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Process a planning request"""
        plan_type = request_data.get("plan_type", "daily")  # "daily" or "weekly"
        available_hours = request_data.get("available_hours_per_day", 2.0)
        specific_goals = request_data.get("specific_goals", [])
        
        # Build context string
        context_str = self._build_context_string(context)
        
        # Get student info
        student_profile = context.get("student_core_profile", {})
        behavioral = context.get("behavioral_profile", {})
        academic = context.get("academic_history", {})
        
        attention_span = behavioral.get("attention_span", 30)
        weak_concepts = academic.get("weak_concepts", [])[:5]  # Top 5 weak concepts
        
        # Build the planning prompt
        prompt = f"""{self.system_prompt}

{context_str}

**Planning Request:**
Plan Type: {plan_type}
Available Study Hours Per Day: {available_hours}
Student's Attention Span: {attention_span} minutes
{f'Specific Goals: {", ".join(specific_goals)}' if specific_goals else ''}

**Top Weak Concepts to Focus On:**
{chr(10).join([f"- {c.get('concept_name', 'Unknown')} ({c.get('subject', 'N/A')})" for c in weak_concepts]) if weak_concepts else "No weak concepts identified yet"}

Please create a {plan_type} study plan for this student. Remember to:
- Break tasks into chunks of {attention_span} minutes or less
- Schedule difficult subjects during their preferred study time: {behavioral.get('preferred_study_time', 'flexible')}
- Allocate 60% of time to weak concepts
- Include regular breaks
- Keep the plan realistic and achievable
- Make it engaging for a {student_profile.get('age', 'N/A')} year old

Provide your response in JSON format with the fields specified in your system prompt."""
        
        # Generate response
        response_text = await self._generate_response(prompt)
        
        # Parse response
        try:
            response_data = self._parse_json_response(response_text)
            
            # Ensure all required fields exist
            if "daily_tasks" not in response_data:
                response_data["daily_tasks"] = []
            
            if "weekly_goals" not in response_data:
                response_data["weekly_goals"] = []
            
            if "revision_schedule" not in response_data:
                response_data["revision_schedule"] = {}
            
            if "total_study_hours" not in response_data:
                response_data["total_study_hours"] = available_hours
            
            if "break_intervals" not in response_data:
                response_data["break_intervals"] = ["After every 30 minutes of study"]
            
            if "notes" not in response_data:
                response_data["notes"] = "Follow this plan consistently for best results!"
            
            return response_data
            
        except Exception as e:
            # Fallback response
            return {
                "daily_tasks": [],
                "weekly_goals": ["Complete assigned readings", "Practice weak concepts", "Review previous lessons"],
                "revision_schedule": {},
                "total_study_hours": available_hours,
                "break_intervals": ["After every 30 minutes"],
                "notes": response_text
            }
