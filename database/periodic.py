import getFromAPI
import price_db
import datetime
import logging

from apscheduler.schedulers.background import BackgroundScheduler, BlockingScheduler
global DB


def writeToDB():
    print('getting from api')
    current_price_ils = getFromAPI.btcPrice().ils_prices
    current_price_usd = getFromAPI.btcPrice().usd_prices
    print(current_price_ils)

    print('inserting to db')
    DB.insert(datetime.datetime.utcnow(),current_price_ils['il'], current_price_ils['global'],
                current_price_usd['il'], current_price_usd['global'])
    print('done!')


def init():
    sched = BlockingScheduler()
    global DB
    DB  = price_db.priceDB()

    # seconds can be replaced with minutes, hours, or days
    sched.add_job(writeToDB, 'cron', minute='*/1', misfire_grace_time = 10 , coalesce = True)
    sched.start()

if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG, filename='database/periodic.log',
                        format = '''#############   %(asctime)s    ############# \n
                                  %(message)s \n
                                 ##################################### \n\n''')

    init()
