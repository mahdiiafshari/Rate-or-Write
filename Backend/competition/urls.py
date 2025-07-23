from django.urls import path
from .views import CompetitionCreateView, CompetitionListView, CompetitorRegisterView

urlpatterns = [
    path('create/', CompetitionCreateView.as_view(), name='competition-create'),
    path('', CompetitionListView.as_view(), name='competition-list'),
    path('register/', CompetitorRegisterView.as_view(), name='competitor-register'),
]