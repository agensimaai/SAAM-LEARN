from typing import Dict, Any, List
from .base_agent import BaseAgent
from datetime import datetime, timedelta
import json


class SecretaryAgent(BaseAgent):
    """AI Secretary Agent - Tracks tasks, progress, and generates reports"""
    
    def _get_system_prompt(self) -> str:
        return """You are the Student AI Secretary Agent.

You always receive: student_core_profile, recent_sessions, assessment_history, learning_plans

Your responsibilities:
1. Track tasks, study sessions, assessments and deadlines.
2. Generate short daily and weekly summaries.
3. Maintain progress records.
4. Prepare structured reports for parents or teachers when requested.
5. Remind the student of upcoming learning activities and tests.

When providing secretary services, structure your response based on request type:

For SUMMARY requests:
- summary: Concise overview of recent activity
- tasks: List of current tasks with completion status
- upcoming_deadlines: List of upcoming deadlines
- progress_metrics: Key metrics (study hours, completion rate, etc.)

For REPORT requests:
- report_data: Structured report with sections for academic progress, behavioral observations, strengths, areas for improvement, and recommendations

For TASKS requests:
- tasks: Detailed list of all current tasks
- completed_tasks: Recently completed tasks
- overdue_tasks: Tasks past their deadline

For REMINDERS requests:
- reminders: List of upcoming events and deadlines
- priority_items: High-priority items needing attention

Be professional, organized, and concise."""
    
    async def process(self, request_data: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Process a secretary request"""
        request_type = request_data.get("request_type", "summary")
        time_period = request_data.get("time_period", "this_week")
        
        # Build context string
        context_str = self._build_context_string(context)
        
        # Get student info
        student_profile = context.get("student_core_profile", {})
        recent_sessions = context.get("recent_sessions", [])
        
        # Build the secretary prompt
        prompt = f"""{self.system_prompt}

{context_str}

**Secretary Request:**
Request Type: {request_type}
Time Period: {time_period}

Student: {student_profile.get('name', 'N/A')}
Grade: {student_profile.get('grade', 'N/A')}
Number of Recent Sessions: {len(recent_sessions)}

Please provide {request_type} for {time_period}. Remember to:
- Be concise and well-organized
- Highlight important information
- Use clear formatting
- Include specific data and metrics
- Make it easy to understand at a glance

Provide your response in JSON format with the fields appropriate for {request_type} as specified in your system prompt."""
        
        # Generate response
        response_text = await self._generate_response(prompt)
        
        # Parse response
        try:
            response_data = self._parse_json_response(response_text)
            
            # Ensure required fields based on request type
            if request_type == "summary":
                if "summary" not in response_data:
                    response_data["summary"] = response_text
                if "tasks" not in response_data:
                    response_data["tasks"] = []
                if "upcoming_deadlines" not in response_data:
                    response_data["upcoming_deadlines"] = []
                if "progress_metrics" not in response_data:
                    response_data["progress_metrics"] = {}
            
            elif request_type == "report":
                if "report_data" not in response_data:
                    response_data["report_data"] = {
                        "academic_progress": response_text,
                        "behavioral_observations": "Consistent engagement",
                        "strengths": [],
                        "areas_for_improvement": [],
                        "recommendations": []
                    }
            
            elif request_type == "tasks":
                if "tasks" not in response_data:
                    response_data["tasks"] = []
                if "completed_tasks" not in response_data:
                    response_data["completed_tasks"] = []
                if "overdue_tasks" not in response_data:
                    response_data["overdue_tasks"] = []
            
            elif request_type == "reminders":
                if "reminders" not in response_data:
                    response_data["reminders"] = []
                if "priority_items" not in response_data:
                    response_data["priority_items"] = []
            
            return response_data
            
        except Exception as e:
            # Fallback response
            return {
                "summary": response_text,
                "tasks": [],
                "upcoming_deadlines": [],
                "progress_metrics": {
                    "total_sessions": len(recent_sessions),
                    "time_period": time_period
                }
            }
