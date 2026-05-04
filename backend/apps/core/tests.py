from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from django.urls import reverse

User = get_user_model()


class AuthenticationTests(APITestCase):
    
    def test_user_registration(self):
        """Test user registration."""
        data = {
            'email': 'test@example.com',
            'username': 'testuser',
            'first_name': 'Test',
            'last_name': 'User',
            'password': 'testpass123',
            'password_confirm': 'testpass123'
        }
        response = self.client.post(reverse('register'), data)
        self.assertEqual(response.status_code, 201)
        self.assertIn('token', response.data)
    
    def test_user_login(self):
        """Test user login."""
        User.objects.create_user(
            email='test@example.com',
            username='testuser',
            password='testpass123'
        )
        data = {
            'email': 'test@example.com',
            'password': 'testpass123'
        }
        response = self.client.post(reverse('login'), data)
        self.assertEqual(response.status_code, 200)
        self.assertIn('token', response.data)
