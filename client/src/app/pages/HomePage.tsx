import { useState } from "react";
import FlightView from "../components/flightView/FlightView";
import TrackView from "./../components/trackView/TrackView";
import Header from "../components/Header";
import Flight from "../models/Flight.model";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { getData } from "../server/getData";

function HomePage() {

  getData();



  const legs = useSelector<RootState, (Flight | null)[]>(
    (store) => store.track.legs
  );
  const [flight, setFlight] = useState<Flight | null>(null);

  const selectFlight = (flightSelected: Flight | null) => {
    console.log("selectFlight in HomePage");
    if (flight?.flightID === flightSelected?.flightID) {
      flightSelected = null;
    }
    setFlight(flightSelected);
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
