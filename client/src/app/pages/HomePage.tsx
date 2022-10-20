import { useState } from "react";
import FlightView from "../components/flightView/FlightView";
import TrackView from "./../components/trackView/TrackView";
import Flight from "../models/Flight.model";
import { io } from "socket.io-client";
import config from "../../config.json";
import Header from "../components/header/Header";

function HomePage() {
  // const [legs, setLegs] = useState<(Flight| null)[]>([
  //   { flightID: 1, passengersCount: 100, isCritical: false, brand: 'Delta', isDeparture: true },
  //   null,
  //   { flightID: 2, passengersCount: 100, isCritical: false, brand: 'Delta', isDeparture: true },
  //   null,
  //   { flightID: 3, passengersCount: 100, isCritical: false, brand: 'Delta', isDeparture: true },
  //   null,
  //   null,
  //   { flightID: 4, passengersCount: 100, isCritical: false, brand: 'Delta', isDeparture: true },
  // ]);

  const [legs, setLegs] = useState<(Flight | null)[]>([
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ]);

  const serverUrl = `http://localhost:${config.SERVER_PORT}`;
  const socket = io(serverUrl);
  socket.on("legs-updated", (data: Flight[]) => {
    setLegs(data);
  });
  const [flight, setFlight] = useState<Flight | null>(null);

  const selectFlight = (flightSelected: Flight | null) => {
    if (flight?.flightID === flightSelected?.flightID) {
      flightSelected = null;
    }
    setFlight(flightSelected ? { ...flightSelected } : null);
  };

  const closeFlightView = () => {
    setFlight(null);
  };

  return (
    <div>
      <Header />
      <main>
        <TrackView
          legs={legs}
          setFlight={(f: Flight | null) => selectFlight(f)}
          // FlightView={flight}
        />
        {flight && <FlightView flight={flight} close={closeFlightView} />}
      </main>
    </div>
  );
}

export default HomePage;
