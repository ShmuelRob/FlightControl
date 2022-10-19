import Flight from "../../models/Flight.model";
import styles from "./leg.module.css";
import airplane from "../../../assets/airplane.png";

interface LegProps {
  leg: number;
  flight: Flight | null;
  setFlight: (flight: Flight | null) => void;
}

function Leg(props: LegProps) {
  return (
    <section id={styles[`item-${props.leg}`]} className={styles.leg}>
      {props.flight && (
        <>
          <img src={airplane} onClick={() => props.setFlight(props.flight)} />
          <p>{props.flight.flightID}</p>
        </>
      )}
    </section>
  );
}

export default Leg;
