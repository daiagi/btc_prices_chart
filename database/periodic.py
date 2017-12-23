import getFromAPI
import price_db
import datetime

current_price = getFromAPI.btcPrice().ils_prices
DB = price_db.priceDB()
DB.insert(datetime.datetime.now(),current_price['il'], current_price['global'])
