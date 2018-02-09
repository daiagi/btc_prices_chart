import psycopg2 as pg
try:
    import heroku3 as hk3
except ImportError:
    throw ImportError
class priceDB:

    def __init__(self):
        print ('initing priceDB')
        heroku_conn = hk3.from_key('63d29faf-cd0d-41cc-a737-63171d4bb83c')
        print(heroku_conn)
        app = heroku_conn.apps()[0]
        print(app)
        self.db_url = app.config()['DATABASE_URL']
        print(self.db_url)
        self.table_name = 'btc_price'


    def _execute(self,sql_command,params = None):
        print('executing')
        conn =  pg.connect(self.db_url)
        with conn:
            with conn.cursor() as cur:
                if params:
                    cur.execute(sql_command,params)
                else:
                    cur.execute(sql_command)
        conn.close()




    def insert(self,*params):
        command = """INSERT INTO {TABLE_NAME} (time,bit2c_price_ils,global_price_ils,bit2c_price_usd,global_price_usd)
                    VALUES (%s,%s,%s,%s,%s);""".format(TABLE_NAME = self.table_name)
        self._execute(command,params)

    def update(self,time,*params):
        command = """UPDATE {TABLE_NAME}
                    SET bit2c_price_ils=%s, global_price_ils=%s, bit2c_price_usd=%s, global_price_usd=%s
                    WHERE time = '{TIME}'::timestamp without time zone;""".format(TABLE_NAME = self.table_name,
                                                            TIME = time)
        self._execute(command,params)


    def delete(self,time):
        command = """DELETE FROM {TABLE_NAME}
                     WHERE time = '{TIME}'::timestamp without time zone;""".format(TABLE_NAME = self.table_name,
                                                            TIME = time)
        self._execute(command,)
