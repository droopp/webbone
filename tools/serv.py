from lxml import etree as et
from flask import request

import sqlite3
import os
import glob
import json

from flask_jwt import JWT, jwt_required  # , current_identity
from werkzeug.security import safe_str_cmp
from datetime import timedelta


class User(object):
    def __init__(self, id, username, password):
        self.id = id
        self.username = username
        self.password = password

    def __str__(self):
        return "User(id='%s')" % self.id

users = [
    User(1, 'admin', 'admin123'),
]

DB_NAME = os.environ["DB_NAME"]
FLOWS_DIR = os.environ["FLOWS_DIR"]

username_table = {u.username: u for u in users}
userid_table = {u.id: u for u in users}


def authenticate(username, password):
    user = username_table.get(username, None)
    if user and safe_str_cmp(user.password.encode('utf-8'), password.encode('utf-8')):
        return user


def identity(payload):
    user_id = payload['identity']
    return userid_table.get(user_id, None)


from flask import Flask

app = Flask(__name__)
app.debug = False
app.config['SECRET_KEY'] = 'super-secret'
app.config['JWT_EXPIRATION_DELTA'] = timedelta(60)

jwt = JWT(app, authenticate, identity)


@app.route("/api/v1/stat/flows",  methods=['POST'])
def flows():

    l = glob.glob(FLOWS_DIR + "/*.json")

    data = []
    for i in l:
        with open(i) as f:
            data.append(json.loads(f.read()))

    res = "<root><flows>"

    for row in data:
        res += """<row>
                    <name>{}</name>
                    <active>{}</active>
                    <version>{}</version>
                    <priority>{}</priority>
                    <entry>{}</entry>
                    <data>{}</data>
                 </row>""".format(row["name"], row["active"], row["version"],
                                  row["priority"],
                                  row["entry_ppool"],  json.dumps(row))

    return res + '</flows></root>', 200


@app.route("/api/v1/stat/ppool_stat",  methods=['POST'])
def ppool_stat():
    con = sqlite3.connect(DB_NAME)

    cur = con.cursor()

    cur.execute("""select s.node, s.name, l.ram_count,
                         s.date, AVG(s.count), AVG(s.cpu_percent),
                         AVG(s.ram_percent)
                         from ppool_stat s left join (select node, ram_count, MAX(date)
                                                      from node_stat group by node) l
                          on s.node = l.node
                         where s.date > DATETIME('NOW', '-1 minutes')
                         group by s.node, s.name
                """)

    res = "<root><ppool_stat>"
    for row in cur:

        # if row[1] == 0:
        #     continue

        # print(row)
        res += """<row>
                    <node>{}</node>
                    <name>{}</name>
                    <summa_ram>{:2.1f}</summa_ram>
                    <date>{}</date>
                    <summa_count>{}</summa_count>
                    <summa_cpu_percent>{:2.1f}</summa_cpu_percent>
                    <summa_ram_percent>{:2.1f}</summa_ram_percent>
                 </row>""".format(row[0], row[1], row[2]*row[6]/100, row[3], row[4], row[5],
                                  row[6])

    con.close()

    return res + '</ppool_stat></root>', 200


@app.route("/api/v1/stat/node_stat",  methods=['POST'])
def node_stat():
    con = sqlite3.connect(DB_NAME)

    cur = con.cursor()

    cur.execute("""select s.node, l.active, s.cpu_count, s.ram_count,
                         s.disk_count, MAX(s.date), AVG(s.cpu_percent),
                         AVG(s.ram_percent), AVG(s.disk_percent), AVG(s.net_count)
                         from node_stat s left join (select node, active, MAX(date) from node_list) l
                          on s.node = l.node
                         where s.date > DATETIME('NOW', '-1 minutes')
                         group by s.node
                """)

    res = "<root><node_stat>"
    for row in cur:

        # if row[1] == 0:
        #     continue

        # print(row)
        res += """<row>
                    <name>{}</name>
                    <is_active>{}</is_active>
                    <cpu>{}</cpu>
                    <ram>{}</ram>
                    <disk>{}</disk>
                    <date>{}</date>
                    <cpu_percent>{:2.1f}</cpu_percent>
                    <ram_percent>{:2.1f}</ram_percent>
                    <disk_percent>{:2.1f}</disk_percent>
                    <net_count>{:2.1f}</net_count>
                 </row>""".format(row[0], row[1], row[2], row[3], row[4], row[5],
                                  row[6], row[7], row[8], row[9])

    con.close()

    return res + '</node_stat></root>', 200


