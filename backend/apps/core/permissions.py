from rest_framework import permissions


class IsOwner(permissions.BasePermission):
    """
    Custom permission to check if user is the owner of an object.
    """
    def has_object_permission(self, request, view, obj):
        if hasattr(obj, 'owner'):
            return obj.owner == request.user
        elif hasattr(obj, 'user'):
            return obj.user == request.user
        return False


class IsAdmin(permissions.BasePermission):
    """
    Custom permission to check if user is admin.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_admin


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to allow admins to edit and others to read-only.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated and request.user.is_admin


class IsProjectMember(permissions.BasePermission):
    """
    Custom permission to check if user is a member of the project.
    """
    def has_object_permission(self, request, view, obj):
        # Get project from the object
        if hasattr(obj, 'project'):
            project = obj.project
        else:
            project = obj
        
        return (
            project.team.owner == request.user or
            request.user in project.team.members.all()
        )
