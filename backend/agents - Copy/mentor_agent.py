from typing import Dict, Any
from .base_agent import BaseAgent
import json


class MentorAgent(BaseAgent):
    """Student Mentor Agent - Guides students in discipline, habits, and career exploration"""
    
    def _get_system_prompt(self) -> str:
        return """You are the Student Mentor Agent.

You always receive: student_core_profile, career_interest_profile, behavioral_profile, recent_sessions

Your responsibilities:
1. Guide students in discipline, study habits and self-management.
2. Support goal-setting and personal development.
3. Provide age-appropriate career exploration guidance.
4. Encourage ethical behaviour, responsibility and consistency.
5. Adapt advice to the student's cultural and social context.

You must avoid unrealistic promises or adult-level pressure.

When providing mentorship, structure your response as JSON with these fields:
- guidance: Main mentorship message (warm, encouraging, age-appropriate)
- action_items: List of 3-5 specific, achievable actions the student can take
- resources: List of helpful resources (books, websites, activities)
- follow_up_suggestions: What to discuss in the next mentorship session

Always be:
- Encouraging and positive
- Realistic and practical
- Age-appropriate
- Culturally sensitive
- Focused on building good habits and character"""
    
    async def process(self, request_data: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Process a mentorship request"""
        topic = request_data.get("topic", "general")
        specific_question = request_data.get("specific_question", "")
        
        # Build context string
        context_str = self._build_context_string(context)
        
        # Get student info
        student_profile = context.get("student_core_profile", {})
        career = context.get("career_interest_profile", {})
        behavioral = context.get("behavioral_profile", {})
        
        # Build the mentorship prompt
        prompt = f"""{self.system_prompt}

{context_str}

**Mentorship Request:**
Topic: {topic}
{f'Specific Question: {specific_question}' if specific_question else ''}

Student Age: {student_profile.get('age', 'N/A')}
Current Motivation Level: {behavioral.get('motivation_level', 'N/A')}
Study Habits: {', '.join(behavioral.get('study_habits', []))}
Career Interests: {', '.join(career.get('interests', []))}
Career Goals: {', '.join(career.get('career_goals', []))}

Please provide mentorship guidance on this topic. Remember to:
- Keep language appropriate for a {student_profile.get('age', 'N/A')} year old
- Be encouraging and supportive
- Provide practical, actionable advice
- Consider their cultural context: {student_profile.get('cultural_context', 'not specified')}
- Avoid putting too much pressure
- Focus on building good habits and character

Provide your response in JSON format with the fields specified in your system prompt."""
        
        # Generate response
        response_text = await self._generate_response(prompt)
        
        # Parse response
        try:
            response_data = self._parse_json_response(response_text)
            
            # Ensure all required fields exist
            if "guidance" not in response_data:
                response_data["guidance"] = response_text
            
            if "action_items" not in response_data:
                response_data["action_items"] = []
            
            if "resources" not in response_data:
                response_data["resources"] = []
            
            if "follow_up_suggestions" not in response_data:
                response_data["follow_up_suggestions"] = "Let's check in on your progress next time!"
            
            return response_data
            
        except Exception as e:
            # Fallback response
            return {
                "guidance": response_text,
                "action_items": ["Set small, achievable goals", "Track your progress daily", "Celebrate small wins"],
                "resources": [],
                "follow_up_suggestions": "Share your progress in our next session."
            }
