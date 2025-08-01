from rest_framework import permissions


class IsGroupOwner(permissions.BasePermission):
    """
    Custom permission to allow only the owner of the group to delete it.
    """

    def has_object_permission(self, request, view, obj):
        return obj.created_by == request.user