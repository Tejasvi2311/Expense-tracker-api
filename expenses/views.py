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
from rest_framework import status
from django.db import IntegrityError
from rest_framework.parsers import MultiPartParser, FormParser



class RegisterView(generics.CreateAPIView):
    queryset=User.objects.all()
    serializer_class=RegisterSerializer

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError:
            return Response(
                {"error": "Username already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )


class ExpenseView(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        print("🔍 Incoming POST:", request.data)
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("❌ Validation errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category', 'date']

from datetime import datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils.timezone import now
from django.db.models import Sum
from .models import Expense  # Make sure this is correct

class MonthlyReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Parse query parameters
        month = request.query_params.get('month')
        year = request.query_params.get('year')

        # Default to current month/year if not provided
        today = now()
        month = int(month) if month else today.month
        year = int(year) if year else today.year

        # Filter expenses by month, year, and user
        expenses = Expense.objects.filter(
            date__year=year,
            date__month=month,
            user=request.user
        )

        total = expenses.aggregate(Sum('amount'))['amount__sum'] or 0
        category_summary = expenses.values('category').annotate(total=Sum('amount'))

        result = {'total': total}
        for item in category_summary:
            result[item['category']] = item['total']

        return Response(result)


# Create your views here.
