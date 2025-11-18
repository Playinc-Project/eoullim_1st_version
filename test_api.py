import requests
import json

def test_login():
    url = "http://localhost:8080/api/users/login"
    data = {
        "email": "admin@eoullim.com",
        "password": "admin123"
    }
    
    try:
        print("🚀 백엔드 API 로그인 테스트 시작...")
        print(f"URL: {url}")
        print(f"Data: {data}")
        
        response = requests.post(url, json=data, headers={'Content-Type': 'application/json'})
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ 로그인 성공!")
        else:
            print("❌ 로그인 실패!")
            
    except Exception as e:
        print(f"🚫 연결 오류: {e}")

if __name__ == "__main__":
    test_login()