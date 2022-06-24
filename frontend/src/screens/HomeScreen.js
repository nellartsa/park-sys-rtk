import React, { useState } from "react";
import Modals from "../components/Modals";
import ParkingSpace from "../components/ParkingSpace";
import { useGetParkingDataQuery } from "../redux/features/ParkingApi";

const HomeScreen = () => {
  const [modalIn, setModalIn] = useState(false);
  const [modalOut, setModalOut] = useState(false);

  const { data } = useGetParkingDataQuery();

  const handleModalIn = () => {
    setModalIn(!modalIn);
  };

  const handleModalOut = () => {
    setModalOut(!modalOut);
  };

  return (
    <>
      <div className="container">
        <section>
          <div className="btn-group">
            <button onClick={handleModalIn}>In</button>
            <button onClick={handleModalOut}>Out</button>
          </div>
          <div className="parking-slot">
            <div className="padding">
              <ParkingSpace free={data?.slot_0 !== undefined} />
              <ParkingSpace free={data?.slot_1 !== undefined} />
              <ParkingSpace free={data?.slot_2 !== undefined} />
              <ParkingSpace free={data?.slot_3 !== undefined} />
              <ParkingSpace free={data?.slot_4 !== undefined} />
              <ParkingSpace free={data?.slot_5 !== undefined} />
              <ParkingSpace free={data?.slot_6 !== undefined} />
            </div>
            <div className="padding">
              <ParkingSpace free={data?.slot_7 !== undefined} />
              <ParkingSpace free={data?.slot_8 !== undefined} />
              <ParkingSpace free={data?.slot_9 !== undefined} />
              <ParkingSpace free={data?.slot_10 !== undefined} />
              <ParkingSpace free={data?.slot_11 !== undefined} />
              <ParkingSpace free={data?.slot_12 !== undefined} />
              <ParkingSpace free={data?.slot_13 !== undefined} />
            </div>
            <div className="padding">
              <ParkingSpace free={data?.slot_14 !== undefined} />
              <ParkingSpace free={data?.slot_15 !== undefined} />
              <ParkingSpace free={data?.slot_16 !== undefined} />
              <ParkingSpace free={data?.slot_17 !== undefined} />
              <ParkingSpace free={data?.slot_18 !== undefined} />
              <ParkingSpace free={data?.slot_19 !== undefined} />
              <ParkingSpace free={data?.slot_20 !== undefined} />
            </div>
            <div className="padding">
              <ParkingSpace free={data?.slot_21 !== undefined} />
              <ParkingSpace free={data?.slot_22 !== undefined} />
              <ParkingSpace free={data?.slot_23 !== undefined} />
              <ParkingSpace free={data?.slot_24 !== undefined} />
              <ParkingSpace free={data?.slot_25 !== undefined} />
              <ParkingSpace free={data?.slot_26 !== undefined} />
              <ParkingSpace free={data?.slot_27 !== undefined} />
            </div>
            <div className="padding">
              <ParkingSpace free={data?.slot_28 !== undefined} />
              <ParkingSpace free={data?.slot_29 !== undefined} />
              <ParkingSpace free={data?.slot_30 !== undefined} />
              <ParkingSpace free={data?.slot_31 !== undefined} />
              <ParkingSpace free={data?.slot_32 !== undefined} />
              <ParkingSpace free={data?.slot_33 !== undefined} />
              <ParkingSpace free={data?.slot_34 !== undefined} />
            </div>
          </div>
        </section>
      </div>
      <Modals
        openIn={modalIn}
        closeIn={handleModalIn}
        openOut={modalOut}
        closeOut={handleModalOut}
      />
    </>
  );
};

export default HomeScreen;
