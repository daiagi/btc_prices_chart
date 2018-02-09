import os
from urllib import parse
import psycopg2
from datetime import datetime

parse.uses_netloc.append("postgres")
url = parse.urlparse(os.environ["DATABASE_URL"])
print(url)

conn = psycopg2.connect(
    database=url.path[1:],
    user=url.username,
    password=url.password,
    host=url.hostname,
    port=url.port
)
command = """INSERT INTO btc_price (time,bit2c_price_ils,global_price_ils,bit2c_price_usd,global_price_usd)
                    VALUES (%s,%s,%s,%s,%s);"""

with conn.cursor() as cur:
	print(cur.execute(""" SELECT * FROM public.btc_price  ORDER BY time ASC"""))
print (conn)

conn.close()
