import React, { useEffect } from "react";
import io from "socket.io-client";

// import Flight from "../../models/Flight.model";

function GetData() {
  useEffect(() => {
    const socket = io("http://localhost:5000");
    socket.on("legs-updated", (data) => {
      console.log(data);
    });
  }, []);

  return <div>getData</div>;
}

export default GetData;
