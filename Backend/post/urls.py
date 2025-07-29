from django.urls import path, include
from .views import CategoryListCreateView, CategoryDetailView, PostListCreateView, PostDetailView, PostLikeViewSet, \
    MyPostsListView, PostCollectionCreateView, PostCollectionListView, AddPostToCollectionView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'study-post-likes', PostLikeViewSet, basename='study-post-like')
urlpatterns = [
    path('categories/', CategoryListCreateView.as_view(), name='category-list-create'),
    path('categories/<int:pk>/', CategoryDetailView.as_view(), name='category-detail'),
    path('', PostListCreateView.as_view(), name='post-list-create'),
    path('<int:pk>/', PostDetailView.as_view(), name='post-detail'),
    path('', include(router.urls)),
    path('mine/', MyPostsListView.as_view(), name='my-posts'),
    path('collections/create/', PostCollectionCreateView.as_view(), name='collection-create'),
    path('collections/', PostCollectionListView.as_view(), name='collection-list'),
    path("collections/<int:pk>/add/", AddPostToCollectionView.as_view(), name="collection-add-post"),

]
