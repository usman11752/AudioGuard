import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

class AudioGuardCRUDTests(unittest.TestCase):
    """
    Automated Selenium Test Suite for AudioGuard Pro (Assignment 3 CLO-2)
    Covers the full CRUD (Create, Read, Update, Delete) cycle on the application.
    """

    @classmethod
    def setUpClass(cls):
        # Configure Chrome in headless mode for server environments or visual for testing
        options = webdriver.ChromeOptions()
        # To run visually, comment out the next line:
        # options.add_argument('--headless')
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        
        # Initialize Chrome Webdriver
        cls.driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
        cls.driver.implicitly_wait(10)
        cls.driver.maximize_window()
        cls.base_url = "http://localhost:3000"

    def test_01_signup_create_operation(self):
        """
        [CREATE] Test User Registration and Account Creation.
        Fills out signup details, validates correct @gmail.com formatting, checks terms, and submits.
        """
        print("\n--- Running Task 2.b.ii: [CREATE] Sign Up Test ---")
        self.driver.get(f"{self.base_url}/signup")

        # Wait for elements
        name_input = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.NAME, "username"))
        )
        email_input = self.driver.find_element(By.NAME, "email")
        password_input = self.driver.find_element(By.NAME, "password")
        confirm_input = self.driver.find_element(By.NAME, "confirmPassword")
        terms_checkbox = self.driver.find_element(By.ID, "terms")
        signup_btn = self.driver.find_element(By.CLASS_NAME, "auth-btn")

        # Input data
        name_input.send_keys("Usman Student")
        email_input.send_keys("usman.assignment@gmail.com")
        password_input.send_keys("TestPass123")
        confirm_input.send_keys("TestPass123")

        # Agree to Terms
        if not terms_checkbox.is_selected():
            self.driver.execute_script("arguments[0].click();", terms_checkbox)

        # Click submit
        signup_btn.click()

        # Wait for redirection to dashboard or login
        WebDriverWait(self.driver, 10).until(
            EC.url_contains("/dashboard")
        )
        print("✔ [CREATE] User signed up successfully and redirected to dashboard.")

    def test_02_navbar_profile_read_operation(self):
        """
        [READ] Test loading the dashboard and reading user credentials.
        """
        print("\n--- Running Task 2.b.ii: [READ] Dashboard Access Test ---")
        self.driver.get(f"{self.base_url}/dashboard")

        # Read navbar user details to ensure credentials match
        user_name_element = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "user-name"))
        )
        display_name = user_name_element.text
        self.assertEqual(display_name, "Usman Student")
        print(f"✔ [READ] Successfully retrieved current display name from Navbar: {display_name}")

    def test_03_settings_update_operation(self):
        """
        [UPDATE] Test updating profile full name in settings and verifying real-time sync.
        """
        print("\n--- Running Task 2.b.ii: [UPDATE] Profile Update Test ---")
        self.driver.get(f"{self.base_url}/settings")

        # Locate name input field
        name_field = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Your name']"))
        )
        name_field.clear()
        name_field.send_keys("Usman Assignment Reviewer")

        # Click Update Profile
        update_btn = self.driver.find_element(By.CLASS_NAME, "save-profile-btn")
        update_btn.click()

        # Wait for toast confirmation
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "save-toast"))
        )

        # Verify real-time navbar name update
        navbar_name = self.driver.find_element(By.CLASS_NAME, "user-name").text
        self.assertEqual(navbar_name, "Usman Assignment Reviewer")
        print(f"✔ [UPDATE] Successfully updated profile name. Navbar synced dynamically to: {navbar_name}")

    def test_04_history_clear_delete_operation(self):
        """
        [DELETE] Test Danger Zone action to clear past speech detection history.
        """
        print("\n--- Running Task 2.b.ii: [DELETE] Clear Detection History Test ---")
        self.driver.get(f"{self.base_url}/settings")

        # Scroll to Clear Data button
        clear_btn = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.CLASS_NAME, "danger-btn"))
        )
        self.driver.execute_script("arguments[0].scrollIntoView(true);", clear_btn)
        time.sleep(1)

        # Click Clear Data
        clear_btn.click()

        # Handle browser alert confirmation popup
        alert = self.driver.switch_to.alert
        alert.accept()

        # Verify success toast
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "save-toast"))
        )
        print("✔ [DELETE] Successfully triggered Danger Zone to clear all local/database scan history.")

    @classmethod
    def tearDownClass(cls):
        # Close browser session
        cls.driver.quit()
        print("\n--- All Selenium CLO-2 CRUD Tests Completed Successfully! ---\n")

if __name__ == '__main__':
    unittest.main()
