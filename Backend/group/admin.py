from django.contrib import admin
from django import forms
from django.contrib.auth import get_user_model
from .models import GroupModel, GroupPostShare
from post.models import Post

User = get_user_model()

class GroupModelForm(forms.ModelForm):
    users = forms.ModelMultipleChoiceField(
        queryset=User.objects.all(),
        widget=admin.widgets.FilteredSelectMultiple("Users", is_stacked=False)
    )

    class Meta:
        model = GroupModel
        fields = ['name', 'users']

class GroupPostShareInline(admin.TabularInline):
    model = GroupPostShare
    extra = 1
    autocomplete_fields = ['post', 'shared_by']
    readonly_fields = ['shared_at']

@admin.register(GroupModel)
class GroupModelAdmin(admin.ModelAdmin):
    form = GroupModelForm
    list_display = ['name', 'created_by', 'created_at']
    filter_horizontal = ['users']
    search_fields = ['name', 'created_by__username']
    inlines = [GroupPostShareInline]


    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)

@admin.register(GroupPostShare)
class GroupPostShareAdmin(admin.ModelAdmin):
    list_display = ['group', 'post', 'shared_by', 'shared_at']
    list_filter = ['group', 'shared_by']
    search_fields = ['post__content', 'group__name', 'shared_by__username']
