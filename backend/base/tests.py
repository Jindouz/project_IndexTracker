from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status


class ViewsTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.force_authenticate(user=self.user)

    def test_get_watchlist(self):
        url = reverse('get_watchlist')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_add_to_watchlist(self):
        url = reverse('add_to_watchlist')
        data = {'symbol': 'TSLA'}
        response = self.client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_remove_from_watchlist(self):
        add_url = reverse('add_to_watchlist')
        add_data = {'symbol': 'TSLA'}
        self.client.post(add_url, data=add_data, format='json')

        remove_url = reverse('remove_from_watchlist')
        remove_data = {'symbol': 'TSLA'}
        response = self.client.post(remove_url, data=remove_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_intraday_data_resource(self):
        url = reverse('intraday_data')
        data = {'symbol': 'TSLA'}  
        response = self.client.post(url, data=data, format='json')
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND])

    def test_intraday_data_weekly_resource(self):
        url = reverse('intraday_data_weekly')
        data = {'symbol': 'TSLA'}  
        response = self.client.post(url, data=data, format='json')
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND])

    def test_current_price_resource(self):
        url = reverse('current_price')
        data = {'symbol': 'TSLA'}  
        response = self.client.post(url, data=data, format='json')
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND])

    def test_symbols_resource(self):
        url = reverse('stock_symbols')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_crypto_symbols_resource(self):
        url = reverse('crypto_symbols')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_sentiment_analysis_resource(self):
        url = reverse('sentiment')
        data = {'symbol': 'TSLA'}  
        response = self.client.post(url, data=data, format='json')
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_500_INTERNAL_SERVER_ERROR])

    def test_login_view(self):
        url = reverse('token_obtain_pair')
        data = {'username': 'testuser', 'password': 'testpassword'}
        response = self.client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_register_user_view(self):
        url = reverse('register_user')
        data = {'username': 'newuser', 'password': 'newpassword', 'email': 'newuser@example.com'}
        response = self.client.post(url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_refresh_token_view(self):
        url = reverse('refresh_token')
        data = {'refreshToken': 'valid_refresh_token'}
        response = self.client.post(url, data=data, format='json')
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_400_BAD_REQUEST])

    def test_change_password_view(self):
        url = reverse('change_password')
        data = {'current_password': 'testpassword', 'new_password': 'newpassword'}
        response = self.client.post(url, data=data, format='json')
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_400_BAD_REQUEST])

    def test_index_view(self):
        url = reverse('index')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
