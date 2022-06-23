from flask import Flask
from flask_restful import Resource, Api, request
from datetime import datetime, timedelta
from database import db_conn

distancesFromEntry = [
  (2,5,6), (6,3,2), (2,5,7), (9,2,2), (12,4,6), (14,9,10), (12,11,19), (10,5,4), (7,2,10), (11,16,20),
  (12,15,4), (4,2,15), (12,5,17), (9,13,2), (14,4,7), (8,11,4), (1,13,2), (20,5,14), (7,8,20), (16,11,5)
  ]
parkingSlots = [
  2, 0, 1, 2, 2, 0, 0, 2, 1, 1,
  1, 1, 0, 0, 2, 1, 1, 0, 2, 2
  ]

app = Flask(__name__)
api = Api(app)
connection, cursor = db_conn()

@app.route('/', methods=["GET"])
def retrieve_parking_data():
  cursor.execute("SELECT slot_taken FROM parking_slots")
  data = cursor.fetchall()

  return {"data": data}

@app.route('/vehicle-in', methods=["PUT"])
def record_vehicle_in():
  data = request.get_json()
  vehicle_id = data["vehicle_id"]
  vehicle_type = data["vehicle_type"]
  entry_point = data["entry_point"]
  current_datetime = datetime.now()

  cursor.execute("SELECT _id, vehicle_id, datetime_in FROM parking_slots WHERE vehicle_id='%s' ORDER BY _id DESC LIMIT 1" %(vehicle_id))
  is_old = cursor.fetchall()
  
  if(len(is_old) > 0):
    _id = is_old[0][0]
    datetime_in = is_old[0][2]

    if datetime_in > (datetime.now() - timedelta(hours=1)):
      cursor.execute("UPDATE parking_slots SET exit_status=0 WHERE _id='%s'" %_id)
      connection.commit()

      return {"message": "exit not exceeded 1 hr - continuing payment per hour"}
  
  cursor.execute("SELECT slot_taken FROM parking_slots WHERE exit_status=0")
  unavailableSlots = cursor.fetchall()

  availableSlots = (key for key, x in enumerate(parkingSlots) if key not in (y[0] for y in unavailableSlots))

  availableForVehicle=[]
  # prioritize parking size based on vehicle
  for i in availableSlots:
    if parkingSlots[i] == int(vehicle_type):
      availableForVehicle.append(i)

  # used other parking sizes
  if len(availableForVehicle) == 0:
    for i in availableSlots:
      if parkingSlots[i] > int(vehicle_type):
        availableForVehicle.append(i)

  # full parking
  if len(availableForVehicle) == 0:
    return {"message": "parking is full for current vehicle type"}

  distanceFromEntryPoint = ((key, x) for key, x in enumerate(distancesFromEntry) if key in availableForVehicle)

  shortestPath = None # key value of available slot
  minimum = None # range of entry to slot
  for i in distanceFromEntryPoint:
    if minimum is None:
      minimum = i[1][int(entry_point)]
      shortestPath = i[0]
    elif minimum > i[1][int(entry_point)]:
      minimum = i[1][int(entry_point)]
      shortestPath = i[0]

  cursor.execute("INSERT INTO parking_slots (vehicle_id, vehicle_type, entry_point, slot_taken) VALUES ('%s', '%s', '%s', '%s')" %(vehicle_id, vehicle_type, entry_point, shortestPath))
  connection.commit()

  return {"message": "driver registered for parking"}


@app.route("/vehicle-exit", methods=["PUT"])
def mark_vehicle_exit():
  data = request.get_json()
  vehicle_id = data["vehicle_id"]
  
  cursor.execute("SELECT _id, vehicle_type, slot_taken, datetime_in FROM parking_slots WHERE vehicle_id='%s' AND exit_status=0" %vehicle_id)
  is_registered = cursor.fetchall()

  if len(is_registered) == 1:
    _id = is_registered[0][0]
    vehicle_type = is_registered[0][1]
    slot_taken = is_registered[0][2]
    datetime_in = is_registered[0][3]
    
    does_exceed_3hrs = datetime_in < (datetime.now() - timedelta(hours=3))
    does_exceed_24hrs = datetime_in < (datetime.now() - timedelta(hours=24))

    price_based = None
    if parkingSlots[slot_taken] == 0:
      price_based=20
    elif parkingSlots[slot_taken] == 1:
      price_based=60
    else:
      price_based=100

    if does_exceed_24hrs or does_exceed_3hrs:
      hours_used = datetime.now() - datetime_in
      rounded = round(hours_used / timedelta(hours=1))

      # payment if exceeded 24 hrs
      if rounded >= 24:
        payment = 5000 + ((rounded - 24) * price_based)
        cursor.execute("UPDATE parking_slots SET payment=%s, exit_status=1 WHERE _id=%s" %(payment, _id))
        connection.commit()

        return {"message": "payment is %s" %payment}

      # payment if exceeded 3 hrs
      else:
        payment = rounded * price_based
        cursor.execute("UPDATE parking_slots SET payment=%s, exit_status=1 WHERE _id=%s" %(payment, _id))
        connection.commit()

        return {"message": "payment is %s" %payment}

    # normal payment
    else:
      cursor.execute("UPDATE parking_slots SET payment=%s, exit_status=1 WHERE _id=%s" %(price_based, _id))
      connection.commit()

      return {"message": "payment is %s" %price_based}

  else:
    return {"message": "vehicle not registered"}


if __name__ == "__main__":
  app.run(debug=True)
