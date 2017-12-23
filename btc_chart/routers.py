class btcChartRouter(object):
    """
    A router to control all database operations on models in
    the btc_chart application
    """

    def db_for_read(self, model, **hints):
        """
        Point all operations on myapp2 models to 'my_db_2'
        """
        if model._meta.app_label == 'btc_chart':
            return 'price'
        return None

    def db_for_write(self, model, **hints):
        """
        Point all operations on myapp models to 'other'
        """
        if model._meta.app_label == 'btc_chart':
            return 'price'
        return None

    def allow_syncdb(self, db, model):
        """
        Make sure the 'myapp2' app only appears on the 'other' db
        """
        if db == 'price':
            return model._meta.app_label == 'btc_chart'
        elif model._meta.app_label == 'btc_chart':
            return False
        return None
