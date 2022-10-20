import Flight from "../../models/Flight.model";
import Leg from "./leg/Leg";
import styles from "./trackView.module.css";

interface TrackViewProps {
  legs: (Flight | null)[];
  setFlight: (flight: Flight | null) => void;
}

export default function TrackView(props: TrackViewProps) {
  return (
    <article className={styles["grid"]}>
      {props.legs.map((leg, index) => {
        return (
          <Leg
            key={index}
            leg={index}
            flight={leg}
            setFlight={(f: Flight | null) => props.setFlight(f)}
          />
        );
      })}
    </article>
  );
}
