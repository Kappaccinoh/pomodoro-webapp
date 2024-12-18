from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
from .models import Task
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

    @action(detail=True, methods=['post'])
    def update_time(self, request, pk=None):
        """Update time spent on a task"""
        task = self.get_object()
        seconds = request.data.get('seconds', 0)
        task.time_spent += int(seconds)
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
            'total_time_spent': total_time,
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