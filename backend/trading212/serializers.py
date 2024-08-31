from django.contrib.auth.models import User
from .models import Connection, BuyAndSell, BuyingAndSelling
from rest_framework import serializers
import requests
import json
import yfinance as yf


from django.core.files import File
import base64

class ConnectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Connection
        fields = ["account", "api_key"]

    def create(self, validated_data):
        connection = Connection.objects.create(**validated_data)

        return connection
    
class StockHistorySerializer(serializers.ModelSerializer):  
    class Meta:
        model = BuyingAndSelling
        fields = ["account", "type", "quantity", "ticker", "priceOfStock", "date"]
        
    
    def create(self, validated_data):
        connection = BuyingAndSelling.objects.create(**validated_data)
        return connection
    
class BuySerializer(serializers.ModelSerializer):

    class Meta:
        model = BuyingAndSelling
        fields = ["account", "quantity", "ticker"]

    def create(self, validated_data):
        validated_data["quantity"] = float(validated_data["quantity"])
        validated_data["type"] = 1

        ticker = validated_data["ticker"]
        ticker = ticker.split('_')[0]

        stock = yf.Ticker(ticker)
        print(stock.info)
        priceOfStock= stock.info['currentPrice']
        validated_data["priceOfStock"] = priceOfStock

        api_key = Connection.objects.get(account=validated_data["account"]).api_key

        url = "https://demo.trading212.com/api/v0/equity/orders/market"

        payload = {
        "quantity": validated_data["quantity"],
        "ticker": validated_data["ticker"],
        }

        headers = {
        "Content-Type": "application/json",
        "Authorization": api_key
        }

        response = requests.post(url, json=payload, headers=headers)

        data = response.json()

        connection = BuyingAndSelling.objects.create(**validated_data)
        return connection
    
class SellSerializer(serializers.ModelSerializer):

    class Meta:
        model = BuyingAndSelling
        fields = ["account", "quantity", "ticker"]

    def create(self, validated_data):
        validated_data["quantity"] = float(validated_data["quantity"])
        validated_data["type"] = 2

        ticker = validated_data["ticker"]
        ticker = ticker.split('_')[0]

        stock = yf.Ticker(ticker)
        print(stock.info)
        priceOfStock= stock.info['currentPrice']
        validated_data["priceOfStock"] = priceOfStock

        api_key = Connection.objects.get(account=validated_data["account"]).api_key

        url = "https://demo.trading212.com/api/v0/equity/orders/market"

        payload = {
        "quantity": validated_data["quantity"] * -1,
        "ticker": validated_data["ticker"],
        }

        headers = {
        "Content-Type": "application/json",
        "Authorization": api_key
        }

        response = requests.post(url, json=payload, headers=headers)

        data = response.json()


        connection = BuyingAndSelling.objects.create(**validated_data)
        return connection


'''
class BuySerializer(serializers.ModelSerializer):

    class Meta:
        model = BuyingAndSelling
        fields = ["account", "type", "quantity", "ticker"]

    def create(self, validated_data):
        validated_data["quantity"] = float(validated_data["quantity"])
        print(validated_data)

        url = "https://demo.trading212.com/api/v0/equity/orders/market"

        payload = {
        "quantity": validated_data["quantity"],
        "ticker": validated_data["ticker"],
        }

        headers = {
        "Content-Type": "application/json",
        "Authorization": "15118970ZDgvexajeSpXUPlhuNeVywUhVdxmt"
        }

        response = requests.post(url, json=payload, headers=headers)

        #data = response.json()

        #if response.status_code != 200:
        #    raise serializers.ValidationError(validated_data)

        string = "AAPL"

        stock = yf.Ticker('TSLA')
        priceOfStock= stock.info['currentPrice']
        print(priceOfStock)
        validated_data["priceOfStock"] = priceOfStock


        buyAndSell = BuyAndSell.objects.create(**validated_data)

        return buyAndSell
'''


'''
class ImageSerializer(serializers.ModelSerializer):

    base64_image = serializers.SerializerMethodField()

    class Meta:
        model = Image
        fields = ('base64_image', 'id')

    def get_base64_image(self, obj):
        f = open("../images/AAPL.png", 'rb')
        image = File(f)
        data = base64.b64encode(image.read())
        f.close()
        return data

'''