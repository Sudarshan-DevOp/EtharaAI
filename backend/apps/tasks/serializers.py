from rest_framework import serializers
from .models import Task, TaskComment


class TaskCommentSerializer(serializers.ModelSerializer):
    """Serializer for task comments."""
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = TaskComment
        fields = ('id', 'user', 'user_name', 'user_email', 'content', 'created_at', 'updated_at')
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')


class TaskSerializer(serializers.ModelSerializer):
    """Serializer for tasks."""
    project_name = serializers.CharField(source='project.name', read_only=True)
    assigned_to_name = serializers.CharField(source='assigned_to.get_full_name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    is_overdue = serializers.BooleanField(read_only=True)
    days_until_due = serializers.IntegerField(read_only=True)
    comments = TaskCommentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Task
        fields = (
            'id', 'title', 'description', 'project', 'project_name', 'assigned_to',
            'assigned_to_name', 'created_by', 'created_by_name', 'status', 'priority',
            'due_date', 'start_date', 'is_overdue', 'days_until_due', 'completed_at',
            'comments', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_by', 'completed_at', 'created_at', 'updated_at')


class TaskCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating tasks."""
    
    class Meta:
        model = Task
        fields = ('title', 'description', 'project', 'assigned_to', 'status', 'priority', 'due_date', 'start_date')
    
    def validate_assigned_to(self, value):
        if value:
            # Check if user is in the project's team
            project = self.initial_data.get('project')
            if project:
                # This check will be done at a higher level since we don't have access to request here
                pass
        return value
