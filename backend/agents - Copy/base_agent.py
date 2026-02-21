from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
import google.generativeai as genai
import os
from dotenv import load_dotenv
import json

load_dotenv()

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)


class BaseAgent(ABC):
    """Abstract base class for all AI agents"""
    
    def __init__(self, model_name: str = "gemini-1.5-flash"):
        self.model_name = model_name
        self.model = genai.GenerativeModel(model_name)
        self.system_prompt = self._get_system_prompt()
    
    @abstractmethod
    def _get_system_prompt(self) -> str:
        """Return the system prompt for this agent"""
        pass
    
    @abstractmethod
    async def process(self, request_data: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Process a request with the given context"""
        pass
    
    def _build_context_string(self, context: Dict[str, Any]) -> str:
        """Build a formatted context string from context data"""
        context_parts = []
        
        if "student_core_profile" in context:
            profile = context["student_core_profile"]
            context_parts.append(f"""
**Student Core Profile:**
- Name: {profile.get('name', 'N/A')}
- Age: {profile.get('age', 'N/A')}
- Grade: {profile.get('grade', 'N/A')}
- School Board: {profile.get('school_board', 'N/A')}
- Syllabus: {profile.get('syllabus', 'N/A')}
- Hobbies: {', '.join(profile.get('hobbies', []))}
- Interests: {', '.join(profile.get('interests', []))}
- Sports: {', '.join(profile.get('sports', []))}
""")
        
        if "learning_style_profile" in context:
            style = context["learning_style_profile"]
            context_parts.append(f"""
**Learning Style Profile:**
- Primary Style: {style.get('primary_style', 'N/A')}
- Prefers Examples: {style.get('prefers_examples', True)}
- Prefers Visuals: {style.get('prefers_visuals', True)}
- Prefers Stories: {style.get('prefers_stories', False)}
- Attention Span: {style.get('attention_span_minutes', 30)} minutes
""")
        
        if "academic_history" in context:
            academic = context["academic_history"]
            context_parts.append(f"""
**Academic History:**
- Subjects: {', '.join(academic.get('subjects', []))}
- Overall Performance: {academic.get('overall_performance', 'N/A')}
""")
            
            if academic.get('weak_concepts'):
                weak = [c.get('concept_name', 'Unknown') for c in academic.get('weak_concepts', [])]
                context_parts.append(f"- Weak Concepts: {', '.join(weak[:5])}")
            
            if academic.get('mastered_concepts'):
                mastered = [c.get('concept_name', 'Unknown') for c in academic.get('mastered_concepts', [])]
                context_parts.append(f"- Mastered Concepts: {', '.join(mastered[:5])}")
        
        if "behavioral_profile" in context:
            behavioral = context["behavioral_profile"]
            context_parts.append(f"""
**Behavioral Profile:**
- Motivation Level: {behavioral.get('motivation_level', 'N/A')}
- Attention Span: {behavioral.get('attention_span', 30)} minutes
- Preferred Study Time: {behavioral.get('preferred_study_time', 'N/A')}
- Study Habits: {', '.join(behavioral.get('study_habits', []))}
""")
        
        if "career_interest_profile" in context:
            career = context["career_interest_profile"]
            context_parts.append(f"""
**Career Interest Profile:**
- Interests: {', '.join(career.get('interests', []))}
- Career Goals: {', '.join(career.get('career_goals', []))}
- Strengths: {', '.join(career.get('strengths', []))}
""")
        
        if "recent_sessions" in context:
            sessions = context.get("recent_sessions", [])
            context_parts.append(f"\n**Recent Sessions:** {len(sessions)} sessions in history")
        
        return "\n".join(context_parts)
    
    async def _generate_response(self, prompt: str, max_retries: int = 3) -> str:
        """Generate response from Gemini with retry logic"""
        for attempt in range(max_retries):
            try:
                response = await self.model.generate_content_async(prompt)
                return response.text
            except Exception as e:
                if attempt == max_retries - 1:
                    raise Exception(f"Failed to generate response after {max_retries} attempts: {str(e)}")
                continue
        
        return ""
    
    def _parse_json_response(self, response_text: str) -> Dict[str, Any]:
        """Attempt to parse JSON from response text"""
        try:
            # Try to find JSON in code blocks
            if "```json" in response_text:
                start = response_text.find("```json") + 7
                end = response_text.find("```", start)
                json_str = response_text[start:end].strip()
                return json.loads(json_str)
            elif "```" in response_text:
                start = response_text.find("```") + 3
                end = response_text.find("```", start)
                json_str = response_text[start:end].strip()
                return json.loads(json_str)
            else:
                # Try to parse the entire response
                return json.loads(response_text)
        except json.JSONDecodeError:
            # If parsing fails, return the text in a structured format
            return {"response": response_text}
