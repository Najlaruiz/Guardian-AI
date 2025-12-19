import requests
import sys
import json
from datetime import datetime

class GuardianAITester:
    def __init__(self, base_url="https://securetech-hub-6.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.session = requests.Session()
        self.session.timeout = 30

    def log_test(self, name, success, details=""):
        """Log test results"""
        self.tests_run += 1
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {name}")
        if details:
            print(f"    {details}")
        
        if success:
            self.tests_passed += 1
        else:
            self.failed_tests.append({"test": name, "details": details})

    def test_health_check(self):
        """Test basic API health"""
        try:
            response = self.session.get(f"{self.base_url}/health")
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                details += f", Response: {response.json()}"
            self.log_test("Health Check", success, details)
            return success
        except Exception as e:
            self.log_test("Health Check", False, f"Error: {str(e)}")
            return False

    def test_root_endpoint(self):
        """Test root API endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/")
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                data = response.json()
                details += f", Message: {data.get('message', 'N/A')}"
            self.log_test("Root Endpoint", success, details)
            return success
        except Exception as e:
            self.log_test("Root Endpoint", False, f"Error: {str(e)}")
            return False

    def test_services_endpoint(self):
        """Test services listing"""
        try:
            response = self.session.get(f"{self.base_url}/services")
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                services = response.json()
                details += f", Services count: {len(services)}"
                # Check if we have the expected 3 services
                expected_services = ['data-device-protection', 'cybersecurity-consultation', 'automated-ai-solutions']
                found_slugs = [s.get('slug') for s in services]
                if all(slug in found_slugs for slug in expected_services):
                    details += ", All expected services found"
                else:
                    success = False
                    details += f", Missing services. Found: {found_slugs}"
            self.log_test("Services Endpoint", success, details)
            return success, response.json() if success else []
        except Exception as e:
            self.log_test("Services Endpoint", False, f"Error: {str(e)}")
            return False, []

    def test_specific_service(self, slug):
        """Test specific service endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/services/{slug}")
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                service = response.json()
                details += f", Service: {service.get('title', 'N/A')}"
            self.log_test(f"Service {slug}", success, details)
            return success
        except Exception as e:
            self.log_test(f"Service {slug}", False, f"Error: {str(e)}")
            return False

    def test_admin_login(self):
        """Test admin login"""
        try:
            login_data = {
                "email": "admin@guardianai.com",
                "password": "admin123"
            }
            response = self.session.post(f"{self.base_url}/auth/login", json=login_data)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                data = response.json()
                self.token = data.get('access_token')
                user = data.get('user', {})
                details += f", User: {user.get('email')}, Role: {user.get('role')}"
                if user.get('role') != 'admin':
                    success = False
                    details += " - ERROR: Not admin role"
            
            self.log_test("Admin Login", success, details)
            return success
        except Exception as e:
            self.log_test("Admin Login", False, f"Error: {str(e)}")
            return False

    def test_contact_submission(self):
        """Test contact form submission"""
        try:
            contact_data = {
                "name": "Test User",
                "email": "test@example.com",
                "phone": "+1234567890",
                "subject": "Test Contact",
                "message": "This is a test message from automated testing."
            }
            response = self.session.post(f"{self.base_url}/contact", json=contact_data)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                data = response.json()
                details += f", Contact ID: {data.get('id', 'N/A')}"
            
            self.log_test("Contact Submission", success, details)
            return success
        except Exception as e:
            self.log_test("Contact Submission", False, f"Error: {str(e)}")
            return False

    def test_chat_endpoint(self):
        """Test chat functionality"""
        try:
            chat_data = {
                "message": "Hello, I need help with cybersecurity services",
                "session_id": f"test_session_{datetime.now().timestamp()}"
            }
            response = self.session.post(f"{self.base_url}/chat", json=chat_data)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                data = response.json()
                ai_response = data.get('ai_response', '')
                details += f", AI Response length: {len(ai_response)} chars"
                if len(ai_response) < 10:
                    success = False
                    details += " - ERROR: Response too short"
            
            self.log_test("Chat Endpoint", success, details)
            return success
        except Exception as e:
            self.log_test("Chat Endpoint", False, f"Error: {str(e)}")
            return False

    def test_admin_dashboard(self):
        """Test admin dashboard with authentication"""
        if not self.token:
            self.log_test("Admin Dashboard", False, "No auth token available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.token}"}
            response = self.session.get(f"{self.base_url}/admin/dashboard", headers=headers)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                data = response.json()
                details += f", Contacts: {data.get('total_contacts', 0)}, Revenue: ${data.get('total_revenue', 0)}"
            
            self.log_test("Admin Dashboard", success, details)
            return success
        except Exception as e:
            self.log_test("Admin Dashboard", False, f"Error: {str(e)}")
            return False

    def test_admin_contacts(self):
        """Test admin contacts endpoint"""
        if not self.token:
            self.log_test("Admin Contacts", False, "No auth token available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.token}"}
            response = self.session.get(f"{self.base_url}/admin/contacts", headers=headers)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                contacts = response.json()
                details += f", Contacts count: {len(contacts)}"
            
            self.log_test("Admin Contacts", success, details)
            return success
        except Exception as e:
            self.log_test("Admin Contacts", False, f"Error: {str(e)}")
            return False

    def test_stripe_checkout(self):
        """Test Stripe checkout creation"""
        try:
            checkout_data = {
                "service_id": "test-service-id",
                "pricing_id": "data-protection-monthly",
                "origin_url": "https://securetech-hub-6.preview.emergentagent.com"
            }
            response = self.session.post(f"{self.base_url}/payments/checkout", json=checkout_data)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                data = response.json()
                checkout_url = data.get('checkout_url', '')
                details += f", Checkout URL present: {bool(checkout_url)}"
                if not checkout_url:
                    success = False
                    details += " - ERROR: No checkout URL"
            
            self.log_test("Stripe Checkout", success, details)
            return success
        except Exception as e:
            self.log_test("Stripe Checkout", False, f"Error: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all tests in sequence"""
        print("🚀 Starting Guardian AI Backend Tests")
        print("=" * 50)
        
        # Basic connectivity tests
        if not self.test_health_check():
            print("❌ Health check failed - stopping tests")
            return False
        
        self.test_root_endpoint()
        
        # Services tests
        services_success, services = self.test_services_endpoint()
        if services_success and services:
            # Test individual services
            for service in services[:3]:  # Test first 3 services
                self.test_specific_service(service.get('slug'))
        
        # Authentication and admin tests
        if self.test_admin_login():
            self.test_admin_dashboard()
            self.test_admin_contacts()
        
        # Functional tests
        self.test_contact_submission()
        self.test_chat_endpoint()
        self.test_stripe_checkout()
        
        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} passed")
        
        if self.failed_tests:
            print("\n❌ Failed Tests:")
            for test in self.failed_tests:
                print(f"  - {test['test']}: {test['details']}")
        
        success_rate = (self.tests_passed / self.tests_run) * 100 if self.tests_run > 0 else 0
        print(f"✅ Success Rate: {success_rate:.1f}%")
        
        return success_rate >= 80  # Consider 80%+ as overall success

def main():
    tester = GuardianAITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())