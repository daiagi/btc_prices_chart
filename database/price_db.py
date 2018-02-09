import psycopg2 as pg
import os
from urllib import parse
try:
    import heroku3 as hk3
except ImportError:
    print(ImportError)
class priceDB:
    self.table_name = 'btc_price'
    def heroku_postgress_connection(self):
        print ('initing priceDB')
        try:
            parse.uses_netloc.append("postgres")
            url = parse.urlparse(os.environ["DATABASE_URL"])
            return pg.connect(
                database=url.path[1:],
                user=url.username,
                password=url.password,
                host=url.hostname,
                port=url.port
            )

        except:
            raise ConnectionError('unable to connect to heroku')



    def _execute(self,sql_command,params = None):
        print('executing')
        conn =  heroku_postgress_connection()
        with conn:
            with conn.cursor() as cur:
                if params:
                    cur.execute(sql_command,params)
                else:
                    cur.execute(sql_command)
        conn.commit()            
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
