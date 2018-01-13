import getFromAPI
import price_db
import datetime
import logging
from apscheduler.schedulers.background import BackgroundScheduler, BlockingScheduler


def writeToDB():
    current_price_ils = getFromAPI.btcPrice().ils_prices
    current_price_usd = getFromAPI.btcPrice().usd_prices
    DB = price_db.priceDB()
    DB.insert(datetime.datetime.utcnow(),current_price_ils['il'], current_price_ils['global'],
                current_price_usd['il'], current_price_usd['global'])


def init():
    sched = BlockingScheduler()
    # seconds can be replaced with minutes, hours, or days
    sched.add_job(writeToDB, 'cron', minute='*/1', misfire_grace_time = 10 , coalesce = True)
    sched.start()

if __name__ == '__main__':
    logging.basicConfig(level=logging.WARNING, filename='database/periodic.log',
                        format = '''#############   %(asctime)s    ############# \n
                                  %(message)s \n
                                 ##################################### \n\n''')

    init()
