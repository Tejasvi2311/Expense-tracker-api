from django.shortcuts import render
from rest_framework import generics, viewsets, permissions
from .models import Expense
from django.contrib.auth.models import User
from .serializers import RegisterSerializer, ExpenseSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum
from django.utils.timezone import now



class RegisterView(generics.CreateAPIView):
    queryset=User.objects.all()
    serializer_class=RegisterSerializer

class ExpenseView(viewsets.ModelViewSet):
    serializer_class=ExpenseSerializer
    permission_classes=[permissions.IsAuthenticated]

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user)

    def perform_create(self,serializer):
        serializer.save(user=self.request.user)

    filter_backends=[DjangoFilterBackend]
    filterset_fields=['category','date']

class MonthlyReportView(APIView):

    def get(self,request):
        today=now()
        expenses=Expense.objects.filter(
            date__year=today.year,
            date__month=today.month,
            user=request.user
        )

        total=expenses.aggregate(Sum('amount'))['amount__sum'] or 0
        category_summary= expenses.values('category').annotate(total=Sum('amount'))

        result={'total':total}
        for item in category_summary:
            result[item['category']]=item['total']
        return Response(result)

# Create your views here.
