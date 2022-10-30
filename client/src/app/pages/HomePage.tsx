import { useEffect, useState } from "react";
import FlightView from "../components/flightView/FlightView";
import TrackView from "./../components/trackView/TrackView";
import Flight from "../models/Flight.model";
import { io } from "socket.io-client";
import config from '../../custom-environment-variables.json';
import Header from "../components/header/Header";

function HomePage() {
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

  useEffect(() => {
    const serverUrl = `http://${config.SERVER_HOST}:${config.SERVER_PORT}`;
    // const serverUrl = `http://${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}`;
    console.log(serverUrl);

    const socket = io(serverUrl);

    
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("legs-updated", (data: (Flight | null)[]) => {
      setLegs(data);
    });
  }, []);

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
