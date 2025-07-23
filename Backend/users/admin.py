from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from .models import CustomUser, GenderChoices

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    """
    Admin configuration for the CustomUser model.
    Extends UserAdmin to inherit default user management features.
    """
    model = CustomUser
    list_display = ['username', 'email', 'get_full_name', 'gender', 'is_active', 'is_staff', 'date_joined']
    list_filter = ['gender', 'is_active', 'is_staff', 'groups']
    search_fields = ['username', 'first_name', 'last_name', 'email', 'bio']
    list_editable = ['is_active', 'is_staff']
    date_hierarchy = 'date_joined'
    ordering = ['-date_joined']

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'email', 'bio', 'profile_picture', 'gender')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'first_name', 'last_name', 'bio', 'profile_picture', 'gender'),
        }),
    )
    readonly_fields = ['last_login', 'date_joined']

    def get_full_name(self, obj):
        return obj.get_full_name() or obj.username
    get_full_name.short_description = _('Full Name')