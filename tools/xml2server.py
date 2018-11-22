import sqlite3
import sys


def main(app):

    con = sqlite3.connect('settings.db')

    cur = con.cursor()
    cur.execute('select xml from t_webxml_settings where app=?', (app,))

    res = "<root>"
    for row in cur:
        res += row[0]

    con.close()

    res = res + '</root>'
    f = open('../app_settings/'+app+'.xml', 'w')
    f.write(res)
    f.close()

    print 'setting ' + app + ' saved!'


if __name__ == "__main__":
    main(sys.argv[1])
