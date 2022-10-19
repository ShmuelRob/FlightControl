import Flight from "../../models/Flight.model";
import styles from "./flightView.module.css";

interface FlightViewProps {
  flight: Flight | null;
  close: () => void;
} 

function FlightView(props: FlightViewProps) {
  return (
    <aside className={styles["flight-view-container"]}>
      <article>
        <h2>Flight number {props.flight?.flightID}</h2>
        <br />
        <p>
          Brand: {props.flight?.brand}
          <br />
          Is for departure: {props.flight?.isDeparture ? "Yes" : "No"}
          <br />
          Is it critical: {props.flight?.isCritical ? "Yes" : "No"}
          <br />
          Passengers count: {props.flight?.passengersCount}
        </p>
      </article>
      <button className={styles["close-button"]} onClick={props.close} >close</button>
    </aside>
  );
}

export default FlightView;
