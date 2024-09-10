from django.http import FileResponse
from django.shortcuts import render
from django.contrib.auth.models import User
from .models import Connection, BuyAndSell, BuyingAndSelling#, Image
from rest_framework import generics, viewsets
from .serializers import ConnectionSerializer, BuySerializer, StockHistorySerializer, SellSerializer#, ImageSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import authentication
import time
import datetime

import requests

import yfinance as yf
from azure.ai.ml import MLClient
from azure.identity import DefaultAzureCredential

from azure.core.exceptions import HttpResponseError

class CreateConnectionView(generics.CreateAPIView):
    queryset = Connection.objects.all()
    serializer_class = ConnectionSerializer
    permission_classes = [AllowAny]

class UpdateApi(generics.UpdateAPIView):
    queryset = Connection.objects.all()
    serializer_class = ConnectionSerializer
    permission_classes = [AllowAny]

    def update(self, request, *args, **kwargs):
        api_key_submitted = request.data.get('api_key')
        print(api_key_submitted)

        url = "https://demo.trading212.com/api/v0/equity/account/cash"

        headers = {"Authorization": api_key_submitted}

        response = requests.get(url, headers=headers)

        try:
            data = response.json()
        except:
            return Response("null")
        
        account_id = request.data.get('account')
        print(account_id)
        queryset = Connection.objects.filter(account=account_id).update(api_key=api_key_submitted)
        return Response({api_key_submitted})
           
    
class CheckConnection(APIView):
    serializer_class = ConnectionSerializer
    permission_classes = [AllowAny]

    def get(self, request, account, format=None):
        queryset = Connection.objects.filter(account=account)
        if not queryset:
            return Response("null")
        serializer = StockHistorySerializer(queryset, many=True)
        return Response(serializer.data)


class BalanceDetails(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [AllowAny]
    
    def get(self, request, api_key, format=None):

        url = "https://demo.trading212.com/api/v0/equity/account/cash"

        headers = {"Authorization": api_key}

        response = requests.get(url, headers=headers)

        try:
            data = response.json()

        except:
            data = "Invalid API Key"
        
        return Response(data)
        
class PositionDetails(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [AllowAny]
    
    def get(self, request, api_key, format=None):

        url = "https://demo.trading212.com/api/v0/equity/portfolio"

        headers = {"Authorization": api_key}

        response = requests.get(url, headers=headers)

        try:
            data = response.json()
        except:
            data = "Invalid API Key"

        for i in range(len(data)):
            ticker = data[i]['ticker']
            data[i]['ticker'] = ticker.split('_')[0]
            print(data[i]['ticker'])

                
        return Response(data)
                
class BuyStock(generics.CreateAPIView):
    queryset = BuyingAndSelling.objects.all()
    serializer_class = BuySerializer
    permission_classes = [AllowAny]

class SellStock(generics.CreateAPIView):
    queryset = BuyingAndSelling.objects.all()
    serializer_class = SellSerializer
    permission_classes = [AllowAny]

class StockHistory(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [AllowAny]
    
    def get(self, request, user, *args, **kwargs):

        connection = BuyingAndSelling.objects.filter(account=user).order_by('-date')

        if not connection:
            return Response("null")
        
        print(connection)
        
        serializer = StockHistorySerializer(connection, many=True)
        for i in range(len(serializer.data)):
            date = serializer.data[i]['date']
            date = datetime.datetime.strptime(date, "%Y-%m-%dT%H:%M:%S.%fZ")
            formatted_datetime = date.strftime("%Y-%m-%d %H:%M:%S")
            serializer.data[i]['date'] = formatted_datetime

            ticker = serializer.data[i]['ticker']
            ticker = ticker.split('_')[0]
            serializer.data[i]['ticker'] = ticker
        
        return Response(serializer.data)
    
class Price(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [AllowAny]
    
    def get(self, request, ticker, *args, **kwargs):
        stock = yf.Ticker(ticker)
        price = stock.info['currentPrice']
        return Response(price)
    
class SpecificPositions(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [AllowAny]
    
    def get(self, request, ticker, api_key, *args, **kwargs):

        stocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA']
        prices = {}

        for i in range(5):

            stock = stocks[i] + "_US_EQ"

            url = "https://demo.trading212.com/api/v0/equity/portfolio/" + stock

            headers = {"Authorization": api_key}

            response = requests.get(url, headers=headers)

            while response.status_code == 204:
                time.sleep(1)
                if response.status_code == 200:
                    break
                if response.status_code == 204:
                    response = requests.get(url, headers=headers)

            try:
                data = response.json()
            except:
                data = 1

            #prices.append(data['quantity'])
            print(data)
            prices[stocks[i]] = data['quantity']
            time.sleep(1)
        
        return Response(prices)

