from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from .models import Task
from django.urls import reverse

class TaskTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser', 
            password='testpass'
        )
        self.client.force_authenticate(user=self.user)
        
        self.task = Task.objects.create(
            user=self.user,
            title='Test Task',
            allocated_hours=2.0,
            status='todo'
        )

    def test_create_task(self):
        response = self.client.post('/api/tasks/', {
            'title': 'New Task',
            'allocated_hours': 1.5,
            'status': 'todo'
        })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Task.objects.count(), 2)

    def test_list_tasks(self):
        response = self.client.get('/api/tasks/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

    def test_get_task_detail(self):
        response = self.client.get(f'/api/tasks/{self.task.id}/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['title'], 'Test Task')

    def test_update_task(self):
        response = self.client.patch(f'/api/tasks/{self.task.id}/', {
            'title': 'Updated Task'
        })
        self.assertEqual(response.status_code, 200)
        self.task.refresh_from_db()
        self.assertEqual(self.task.title, 'Updated Task')

    def test_delete_task(self):
        response = self.client.delete(f'/api/tasks/{self.task.id}/')
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Task.objects.count(), 0)

    def test_update_task_time(self):
        response = self.client.post(f'/api/tasks/{self.task.id}/update_time/', {
            'seconds': 3600  # 1 hour
        })
        self.assertEqual(response.status_code, 200)
        self.task.refresh_from_db()
        self.assertEqual(self.task.time_spent, 1.0)

    def test_change_task_status(self):
        response = self.client.post(f'/api/tasks/{self.task.id}/change_status/', {
            'status': 'in-progress'
        })
        self.assertEqual(response.status_code, 200)
        self.task.refresh_from_db()
        self.assertEqual(self.task.status, 'in-progress')

    def test_search_tasks(self):
        Task.objects.create(
            user=self.user,
            title='Another Task',
            allocated_hours=1.0,
            status='todo'
        )
        response = self.client.get('/api/tasks/search/', {'q': 'Another'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

    def test_unauthorized_access(self):
        self.client.force_authenticate(user=None)
        response = self.client.get('/api/tasks/')
        self.assertEqual(response.status_code, 401)

    def test_task_validation(self):
        response = self.client.post('/api/tasks/', {
            'title': '',  # Empty title should fail
            'allocated_hours': -1,  # Negative hours should fail
            'status': 'invalid'  # Invalid status should fail
        })
        self.assertEqual(response.status_code, 400) 