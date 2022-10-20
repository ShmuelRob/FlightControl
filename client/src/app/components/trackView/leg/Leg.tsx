import styles from "./leg.module.css";
import airplane from "../../../../assets/airplane.png";
import Flight from "../../../models/Flight.model";

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
          <img src={airplane} onClick={() => props.setFlight(props.flight)} alt='airplane' />
          <p>{props.flight.flightID}</p>
        </>
      )}
    </section>
  );
}

export default Leg;
