import { useEffect, useState } from "react";
import FlightView from "../components/flightView/FlightView";
import TrackView from "./../components/trackView/TrackView";
import Flight from "../models/Flight.model";
import { io } from "socket.io-client";
import config from "../../config.json";
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
    const serverUrl = `http://localhost:${config.SERVER_PORT}`;
    const socket = io(serverUrl);

    // socket.on("connect", () => {
    //   console.log("Connected to server");
    // });

    socket.on("legs-updated", (data: (Flight | null)[]) => {
      console.log("Legs updated");
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
