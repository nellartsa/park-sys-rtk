import React, { useState } from "react";
import {
  usePutVehicleEntryMutation,
  usePutVehicleExitMutation,
} from "../redux/features/ParkingApi";

const Modals = ({ openIn, closeIn, openOut, closeOut }) => {
  const [selectOpen, setSelectOpen] = useState(false);
  const initialState = {
    vehicle_id: "",
    vehicle_type: "",
  };

  const [vehicle, setVehicle] = useState(initialState);
  const { vehicle_id, vehicle_type } = vehicle;

  const handleDataInput = (e) => {
    const { name, value } = e.target;
    setVehicle({ ...vehicle, [name]: value });
  };

  const handleSelectOpen = () => {
    setSelectOpen(!selectOpen);
  };

  const [vehicleEntry] = usePutVehicleEntryMutation();
  const handleSubmitEntry = async (e) => {
    e.preventDefault();
    await vehicleEntry(vehicle);
    setVehicle(initialState);
    closeIn();
  };

  const [vehicleExit, data] = usePutVehicleExitMutation();
  const handleSubmitExit = async (e) => {
    e.preventDefault();
    await vehicleExit(vehicle);
    setVehicle(initialState);
  };

  console.log(data);

  return (
    <>
      <div
        className={`overlay ${(openIn && "active") || (openOut && "active")}`}
      ></div>
      <div className={`modal ${openIn && "active"}`}>
        <div className="modal-header">
          <h1>Vehicle Entries</h1>
        </div>
        <form onSubmit={handleSubmitEntry}>
          <div className="modal-body">
            <div className="input-group pad-10pixb">
              <label>Vehicle Plate Number</label>
              <input
                type="text"
                name="vehicle_id"
                value={vehicle_id}
                required
                onChange={handleDataInput}
              />
            </div>
            <div
              onClick={handleSelectOpen}
              id="vSizes"
              className={`custom-select ${selectOpen && "active"}`}
            >
              <div className="selection">
                <label>Vehicle Size</label>
                <input
                  type="text"
                  name="vehicle_type"
                  value={vehicle_type}
                  readOnly
                />
              </div>

              <div className="options">
                <div className="option">
                  <input
                    type="radio"
                    id="s"
                    name="vehicle_type"
                    value="Small"
                    onChange={handleDataInput}
                    hidden
                  />
                  <label htmlFor="s">Small</label>
                </div>
                <div className="option">
                  <input
                    type="radio"
                    id="m"
                    name="vehicle_type"
                    value="Medium"
                    onChange={handleDataInput}
                    hidden
                  />
                  <label htmlFor="m">Medium</label>
                </div>
                <div className="option">
                  <input
                    type="radio"
                    id="l"
                    name="vehicle_type"
                    value="Large"
                    onChange={handleDataInput}
                    hidden
                  />
                  <label htmlFor="l">Large</label>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <div className="btn-group">
              <button type="submit">Submit</button>
              <button type="button" onClick={closeIn}>
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className={`modal ${openOut && "active"}`}>
        <div className="modal-header">
          <h1>Vehicle Exit</h1>
        </div>
        <form onSubmit={handleSubmitExit}>
          <div className="modal-body">
            <div className="input-group pad-10pixb">
              <label>Vehicle Plate Number</label>
              <input
                type="text"
                name="vehicle_id"
                value={vehicle_id}
                required
                onChange={handleDataInput}
              />
            </div>
          </div>
          <div className="modal-footer">
            <div className="btn-group">
              <button type="submit">Submit</button>
              <button type="button" onClick={closeOut}>
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Modals;
