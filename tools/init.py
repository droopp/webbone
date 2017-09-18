import sqlite3

con = sqlite3.connect('settings.db')
cur = con.cursor()
cur.execute('CREATE TABLE t_webxml_settings (app VARCHAR(100), comp VARCHAR(100), xml VARCHAR(4096) )')
con.commit()
