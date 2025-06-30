from rest_framework import status
from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from django.urls import reverse

class UserAuthTests(APITestCase):
    def test_register_user(self):
        url=reverse('register')

        data={
            'username':'tejasvi',
            'email':'tejasvi@example.com',
            'password':'testpass123',
        }

        response=self.client.post(url,data)
        self.assertEqual(response.status_code,status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(),1)
        self.assertEqual(User.objects.get().username,'tejasvi')

    def test_login_user(self):

        user=User.objects.create_user(username='tejasvi',password='testpass123')
        url=reverse('token_obtain_pair')
        data={'username':'tejasvi','password':'testpass123'}
        response=self.client.post(url,data)
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertIn('access',response.data)
        self.assertIn('refresh',response.data)




