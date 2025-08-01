from django.contrib import admin
from .models import GroupModel, GroupPostShare
from django import forms
from django.contrib.auth import get_user_model
from post.models import Post

User = get_user_model()

class GroupModelForm(forms.ModelForm):
    class Meta:
        model = GroupModel
        fields = ['name', 'users']

    users = forms.ModelMultipleChoiceField(
        queryset=User.objects.all(),
        widget=admin.widgets.FilteredSelectMultiple("Users", is_stacked=False)
    )

@admin.register(GroupModel)
class GroupModelAdmin(admin.ModelAdmin):
    form = GroupModelForm
    list_display = ['name',  'created_at']
    filter_horizontal = ['users']
    search_fields = ['name',]

class GroupPostShareInline(admin.TabularInline):
    model = GroupPostShare
    extra = 1
    autocomplete_fields = ['post', 'shared_by']
    readonly_fields = ['shared_at']


@admin.register(GroupPostShare)
class GroupPostShareAdmin(admin.ModelAdmin):
    list_display = ['group', 'post', 'shared_by', 'shared_at']
    list_filter = ['group', 'shared_by']
    search_fields = ['post__content', 'group__name', 'shared_by__username']
