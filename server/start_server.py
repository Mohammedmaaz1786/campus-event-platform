#!/usr/bin/env python3
"""
Simple FastAPI server launcher
"""
import sys
import os

# Add current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    import uvicorn
    from main import app
    
    print("🚀 Starting Campus Spark API server...")
    print("📚 API Documentation available at:")
    print("   - Swagger UI: http://localhost:8000/docs")
    print("   - ReDoc: http://localhost:8000/redoc")
    print("\n🔑 Sample login credentials:")
    print("   - Admin: admin@techuniv.edu / admin123")
    print("   - Student: alice@techuniv.edu / student123")
    print("\nPress Ctrl+C to stop the server\n")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
    
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Please make sure all dependencies are installed:")
    print("   pip install -r requirements.txt")
except Exception as e:
    print(f"❌ Error starting server: {e}")
    import traceback
    traceback.print_exc()
