from django.shortcuts import render
from btc_chart.models import BtcPrice
from django.http import JsonResponse
from datetime import datetime, timedelta
from collections import defaultdict

from django.core import serializers

from timeit import default_timer as timer


def localize_israel(date_time):
    return date_time #+ timedelta(hours = 2)

# Create your views here.
# .filter(time__gt = datetime.now() - timedelta(days=2))

def main_view(request):

    return render(request,'btc_chart/index.html')

def getBtcPrice_view(request):

    data = request.GET

    weeks = float(data.get('weeks',0))
    days = float(data.get('days',0))
    hours = float(data.get('hours',0))


    # local_time = localize_israel(datetime.now())
    now_utc = datetime.utcnow()
    time_range = timedelta(weeks =weeks,days = days, hours = hours)


    # method1 - single query
    # query = BtcPrice.objects.filter(time__gt = now_utc- time_range ).defer(
    #     'global_price_ils','bit2c_price_usd')
    #
    # last_row = query.latest('time')
    # ilsTousd = last_row.global_price_usd / last_row.global_price_ils
    #
    # query = query.values('time','bit2c_price_ils','global_price_usd')
    #
    #

    # method2 - two queries

    query = BtcPrice.objects.filter(time__gt = now_utc- time_range ).defer(
        'global_price_ils','bit2c_price_usd').values('time','bit2c_price_ils','global_price_usd')
    
    last_row = BtcPrice.objects.order_by('-time')[:1]
    ilsTousd = last_row.global_price_usd / last_row.global_price_ils



    response = {'priceData' : list(query) ,
                'ilsTousd'  : ilsTousd}
    # def del_time(dict):
    #     del dict['time']
    #     return dict
    # query = map(del_time,list(query))


    # price_dict = defaultdict(list)
    #
    # for price in query:
    #     price_dict['bit2c_price'].append(price.bit2c_price)
    #     price_dict['global_price'].append(price.global_price)
    #     price_dict['time'].append(price.time)
    # data = serializers.serialize('json', query,fields=('bit2c_price','global_price'))

    return JsonResponse(response,safe = False)
