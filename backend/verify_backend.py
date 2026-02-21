import sys
import os
import asyncio
from dotenv import load_dotenv

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Load environment variables
load_dotenv()

async def verify_system():
    print("Verifying Backend System...")
    
    # Check dependencies
    try:
        import fastapi
        import sqlalchemy
        import google.generativeai as genai
        import pydantic
        print("✅ Dependencies imported successfully")
    except ImportError as e:
        print(f"❌ Dependency missing: {e}")
        return

    # Check database connection
    try:
        from database import init_db, get_db, SessionLocal
        init_db()
        db = SessionLocal()
        print("✅ Database initialized and connected")
        db.close()
    except Exception as e:
        print(f"❌ Database error: {e}")
        return

    # Check Agent Initialization
    try:
        from agents import TeacherAgent, PlannerAgent, AssessmentAgent
        
        teacher = TeacherAgent()
        print(f"✅ Teacher Agent initialized (System prompt length: {len(teacher.system_prompt)})")
        
        planner = PlannerAgent()
        print(f"✅ Planner Agent initialized (System prompt length: {len(planner.system_prompt)})")
        
        # Verify API Key is loaded
        if not os.getenv("GEMINI_API_KEY"):
            print("⚠️ WARNING: GEMINI_API_KEY not found in .env file. AI features will fail.")
        else:
            print("✅ GEMINI_API_KEY found in configuration")
            
    except Exception as e:
        print(f"❌ Agent initialization error: {e}")
        return

    print("\nSystem verification completed successfully!")

if __name__ == "__main__":
    asyncio.run(verify_system())
