from django.urls import path,include
from .views import RegisterView,ExpenseView,MonthlyReportView
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView

router= DefaultRouter()
router.register('expenses',ExpenseView,basename='expense')

urlpatterns=[
    path('register/',RegisterView.as_view(),name='register'),
    path('token/',TokenObtainPairView.as_view(),name='token_obtain_pair'),
    path('token/refresh/',TokenRefreshView.as_view(),name='token_refresh'),
    path('reports/monthly/',MonthlyReportView.as_view(),name='monthly-report'),
    path('',include(router.urls)),
]