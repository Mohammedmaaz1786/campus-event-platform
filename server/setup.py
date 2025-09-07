#!/usr/bin/env python3
"""
Campus Spark FastAPI Backend Startup Script
"""

import os
import sys
import subprocess
from pathlib import Path

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8+ is required")
        sys.exit(1)
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor} detected")

def install_dependencies():
    """Install Python dependencies"""
    print("📦 Installing dependencies...")
    try:
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], check=True)
        print("✅ Dependencies installed successfully")
    except subprocess.CalledProcessError:
        print("❌ Failed to install dependencies")
        sys.exit(1)

def check_env_file():
    """Check if .env file exists and help create it"""
    env_file = Path(".env")
    env_example = Path(".env.example")
    
    if not env_file.exists():
        if env_example.exists():
            print("📝 Creating .env file from .env.example...")
            with open(env_example, 'r') as src, open(env_file, 'w') as dst:
                dst.write(src.read())
            print("✅ .env file created")
            print("⚠️  Please update the DATABASE_URL and SECRET_KEY in .env file")
        else:
            print("❌ No .env.example file found")
            return False
    else:
        print("✅ .env file found")
    
    return True

def setup_database():
    """Set up the database with tables and seed data"""
    print("🗄️  Setting up database...")
    try:
        subprocess.run([sys.executable, "seed.py"], check=True)
        print("✅ Database setup completed")
    except subprocess.CalledProcessError:
        print("❌ Database setup failed")
        print("   Make sure PostgreSQL is running and database credentials are correct")
        return False
    return True

def start_server():
    """Start the FastAPI server"""
    print("🚀 Starting FastAPI server...")
    try:
        subprocess.run([sys.executable, "main.py"], check=True)
    except KeyboardInterrupt:
        print("\n🛑 Server stopped")
    except subprocess.CalledProcessError:
        print("❌ Failed to start server")

def main():
    """Main setup and startup function"""
    print("🎓 Campus Spark FastAPI Backend Setup")
    print("=" * 40)
    
    # Check Python version
    check_python_version()
    
    # Install dependencies
    install_dependencies()
    
    # Check/create .env file
    if not check_env_file():
        return
    
    # Ask user if they want to set up database
    setup_db = input("\n🗄️  Set up database with sample data? (y/n): ").lower().strip()
    if setup_db in ['y', 'yes']:
        if not setup_database():
            return
    
    # Ask user if they want to start the server
    start_srv = input("\n🚀 Start the server now? (y/n): ").lower().strip()
    if start_srv in ['y', 'yes']:
        print("\n📖 API Documentation will be available at:")
        print("   - Swagger UI: http://localhost:8000/docs")
        print("   - ReDoc: http://localhost:8000/redoc")
        print("\n🔑 Sample login credentials:")
        print("   - Admin: admin@techuniv.edu / admin123")
        print("   - Student: alice@techuniv.edu / student123")
        print("\nPress Ctrl+C to stop the server\n")
        start_server()
    else:
        print("\n✅ Setup complete! Run 'python main.py' to start the server")

if __name__ == "__main__":
    main()
