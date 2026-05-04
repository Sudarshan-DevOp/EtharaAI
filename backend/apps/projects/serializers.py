from rest_framework import serializers
from .models import Project


class ProjectSerializer(serializers.ModelSerializer):
    """Serializer for projects."""
    team_name = serializers.CharField(source='team.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    task_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = (
            'id', 'name', 'description', 'team', 'team_name', 'created_by', 
            'created_by_name', 'status', 'start_date', 'end_date', 'task_count',
            'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_by', 'created_at', 'updated_at')
    
    def get_task_count(self, obj):
        return obj.tasks.count()


class ProjectCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating projects."""
    
    class Meta:
        model = Project
        fields = ('name', 'description', 'team', 'status', 'start_date', 'end_date')
    
    def validate_team(self, value):
        # Check if user has permission to create project in this team
        user = self.context['request'].user
        if value.owner != user and user not in value.members.all():
            raise serializers.ValidationError('You do not have permission to create projects in this team.')
        return value
