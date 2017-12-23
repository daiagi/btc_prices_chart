import sqlite3
import datetime

class priceDB:
    DB_name = 'prices.db'
    table_name = 'btc_price'

    def _execute(self,sql_command,params = None):
        with sqlite3.connect(self.DB_name) as conn:
            cursor = conn.cursor()
            if params:
                cursor.execute(sql_command,params)
            else:
                cursor.execute(sql_command)


    def create_btc_table(self):
        sql_command = """
                    CREATE TABLE btc_price (
                    time DATETIME PRIMARY KEY,
                    bit2c_price REAL,
                    global_price REAL);"""
        self._execute(sql_command)

    def insert(self,*params):
        command = """INSERT INTO {TABLE_NAME} (time,bit2c_price,global_price)
                    VALUES (?,?,?);""".format(TABLE_NAME = self.table_name)
        self._execute(command,params)

    def update(self,time,*params):
        command = """UPDATE {TABLE_NAME}
                    SET bit2c_price = ?, global_price = ?
                    WHERE time = DATETIME("{TIME}");""".format(TABLE_NAME = self.table_name,
                                                            TIME = time)
        self._execute(command,params)


    def delete(self,time):
        command = """DELETE FROM {TABLE_NAME}
                     WHERE time = DATETIME("{TIME}");""".format(TABLE_NAME = self.table_name,
                                                            TIME = time)
        self._execute(command,)
