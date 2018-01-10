import getFromAPI
import price_db
import datetime
from apscheduler.schedulers.background import BackgroundScheduler, BlockingScheduler


def writeToDB():

    current_price = getFromAPI.btcPrice().ils_prices
    DB = price_db.priceDB()
    DB.insert(datetime.datetime.now(),current_price['il'], current_price['global'])


def init():
    sched = BlockingScheduler()
    # seconds can be replaced with minutes, hours, or days
    sched.add_job(writeToDB, 'cron', minute='*/1')
    sched.start()

if __name__ == '__main__':
    init()
