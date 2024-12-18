from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Task
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

    @action(detail=True, methods=['post'])
    def update_time(self, request, pk=None):
        task = self.get_object()
        seconds = request.data.get('seconds', 0)
        task.time_spent += int(seconds)
        task.save()
        return Response(self.get_serializer(task).data) 