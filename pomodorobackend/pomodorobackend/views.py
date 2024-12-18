from django.contrib.auth.models import User
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Sum
from .models import Task
from .serializers import TaskSerializer
from rest_framework.authentication import BasicAuthentication
from rest_framework.permissions import IsAuthenticated

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def update_time(self, request, pk=None):
        """Update time spent on a task"""
        task = self.get_object()
        # Convert seconds to hours (1 hour = 3600 seconds)
        seconds = request.data.get('seconds', 0)
        hours_to_add = float(seconds) / 3600
        
        task.time_spent = round(task.time_spent + hours_to_add, 4)  # Round to 4 decimal places
        task.save()
        return Response(self.get_serializer(task).data)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get task statistics for the user"""
        tasks = self.get_queryset()
        total_time = tasks.aggregate(total=Sum('time_spent'))['total'] or 0
        completed = tasks.filter(status='completed').count()
        in_progress = tasks.filter(status='in-progress').count()
        todo = tasks.filter(status='todo').count()

        return Response({
            'total_hours_spent': round(total_time, 2),
            'total_tasks': tasks.count(),
            'completed_tasks': completed,
            'in_progress_tasks': in_progress,
            'todo_tasks': todo
        })

    @action(detail=True, methods=['post'])
    def change_status(self, request, pk=None):
        """Change task status"""
        task = self.get_object()
        new_status = request.data.get('status')
        if new_status not in [s[0] for s in Task.STATUS_CHOICES]:
            return Response(
                {'error': 'Invalid status'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        task.status = new_status
        task.save()
        return Response(self.get_serializer(task).data)

    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search tasks by title"""
        query = request.query_params.get('q', '')
        tasks = self.get_queryset().filter(title__icontains=query)
        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data)
  