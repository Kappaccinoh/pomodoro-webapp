from django.db import models
from django.contrib.auth.models import User

class Task(models.Model):
    STATUS_CHOICES = [
        ('todo', 'Todo'),
        ('in-progress', 'In Progress'),
        ('completed', 'Completed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='todo')
    allocated_hours = models.FloatField(help_text="Number of hours allocated for the task")
    time_spent = models.FloatField(
        default=0.0,
        help_text="Number of hours spent on the task"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    @property
    def hours_remaining(self):
        """Calculate remaining hours"""
        return max(0, self.allocated_hours - self.time_spent)

    @property
    def completion_percentage(self):
        """Calculate completion percentage"""
        if self.allocated_hours == 0:
            return 0
        return min(100, (self.time_spent / self.allocated_hours) * 100)