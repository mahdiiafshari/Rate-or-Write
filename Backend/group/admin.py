from django.contrib import admin
from django import forms
from django.contrib.auth import get_user_model
from .models import GroupModel, GroupPostShare, GroupMembership
from post.models import Post

User = get_user_model()

class GroupMembershipInline(admin.TabularInline):
    model = GroupMembership
    extra = 1
    autocomplete_fields = ['user']
    fields = ['user', 'role', 'joined_at']
    readonly_fields = ['joined_at']

    def get_queryset(self, request):
        # Optimize queryset to include related user data
        return super().get_queryset(request).select_related('user')

class GroupPostShareInline(admin.TabularInline):
    model = GroupPostShare
    extra = 1
    autocomplete_fields = ['post', 'shared_by']
    readonly_fields = ['shared_at']

@admin.register(GroupModel)
class GroupModelAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_by', 'created_at', 'member_count']
    search_fields = ['name', 'created_by__username']
    inlines = [GroupMembershipInline, GroupPostShareInline]
    readonly_fields = ['created_by', 'created_at']

    def member_count(self, obj):
        return obj.memberships.count()
    member_count.short_description = 'Total Members'

    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)

    def save_related(self, request, form, formsets, change):
        super().save_related(request, form, formsets, change)
        # Ensure the creator is added as an owner if not already in memberships
        if not change:  # Only on creation
            GroupMembership.objects.get_or_create(
                group=form.instance,
                user=request.user,
                defaults={'role': 'owner'}
            )

@admin.register(GroupPostShare)
class GroupPostShareAdmin(admin.ModelAdmin):
    list_display = ['group', 'post', 'shared_by', 'shared_at']
    list_filter = ['group', 'shared_by']
    search_fields = ['post__content', 'group__name', 'shared_by__username']

@admin.register(GroupMembership)
class GroupMembershipAdmin(admin.ModelAdmin):
    list_display = ['user', 'group', 'role', 'joined_at']
    list_filter = ['role', 'group']
    search_fields = ['user__username', 'group__name']
    autocomplete_fields = ['user', 'group']
    readonly_fields = ['joined_at']