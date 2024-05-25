from django.contrib import admin
from django.urls import path
from base import views

urlpatterns = [
    path('', views.index, name='index'),
    path('intraday_data', views.IntradayDataResource.as_view(), name='intraday_data'),
    path('intraday_data_weekly', views.IntradayDataWeeklyResource.as_view(), name='intraday_data_weekly'),
    path('current_price', views.CurrentPriceResource.as_view(), name='current_price'),
    path('stock_symbols', views.SymbolsResource.as_view(), name='stock_symbols'),
    path('crypto_symbols', views.CryptoSymbolsResource.as_view(), name='crypto_symbols'),
    path('sentiment', views.SentimentAnalysisResource.as_view(), name='sentiment'),
    path('add_to_watchlist', views.add_to_watchlist, name='add_to_watchlist'),
    path('remove_from_watchlist', views.remove_from_watchlist, name='remove_from_watchlist'),
    path('get_watchlist', views.get_watchlist, name='get_watchlist'),
    path('login', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register', views.register_user, name='register_user'),
    path('refresh-token', views.refresh_token, name='refresh_token'),
    path('change-password', views.change_password, name='change_password'),
    path('password-reset', views.password_reset_request, name='password_reset_request'),
    path('password-reset/confirm/<int:user_id>/<str:token>', views.password_reset_confirm, name='password_reset_confirm'),
    path('logs', views.get_logs, name='get_logs'),
]


