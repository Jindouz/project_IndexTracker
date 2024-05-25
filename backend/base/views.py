import csv
import os
import ccxt
from django.conf import settings
from django.http import FileResponse, HttpResponse, JsonResponse
from django.shortcuts import render
from django.views import View
import json
from rest_framework.response import Response
from base.models import WatchlistItem
from base.utils.intraday import intraday_daily, intraday_weekly
from base.utils.vader_sentiment_v1 import main
from base.utils.logger import log_401_error, log_action
import yfinance as yf
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.shortcuts import get_object_or_404




def get_csv_folder_path():
    return os.path.join(settings.DATA_ROOT)


#====Watchlist====

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_watchlist(request):
    if request.method == 'GET':
        # Get the watchlist items for the current user
        user = request.user
        watchlist_items = WatchlistItem.objects.filter(user=user)

        # Serialize the watchlist items to return as JSON response
        data = [{'symbol': item.symbol, 'date_added': item.date_added} for item in watchlist_items]
        return Response(data)
    return Response({'error': 'Invalid request'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_watchlist(request):
    if request.method == 'POST':
        symbol = request.data.get('symbol')  # Use request.data instead of request.POST
        if symbol:
            # Assuming the user is logged in
            user = request.user
            watchlist_item, created = WatchlistItem.objects.get_or_create(user=user, symbol=symbol)
            if created:
                return Response({'message': 'Added to watchlist'})
            else:
                return Response({'message': 'Already in watchlist'})
    return Response({'error': 'Invalid request'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_from_watchlist(request):
    if request.method == 'POST':
        symbol = request.data.get('symbol')  # Use request.data instead of request.POST
        if symbol:
            # Assuming the user is logged in
            user = request.user
            try:
                watchlist_item = WatchlistItem.objects.get(user=user, symbol=symbol)
                watchlist_item.delete()
                return Response({'message': 'Removed from watchlist'})
            except WatchlistItem.DoesNotExist:
                return Response({'error': 'Item not found in watchlist'})
    return Response({'error': 'Invalid request'})

#====Intraday Data=====

@method_decorator(csrf_exempt, name='dispatch')
class IntradayDataResource(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            # Get symbol from the request data
            symbol = data.get('symbol')

            csv_file = intraday_daily(symbol)

            if csv_file:
                # Check if the file exists
                if os.path.exists(csv_file):
                    # return FileResponse(csv_file, as_attachment=True)
                    return FileResponse(open(csv_file, 'rb'), as_attachment=True)
                else:
                    return HttpResponse('File not found.', status=404)
            else:
                return HttpResponse(json.dumps({'error': f"Symbol '{symbol}' not found."}), content_type='application/json', status=404)
        except Exception as e:
            print('Error:', e)
            return HttpResponse(json.dumps({'error': str(e)}), content_type='application/json', status=500)

@method_decorator(csrf_exempt, name='dispatch')
class IntradayDataWeeklyResource(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            # Get symbol from the request data
            symbol = data.get('symbol')
            # utils_folder = os.path.join(BASE_DIR, 'utils')
            csv_file = intraday_weekly(symbol)
            if csv_file:
                # Check if the file exists
                if os.path.exists(csv_file):
                    print(f"Symbol requested: {symbol}")
                    # return FileResponse(csv_file, as_attachment=True)
                    return FileResponse(open(csv_file, 'rb'), as_attachment=True)
                else:
                    return HttpResponse('File not found.', status=404)
            else:
                return HttpResponse(json.dumps({'error': f"Symbol '{symbol}' not found."}), content_type='application/json', status=404)
        except Exception as e:
            print('Error:', e)
            return HttpResponse(json.dumps({'error': str(e)}), content_type='application/json', status=500)


@method_decorator(csrf_exempt, name='dispatch')
class CurrentPriceResource(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            # Get symbol from the request data
            symbol = data.get('symbol')
            ticker = yf.Ticker(symbol)
            current_price = ticker.info.get('currentPrice')
            
            # If regular price retrieval succeeds, return the result
            if current_price:
                # return {'symbol': symbol, 'current_price': current_price}, 200
                return JsonResponse({'symbol': symbol, 'current_price': current_price}, status=200)
            
            
            # If regular price retrieval fails, try fetching using ccxt
            else:
                # Initialize the ccxt exchange object for Binance
                exchange = ccxt.binance()

                # Load markets
                exchange.load_markets()

                # Check if the symbol is available in the exchange
                ccxt_symbol = f"{symbol}/USDT"
                if ccxt_symbol.upper() in exchange.symbols:
                    # Fetch ticker data for the symbol
                    ticker = exchange.fetch_ticker(ccxt_symbol.upper())

                    # Extract current price from ticker data
                    current_price = ticker['last']

                    return JsonResponse({'symbol': symbol, 'current_price': current_price}, status=200)
                else:
                    return HttpResponse(json.dumps({'error': f"Unable to fetch current price for symbol '{symbol}'"}), content_type='application/json', status=404)
        
        except Exception as e:
            return HttpResponse(json.dumps({'error': str(e)}), content_type='application/json', status=500)

#====Symbols Lists====

@method_decorator(csrf_exempt, name='dispatch')
class SymbolsResource(View):
    def get(self, request):
        try:
            # Define the path to your CSV file
            csv_file_path = os.path.join(get_csv_folder_path(),'stock_symbols.csv')
            print(csv_file_path)
            symbols = []

            ## Open the CSV file and read the symbols and names
            with open(csv_file_path, mode='r') as csvfile:
                csvreader = csv.DictReader(csvfile)
                for row in csvreader:
                    # Assuming the CSV columns are 'symbol' and 'name'
                    symbols.append({'Symbol': row['Symbol'], 'Name': row['Name']})

            return JsonResponse({'Symbols': symbols}, status=200)
        except Exception as e:
            # app.logger.error(f"Failed to fetch stock symbols: {str(e)}")
            return HttpResponse(json.dumps({'error': 'Failed to fetch stock symbols'}), content_type='application/json', status=500)



@method_decorator(csrf_exempt, name='dispatch')
class CryptoSymbolsResource(View):
    def get(self, request):
        try:
            # Define the path to your CSV file
            csv_file_path = os.path.join(get_csv_folder_path(),'crypto_symbols.csv')
            symbols = []

            ## Open the CSV file and read the symbols and names
            with open(csv_file_path, mode='r', encoding='utf-8') as csvfile:  # Specify the encoding
                csvreader = csv.DictReader(csvfile)
                for row in csvreader:
                    # Assuming the CSV columns are 'symbol' and 'name'
                    symbols.append({'Symbol': row['Symbol'], 'Name': row['Name']})

            return JsonResponse({'Symbols': symbols}, status=200)
        except Exception as e:
            # app.logger.error(f"Failed to fetch crypto symbols: {str(e)}")
            return HttpResponse(json.dumps({'error': 'Failed to fetch crypto symbols'}), content_type='application/json', status=500)


#====AI Sentiment Analysis====

@method_decorator(csrf_exempt, name='dispatch')
class SentimentAnalysisResource(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            # Get symbol from the request data
            stock_symbol = data.get('symbol')
            # Get the stock symbol from the request data
            # stock_symbol = request.json['symbol']
            print(f"Symbol requested: {stock_symbol}")

            # Call the function to perform sentiment analysis and get the overall sentiment message
            overall_sentiment = main(stock_symbol)
            print(f"Overall sentiment for {stock_symbol}: {overall_sentiment}")

            # Return the sentiment analysis result
            return JsonResponse({'message': overall_sentiment}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

#====Login====
        
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    @log_action("logged in")
    def get_token(cls, user):
        token = super().get_token(user)
 
        # Add custom claims
        token['username'] = user.username
        token['admin'] = user.is_superuser
        token['email'] = user.email
        # ...
 
        return token
 
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    def post(self, request, *args, **kwargs):
        # print("Request data:", request.data)
        try:
            response = super().post(request, *args, **kwargs)
        # print("Response data:", response.data)
        except AuthenticationFailed as e:
            # Log the 401 error
            log_401_error(str(e.detail))
            # Re-raise the exception to maintain expected behavior
            raise
        return response


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    if request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        
        if not username or not password or not email:
            return Response({'error': 'Username, password, and email are required'}, status=400)

        # Check if the username or email already exists
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=400)
        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists'}, status=400)

        # Create the user
        user = User.objects.create(
            username=username,
            password=make_password(password),
            email=email
        )
        return Response({'message': 'User created successfully'}, status=201)

    return Response({'error': 'Invalid request'}, status=405)

@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token(request):
    refresh_token = request.data.get('refreshToken')

    if not refresh_token:
        return Response({'error': 'Refresh token is required'}, status=400)

    try:
        refresh = RefreshToken(refresh_token)
        access_token = str(refresh.access_token)
        return Response({'access': access_token}, status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=400)
    

#====Password Management====

@api_view(['POST'])
def password_reset_request(request):
    email = request.data.get('email')
    user = get_object_or_404(User, email=email)
    token = default_token_generator.make_token(user)
    reset_url = f"http://localhost:3000/resetconfirm/{user.id}/{token}" # for development
    # reset_url = f"https://index-tracker.netlify.app/resetconfirm/{user.id}/{token}" # for production
    send_mail(
        'Password Reset',
        f'Please click the following link to reset your password: {reset_url}',
        'jindouz@rr4.de',
        [user.email],
        fail_silently=False,
    )
    return Response({'message': 'Password reset email sent'})


@api_view(['POST'])
def password_reset_confirm(request, user_id, token):
    user = get_object_or_404(User, pk=user_id)
    if default_token_generator.check_token(user, token):

        new_password = request.data.get('new_password')
        # print(new_password)

        user.set_password(new_password)
        user.save()

        return Response({'message': 'Password reset successfully'})
    else:
        return Response({'error': 'Invalid token'}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    current_password = request.data.get('current_password')
    new_password = request.data.get('new_password')

    if user.check_password(current_password):

        user.set_password(new_password)
        user.save()

        return Response({'message': 'Password changed successfully'})
    else:
        return Response({'error': 'Current password is incorrect'}, status=400)


#====Admin Logs====

@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_logs(request):
    # print(f"User: {request.user}, Is Admin: {request.user.is_staff}")
    log_file_path = os.path.join(settings.LOGS_ROOT, 'logger.log')

    if not os.path.exists(log_file_path):
        return JsonResponse({'error': 'Log file does not exist.'}, status=404)

    try:
        with open(log_file_path, 'r') as log_file:
            log_content = log_file.read()
        return JsonResponse({'logs': log_content}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)



@api_view(['GET'])
@permission_classes([AllowAny])
def index(request):
    return Response({''})