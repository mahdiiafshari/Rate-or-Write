from rest_framework import permissions


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admins .
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff


class IsAuthorOrAdmin(permissions.BasePermission):
    """
    Custom permission to only allow admins and authors .
    """
    def has_object_permission(self, request, view, obj):
        # Allow read access to any authenticated user
        if request.method in permissions.SAFE_METHODS:
            return True
        # Allow write access (PUT, PATCH, DELETE) to the author or admin
        return obj.author == request.user or request.user.is_staff