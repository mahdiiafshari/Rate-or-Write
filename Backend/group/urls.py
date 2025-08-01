from django.urls import path
from .views import (
    GroupCreateView, GroupListView, AddMemberToGroupView,
    SharePostToGroupView, GroupPostsListView, GroupDeleteView
)

urlpatterns = [
    path('', GroupListView.as_view(), name='group-list'),
    path('create/', GroupCreateView.as_view(), name='group-create'),
    path('<int:group_id>/add-member/', AddMemberToGroupView.as_view(), name='group-add-member'),
    path('<int:group_id>/share-post/', SharePostToGroupView.as_view(), name='group-share-post'),
    path('<int:group_id>/posts/', GroupPostsListView.as_view(), name='group-posts'),
    path('<int:id>/delete/', GroupDeleteView.as_view(), name='group-delete'),
]
