import React, { useState } from "react";
import FlightView from "../components/flightView/FlightView";
import Header from "../components/Header";
import Flight from "../models/Flight.model";

function HomePage() {
  const [flight, setFlight]: [
    Flight | null,
    (value: React.SetStateAction<null>) => void
  ] = useState(null);


 

  return (
    <div>
      <Header />
      <div>HomePage</div>
      {flight && <FlightView />}
    </div>
  );
}

export default HomePage;
