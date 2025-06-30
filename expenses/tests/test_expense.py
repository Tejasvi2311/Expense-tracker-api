from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from .test_user import reverse
from expenses.models import Expense

class ExpenseTests(APITestCase):

    def setUp(self):
        self.user=User.objects.create_user(username='tejasvi',password='testpass123')
        url=reverse('token_obtain_pair')
        res=self.client.post(url,{'username':'tejasvi','password':'testpass123'})
        self.token=res.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')

    def test_create_expense(self):
        data={
            'amount':27000,
            'category':'INSURANCE',
            'description':'Anual health insurance premium'
        }
        response=self.client.post('/api/expenses/',data)
        self.assertEqual(response.status_code,status.HTTP_201_CREATED)
        self.assertEqual(Expense.objects.count(),1)
        self.assertEqual(Expense.objects.get().category,'INSURANCE')

    def test_expense_permission(self):

        self.client.credentials()
        response=self.client.get('/api/expenses/')
        self.assertEqual(response.status_code,status.HTTP_401_UNAUTHORIZED)
