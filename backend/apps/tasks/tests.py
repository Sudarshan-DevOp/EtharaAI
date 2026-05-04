from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from apps.core.models import Team
from apps.projects.models import Project
from .models import Task

User = get_user_model()


class TaskTests(APITestCase):
    
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            password='testpass123'
        )
        self.team = Team.objects.create(name='Test Team', owner=self.user)
        self.project = Project.objects.create(
            name='Test Project',
            team=self.team,
            created_by=self.user
        )
        self.client.force_authenticate(user=self.user)
    
    def test_create_task(self):
        """Test task creation."""
        data = {
            'title': 'Test Task',
            'description': 'A test task',
            'project': self.project.id,
            'priority': 'high',
            'status': 'pending'
        }
        response = self.client.post(reverse('task-create'), data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Task.objects.count(), 1)
