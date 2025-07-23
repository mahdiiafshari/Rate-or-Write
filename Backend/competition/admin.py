from django.contrib import admin
from .models import Competition, Competitor

class CompetitorInline(admin.TabularInline):
    model = Competitor
    extra = 1
    fields = ['user', 'post', 'created_at']
    readonly_fields = ['created_at']
    can_delete = True

@admin.register(Competition)
class CompetitionAdmin(admin.ModelAdmin):
    list_display = ['name', 'status', 'is_public', 'category', 'competitor_count', 'created_at']
    list_filter = ['status', 'is_public', 'category']
    search_fields = ['name', 'bio']
    list_editable = ['status', 'is_public']
    inlines = [CompetitorInline]
    date_hierarchy = 'created_at'
    ordering = ['-created_at']

    def competitor_count(self, obj):
        return obj.competitor_count()
    competitor_count.short_description = 'Competitors'

@admin.register(Competitor)
class CompetitorAdmin(admin.ModelAdmin):
    list_display = ['user', 'competition', 'post', 'created_at']
    list_filter = ['competition', 'created_at']
    search_fields = ['user__username', 'competition__name']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']