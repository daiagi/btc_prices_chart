import requests
from pprint import pprint
import simplejson as json


class btcPrice:

    json_url = 'http://btcils-server.apphb.com/get-prices'

    def __init__(self):
        self.prices_json = None
        self.preev = None
        self.bit2c = None

    def _update_price_data(self):
        self.prices_json = requests.get(self.json_url).json()
        self.preev = json.loads(self.prices_json['preev'])
        self.bit2c = json.loads(self.prices_json['btc'])

    def _mrkt_mean(self,markets_prices):
        return sum([float(markets_prices[market]['last']) for market in markets_prices.keys()])/len(markets_prices)

    def _get_price(self):

        self._update_price_data()
        btc_prices_volumes_usd = self.preev['btc']['usd']
        btc_mean_price_usd = self._mrkt_mean(btc_prices_volumes_usd)
        btc_price_ils = self.bit2c['ll']
        return btc_mean_price_usd, btc_price_ils

    @property
    def ils_prices(self):
        global_price_usd, il_price_ils = self._get_price()
        ils_to_usd = self.preev['ils']['usd']['other']['last']
        try:
            global_price_usd/ils_to_usd
        except:
            raise TypeError('''global_price_usd = {}, type : {} \n
                            ils_to_usd = {}, type : {}'''.format(
                            global_price_usd, type(global_price_usd),
                            il_price_ils, type(il_price_ils)
                            ))

        return {'il' : il_price_ils,
               'global' : global_price_usd/ils_to_usd }

    @property
    def usd_prices(self):
        global_price_usd, il_price_ils = self._get_price()
        ils_to_usd = self.preev['ils']['usd']['other']['last']
        return {'il' : il_price_ils*ils_to_usd,
               'global' : global_price_usd}
