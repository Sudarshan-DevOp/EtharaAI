from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from apps.core.models import Team
from .models import Project

User = get_user_model()


class ProjectTests(APITestCase):
    
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            password='testpass123'
        )
        self.team = Team.objects.create(name='Test Team', owner=self.user)
        self.client.force_authenticate(user=self.user)
    
    def test_create_project(self):
        """Test project creation."""
        data = {
            'name': 'Test Project',
            'description': 'A test project',
            'team': self.team.id,
            'status': 'active'
        }
        response = self.client.post(reverse('project-create'), data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Project.objects.count(), 1)
