# Generated by Django 5.0.2 on 2024-08-25 20:18

import django.db.models.deletion
import trading212.models
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='BuyAndSell',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(choices=[(1, 'Buy'), (2, 'Sell')], default=None, max_length=9, validators=[trading212.models.validateChoice])),
                ('quantity', models.DecimalField(decimal_places=3, default=None, max_digits=10)),
                ('current_price', models.DecimalField(decimal_places=3, default=None, max_digits=10)),
                ('ticker', models.CharField(default=None, max_length=10)),
                ('account', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Connection',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('api_key', models.CharField(max_length=100)),
                ('account', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
