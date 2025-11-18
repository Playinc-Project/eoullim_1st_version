import requests
import json
import time

class EoullimAPITester:
    def __init__(self, base_url="http://localhost:8080/api"):
        self.base_url = base_url
        self.token = None
        self.user_id = None
        self.test_results = []
        
    def log_result(self, test_name, method, endpoint, status_code, success, message=""):
        result = {
            "test": test_name,
            "method": method,
            "endpoint": endpoint,
            "status": status_code,
            "success": success,
            "message": message
        }
        self.test_results.append(result)
        status = "✅" if success else "❌"
        print(f"{status} {test_name}: {method} {endpoint} → {status_code} {message}")

    def test_user_apis(self):
        print("\n🔧 USER API 테스트 시작")
        
        # 1. 회원가입 테스트
        signup_data = {
            "email": "tester@example.com",
            "password": "password123",
            "username": "테스터"
        }
        
        try:
            response = requests.post(f"{self.base_url}/users/signup", 
                                   json=signup_data, 
                                   headers={'Content-Type': 'application/json'})
            
            if response.status_code == 201:
                self.log_result("회원가입", "POST", "/users/signup", response.status_code, True, "성공")
            else:
                self.log_result("회원가입", "POST", "/users/signup", response.status_code, False, f"실패: {response.text}")
        except Exception as e:
            self.log_result("회원가입", "POST", "/users/signup", 0, False, f"오류: {str(e)}")

        # 2. 로그인 테스트
        login_data = {
            "email": "admin@eoullim.com",
            "password": "admin123"
        }
        
        try:
            response = requests.post(f"{self.base_url}/users/login", 
                                   json=login_data, 
                                   headers={'Content-Type': 'application/json'})
            
            if response.status_code == 200:
                user_data = response.json()
                self.user_id = user_data.get('id')
                self.log_result("로그인", "POST", "/users/login", response.status_code, True, f"유저 ID: {self.user_id}")
            else:
                self.log_result("로그인", "POST", "/users/login", response.status_code, False, f"실패: {response.text}")
        except Exception as e:
            self.log_result("로그인", "POST", "/users/login", 0, False, f"오류: {str(e)}")

        # 3. 잘못된 로그인 테스트 (에러 처리 확인)
        invalid_login = {
            "email": "wrong@email.com",
            "password": "wrongpassword"
        }
        
        try:
            response = requests.post(f"{self.base_url}/users/login", 
                                   json=invalid_login, 
                                   headers={'Content-Type': 'application/json'})
            
            if response.status_code == 401 or response.status_code == 404:
                self.log_result("잘못된 로그인", "POST", "/users/login", response.status_code, True, "적절한 오류 응답")
            else:
                self.log_result("잘못된 로그인", "POST", "/users/login", response.status_code, False, "오류 처리 부족")
        except Exception as e:
            self.log_result("잘못된 로그인", "POST", "/users/login", 0, False, f"오류: {str(e)}")

    def test_post_apis(self):
        print("\n📝 POST API 테스트 시작")
        
        # 1. 게시글 목록 조회
        try:
            response = requests.get(f"{self.base_url}/posts")
            
            if response.status_code == 200:
                posts = response.json()
                self.log_result("게시글 목록 조회", "GET", "/posts", response.status_code, True, f"{len(posts)}개 게시글")
            else:
                self.log_result("게시글 목록 조회", "GET", "/posts", response.status_code, False, response.text)
        except Exception as e:
            self.log_result("게시글 목록 조회", "GET", "/posts", 0, False, f"오류: {str(e)}")

        # 2. 게시글 작성 (로그인한 유저로)
        if self.user_id:
            post_data = {
                "title": "API 테스트 게시글",
                "content": "이것은 자동 테스트로 생성된 게시글입니다.",
                "userId": self.user_id
            }
            
            try:
                response = requests.post(f"{self.base_url}/posts", 
                                       json=post_data, 
                                       headers={'Content-Type': 'application/json'})
                
                if response.status_code == 201:
                    post_data = response.json()
                    self.test_post_id = post_data.get('id')
                    self.log_result("게시글 작성", "POST", "/posts", response.status_code, True, f"게시글 ID: {self.test_post_id}")
                else:
                    self.log_result("게시글 작성", "POST", "/posts", response.status_code, False, response.text)
            except Exception as e:
                self.log_result("게시글 작성", "POST", "/posts", 0, False, f"오류: {str(e)}")

        # 3. 존재하지 않는 게시글 조회 (404 테스트)
        try:
            response = requests.get(f"{self.base_url}/posts/99999")
            
            if response.status_code == 404:
                self.log_result("없는 게시글 조회", "GET", "/posts/99999", response.status_code, True, "적절한 404 응답")
            else:
                self.log_result("없는 게시글 조회", "GET", "/posts/99999", response.status_code, False, "404 처리 부족")
        except Exception as e:
            self.log_result("없는 게시글 조회", "GET", "/posts/99999", 0, False, f"오류: {str(e)}")

    def test_comment_apis(self):
        print("\n💬 COMMENT API 테스트 시작")
        
        # 첫 번째 게시글 ID 가져오기
        try:
            response = requests.get(f"{self.base_url}/posts")
            if response.status_code == 200:
                posts = response.json()
                if posts and len(posts) > 0:
                    first_post_id = posts[0]['id']
                    
                    # 1. 댓글 목록 조회
                    comment_response = requests.get(f"{self.base_url}/posts/{first_post_id}/comments")
                    
                    if comment_response.status_code == 200:
                        comments = comment_response.json()
                        self.log_result("댓글 목록 조회", "GET", f"/posts/{first_post_id}/comments", comment_response.status_code, True, f"{len(comments)}개 댓글")
                    else:
                        self.log_result("댓글 목록 조회", "GET", f"/posts/{first_post_id}/comments", comment_response.status_code, False, comment_response.text)

                    # 2. 댓글 작성
                    if self.user_id:
                        comment_data = {
                            "content": "API 테스트 댓글입니다.",
                            "userId": self.user_id,
                            "postId": first_post_id
                        }
                        
                        comment_create_response = requests.post(f"{self.base_url}/posts/{first_post_id}/comments", 
                                                               json=comment_data, 
                                                               headers={'Content-Type': 'application/json'})
                        
                        if comment_create_response.status_code == 201:
                            self.log_result("댓글 작성", "POST", f"/posts/{first_post_id}/comments", comment_create_response.status_code, True, "성공")
                        else:
                            self.log_result("댓글 작성", "POST", f"/posts/{first_post_id}/comments", comment_create_response.status_code, False, comment_create_response.text)
                    
        except Exception as e:
            self.log_result("댓글 API", "GET/POST", "/comments", 0, False, f"오류: {str(e)}")

    def test_validation_and_errors(self):
        print("\n🔒 에러 처리 및 유효성 검증 테스트")
        
        # 1. 빈 데이터로 회원가입 (유효성 검증)
        try:
            response = requests.post(f"{self.base_url}/users/signup", 
                                   json={}, 
                                   headers={'Content-Type': 'application/json'})
            
            if response.status_code >= 400:
                self.log_result("빈 데이터 회원가입", "POST", "/users/signup", response.status_code, True, "적절한 에러 응답")
            else:
                self.log_result("빈 데이터 회원가입", "POST", "/users/signup", response.status_code, False, "유효성 검증 부족")
        except Exception as e:
            self.log_result("빈 데이터 회원가입", "POST", "/users/signup", 0, False, f"오류: {str(e)}")

        # 2. 잘못된 JSON 형식
        try:
            response = requests.post(f"{self.base_url}/users/login", 
                                   data="invalid json", 
                                   headers={'Content-Type': 'application/json'})
            
            if response.status_code >= 400:
                self.log_result("잘못된 JSON", "POST", "/users/login", response.status_code, True, "JSON 파싱 오류 처리")
            else:
                self.log_result("잘못된 JSON", "POST", "/users/login", response.status_code, False, "JSON 오류 처리 부족")
        except Exception as e:
            self.log_result("잘못된 JSON", "POST", "/users/login", 0, False, f"오류: {str(e)}")

    def run_all_tests(self):
        print("🚀 Eoullim Backend API 전체 테스트 시작!")
        print("=" * 50)
        
        start_time = time.time()
        
        self.test_user_apis()
        self.test_post_apis()
        self.test_comment_apis()
        self.test_validation_and_errors()
        
        end_time = time.time()
        
        print("\n" + "=" * 50)
        print("📊 테스트 결과 요약")
        print("=" * 50)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result['success'])
        failed_tests = total_tests - passed_tests
        
        print(f"총 테스트: {total_tests}개")
        print(f"✅ 성공: {passed_tests}개")
        print(f"❌ 실패: {failed_tests}개")
        print(f"⏱️ 소요 시간: {end_time - start_time:.2f}초")
        print(f"📈 성공률: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n❌ 실패한 테스트들:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  - {result['test']}: {result['method']} {result['endpoint']} → {result['message']}")

if __name__ == "__main__":
    tester = EoullimAPITester()
    tester.run_all_tests()