@app.route("/api/v1/stat/node_list",  methods=['POST'])
def node_list():
    con = sqlite3.connect(DB_NAME)

    cur = con.cursor()

    cur.execute('select * from node_list')

    res = "<root><node_list>"
    for row in cur:
        res += """<row>
                    <name>{}</name>
                    <active>{}</active>
                    <date>{}</date>
                    <msg>{}</msg>
                 </row>""".format(row[0], row[1], row[2], row[3])

    con.close()

    return res + '</node_list></root>', 200


@app.route("/api/v1/stat/ppool_list",  methods=['POST'])
def ppool_list():
    con = sqlite3.connect(DB_NAME)

    cur = con.cursor()

    cur.execute('''
                select node, name, MAX(date), MAX(error), MAX(timeout),
                       MIN(running), MAX(ok),
                       round(MAX(elapsed)/1000,2),  round(AVG(elapsed)/1000,2),
                       round(MAX(error) + MAX(timeout) + SUM(nomore),2),
                       SUM(nomore)
                from ppool_list
                     where  date > DATETIME('NOW', '-1 minutes')
                        and date < DATETIME('NOW')

                group by node, name
                ''')

    res = "<root><ppool_list>"
    for row in cur:

        res += """<row>
                    <node>{}</node>
                    <name>{}</name>
                    <date>{}</date>
                    <summa_error>{}</summa_error>
                    <summa_timeout>{}</summa_timeout>
                    <summa_running>{}</summa_running>
                    <summa_ok>{}</summa_ok>
                    <elapsed>{}</elapsed>
                    <elapsed_avg>{}</elapsed_avg>
                    <errors>{}</errors>
                    <summa_nomore>{}</summa_nomore>
                 </row>""".format(row[0], row[1], row[2],
                                  row[3], row[4], row[5],
                                  row[6], row[7], row[8],
                                  row[9], row[10])

    con.close()

    return res + '</ppool_list></root>', 200


@app.route("/api/v1/settings/save",  methods=['POST'])
def save():
    con = sqlite3.connect('settings.db')

    data = request.data

    xml = et.fromstring(data)

    v_app = xml.xpath("/root/params/app_name/text()")[0]
    v_id = xml.xpath("/root/params/view_id/text()")[0]

    s = xml.xpath("/root/params")[0]

    el = "<{0}>{1}</{0}>".format(v_id, et.tostring(s).replace('<id>view0</id>',
                                                              '<id>' + v_id + '</id>'))

    print("{}, {}, {} ".format(v_app, v_id, el))

    cur = con.cursor()
    cur.execute('delete from t_webxml_settings where app=? and comp=?', (v_app, v_id))

    cur.execute('insert into t_webxml_settings values (?,?,?)', (v_app, v_id, el))

    con.commit()
    con.close()

    return '<sucsess>ok</sucsess>', 200


@app.route("/api/v1/settings/get",  methods=['POST'])
@jwt_required()
def get():

    con = sqlite3.connect('settings.db')

    data = request.data

    xml = et.fromstring(data)

    v_app = xml.xpath("/root/params/app_name/text()")[0]

    cur = con.cursor()
    cur.execute('select xml from t_webxml_settings where app=?', (v_app,))

    res = "<root>"
    for row in cur:
        res += row[0]

    con.close()

    return res + '</root>', 200


if __name__ == "__main__":
    app.run()
