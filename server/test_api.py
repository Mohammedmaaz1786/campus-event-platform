#!/usr/bin/env python3
"""
API Test Script for Campus Spark Backend
"""

import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    print("🏥 Testing health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print("✅ Health check passed")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except requests.ConnectionError:
        print("❌ Cannot connect to server. Is it running?")
        return False

def test_auth():
    """Test authentication endpoints"""
    print("\n🔐 Testing authentication...")
    
    # Test login
    login_data = {
        "email": "admin@techuniv.edu",
        "password": "admin123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        if response.status_code == 200:
            data = response.json()
            token = data.get("access_token")
            user = data.get("user")
            print(f"✅ Login successful for {user.get('name')} ({user.get('role')})")
            return token
        else:
            print(f"❌ Login failed: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"❌ Login error: {e}")
        return None

def test_admin_endpoints(token):
    """Test admin endpoints"""
    print("\n👨‍💼 Testing admin endpoints...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test dashboard
    try:
        response = requests.get(f"{BASE_URL}/admin/dashboard", headers=headers)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Dashboard: {data.get('total_events')} events, {data.get('total_students')} students")
        else:
            print(f"❌ Dashboard failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Dashboard error: {e}")
    
    # Test events list
    try:
        response = requests.get(f"{BASE_URL}/admin/events", headers=headers)
        if response.status_code == 200:
            events = response.json()
            print(f"✅ Events list: {len(events)} events found")
        else:
            print(f"❌ Events list failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Events list error: {e}")

def test_student_endpoints():
    """Test student endpoints"""
    print("\n👩‍🎓 Testing student endpoints...")
    
    # Login as student
    login_data = {
        "email": "alice@techuniv.edu",
        "password": "student123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        if response.status_code == 200:
            data = response.json()
            token = data.get("access_token")
            print(f"✅ Student login successful")
            
            headers = {"Authorization": f"Bearer {token}"}
            
            # Test available events
            response = requests.get(f"{BASE_URL}/student/events", headers=headers)
            if response.status_code == 200:
                events = response.json()
                print(f"✅ Available events: {len(events)} events")
            else:
                print(f"❌ Available events failed: {response.status_code}")
                
        else:
            print(f"❌ Student login failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Student test error: {e}")

def test_public_endpoints():
    """Test public endpoints"""
    print("\n🌐 Testing public endpoints...")
    
    # Test colleges list
    try:
        response = requests.get(f"{BASE_URL}/auth/colleges")
        if response.status_code == 200:
            colleges = response.json()
            print(f"✅ Colleges list: {len(colleges)} colleges")
        else:
            print(f"❌ Colleges list failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Colleges list error: {e}")

def main():
    """Run all tests"""
    print("🧪 Campus Spark API Test Suite")
    print("=" * 40)
    
    # Test health first
    if not test_health():
        print("\n❌ Server is not responding. Please start the server first:")
        print("   cd server && python main.py")
        return
    
    # Test public endpoints
    test_public_endpoints()
    
    # Test authentication and get admin token
    admin_token = test_auth()
    if admin_token:
        test_admin_endpoints(admin_token)
    
    # Test student endpoints
    test_student_endpoints()
    
    print("\n🎉 Test suite completed!")
    print("\n📚 API Documentation available at:")
    print(f"   - Swagger UI: {BASE_URL}/docs")
    print(f"   - ReDoc: {BASE_URL}/redoc")

if __name__ == "__main__":
    main()
