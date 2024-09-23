import React from "react";
import  styles from "../styles/ConnectedFlights.module.css";
import { formatDate, formatTime } from "../helpers/formatHelpers";
import { ConnectedFlightsText } from "../helpers/enums";


const ConnectedFlights = ({ connectedFlights }) => {
  // Get the final destination details (last flight in the array)
  const finalFlight = connectedFlights[connectedFlights.length - 1];

  return (
    <div className={styles.collapseContainer}>
      <div className={styles.dashedLine}></div>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <ul className={styles.sessions}>
            {connectedFlights?.map((flight, index) => (
              <li key={index}>
                <div className={styles.time}>
                {formatDate(flight.origin_date)}{" "}
                  - {formatTime(flight.origin_time)}
                </div>
                <div className={`${styles.time} ${styles.arpt}`}>
                  {flight.origin_code} - {flight.origin_airport_name}
                </div>
                <span className={styles.time}>
                  {flight.airline_code} {flight.connecting_flight_number} | {flight.airline_name} |{flight.cabin_type}
                </span>
                <div className={styles.time}>
                {ConnectedFlightsText.FLIGHT_TIME} {formatTime(flight.destination_time)}
                </div>
              </li>
            ))}

            {/* Render the final destination details */}
            {finalFlight && (
              <li key="final-destination">
                <div className={styles.time}>
                 {formatDate(finalFlight.destination_date)}
                  - {formatTime(finalFlight.destination_time)}
                </div>
                <div className={`${styles.time} ${styles.arpt}`}>
                  {finalFlight.destination_code} -{" "}
                  {finalFlight.destination_airport_name}
                </div>
                <span className={styles.time}>{ConnectedFlightsText.FINAL_DESTINATION}</span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ConnectedFlights;
