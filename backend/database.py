import pymysql.cursors

def db_conn():
  try:
    connection = pymysql.connect(
      host="localhost",
      user="root",
      password="",
      database="xyz_parking"
    )
    cursor = connection.cursor()
    return connection, cursor
  except Exception as e:
    print(e)