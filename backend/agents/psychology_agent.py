from typing import Dict, Any
from .base_agent import BaseAgent
import json


class PsychologyAgent(BaseAgent):
    """Psychology & Well-being Agent - Supports learning confidence and emotional well-being"""
    
    def _get_system_prompt(self) -> str:
        return """You are the Student Well-being and Learning Psychology Agent.

You always receive: behavioral_profile, recent_sessions, learning_style_profile

Your responsibilities:
1. Support learning confidence and motivation.
2. Help manage academic stress and performance anxiety.
3. Teach simple focus, attention and emotional regulation techniques.
4. Encourage healthy study routines and self-reflection.

Strict rules:
• You must not provide medical, psychiatric or therapeutic diagnosis.
• You must not recommend medication or clinical treatment.

Your role is supportive and educational only.

When providing support, structure your response as JSON with these fields:
- support_message: Warm, empathetic message acknowledging their feelings
- techniques: List of 3-5 simple, practical techniques they can try
- exercises: List of specific exercises (breathing, mindfulness, etc.)
- encouragement: Positive, motivating message
- disclaimer: Always include disclaimer about not providing medical advice

Always be:
- Empathetic and understanding
- Non-judgmental
- Focused on practical coping strategies
- Clear about your limitations (not a therapist)
- Encouraging and hopeful"""
    
    async def process(self, request_data: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Process a well-being support request"""
        concern_type = request_data.get("concern_type", "general")
        description = request_data.get("description", "")
        
        # Build context string
        context_str = self._build_context_string(context)
        
        # Get student info
        behavioral = context.get("behavioral_profile", {})
        learning_style = context.get("learning_style_profile", {})
        
        # Build the support prompt
        prompt = f"""{self.system_prompt}

{context_str}

**Well-being Support Request:**
Concern Type: {concern_type}
{f'Description: {description}' if description else ''}

Current Motivation Level: {behavioral.get('motivation_level', 'N/A')}
Stress Indicators: {', '.join(behavioral.get('stress_indicators', []))}
Attention Span: {behavioral.get('attention_span', 30)} minutes
Study Habits: {', '.join(behavioral.get('study_habits', []))}

Please provide supportive guidance for this concern. Remember to:
- Be empathetic and understanding
- Provide practical, simple techniques
- Keep it age-appropriate
- Focus on building confidence and resilience
- DO NOT diagnose or recommend medical treatment
- Always include the disclaimer about not providing medical advice

Provide your response in JSON format with the fields specified in your system prompt."""
        
        # Generate response
        response_text = await self._generate_response(prompt)
        
        # Parse response
        try:
            response_data = self._parse_json_response(response_text)
            
            # Ensure all required fields exist
            if "support_message" not in response_data:
                response_data["support_message"] = response_text
            
            if "techniques" not in response_data:
                response_data["techniques"] = []
            
            if "exercises" not in response_data:
                response_data["exercises"] = []
            
            if "encouragement" not in response_data:
                response_data["encouragement"] = "You're doing great! Keep taking care of yourself."
            
            # Always include disclaimer
            response_data["disclaimer"] = "This is educational support only. For medical or mental health concerns, please consult a healthcare professional."
            
            return response_data
            
        except Exception as e:
            # Fallback response
            return {
                "support_message": "I understand you're going through a challenging time. Let's work on some strategies together.",
                "techniques": [
                    "Take regular breaks during study sessions",
                    "Practice deep breathing when feeling overwhelmed",
                    "Break large tasks into smaller, manageable steps"
                ],
                "exercises": [
                    "4-7-8 breathing: Breathe in for 4, hold for 7, out for 8",
                    "5-minute mindfulness: Focus on your senses for 5 minutes"
                ],
                "encouragement": "Remember, it's okay to take things one step at a time. You're capable of handling this!",
                "disclaimer": "This is educational support only. For medical or mental health concerns, please consult a healthcare professional."
            }
