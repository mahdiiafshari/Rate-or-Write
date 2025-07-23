from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import Category, Post, PostLike
from users.models import CustomUser
from competition.models import Competitor

class PostInline(admin.TabularInline):
    model = Post
    extra = 1
    fields = ['title', 'category', 'status', 'created_at']
    readonly_fields = ['created_at']
    can_delete = True

class PostLikeInline(admin.TabularInline):
    model = PostLike
    extra = 0
    fields = ['user', 'created_at']
    readonly_fields = ['created_at']
    can_delete = True

class CompetitorInline(admin.TabularInline):
    model = Competitor
    extra = 0
    fields = ['competition', 'post', 'created_at']
    readonly_fields = ['created_at']
    can_delete = True

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Category model.
    """
    list_display = ['name', 'post_count']
    search_fields = ['name', 'description']
    inlines = [PostInline]
    ordering = ['name']

    def post_count(self, obj):
        return obj.posts.count()
    post_count.short_description = _('Post Count')

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Post model.
    """
    list_display = ['title', 'author', 'category', 'status', 'created_at', 'like_count', 'is_deleted']
    list_filter = ['status', 'category', 'is_deleted', 'created_at']
    search_fields = ['title', 'post', 'author__username']
    list_editable = ['status', 'is_deleted']
    inlines = [PostLikeInline, CompetitorInline]
    date_hierarchy = 'created_at'
    ordering = ['-created_at']
    fieldsets = (
        (None, {'fields': ('title', 'post', 'category')}),
        (_('Metadata'), {'fields': ('author', 'status', 'is_deleted')}),
        (_('Timestamps'), {'fields': ('created_at', 'updated_at'), 'classes': ['collapse']}),
    )
    readonly_fields = ['created_at', 'updated_at']

    def like_count(self, obj):
        return obj.likes.count()
    like_count.short_description = _('Like Count')

@admin.register(PostLike)
class PostLikeAdmin(admin.ModelAdmin):
    """
    Admin configuration for the PostLike model.
    """
    list_display = ['user', 'post_title', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__username', 'post__title']
    readonly_fields = ['created_at']
    ordering = ['-created_at']

    def post_title(self, obj):
        return obj.post.title
    post_title.short_description = _('Post')