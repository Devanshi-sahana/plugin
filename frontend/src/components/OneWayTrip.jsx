import Flight from "@mui/icons-material/Flight";
import styles from "../styles/Trip.module.css";
import { useState } from "react";
import ConnectedFlights from "./ConnectedFlights";
import { generateBookingLink } from "../helpers/linkHelpers";
import { formatDate, formatTime } from "../helpers/formatHelpers";
import { TripCardText } from "../helpers/enums";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';


const OneWayTrip = ({ tripsData, handleShowMoreClick }) => {
  const [expandedFlightId, setExpandedFlightId] = useState(null);

  const toggleExpandStops = (flightId) => {
    setExpandedFlightId(expandedFlightId === flightId ? null : flightId);
  };


  const handleGenerateLink = (offer) => {
    const link = generateBookingLink(offer);
    // window.location.href = link;
    window.open(link, "_blank");
  };
  return (
    <>
      {tripsData?.content?.map((offer, index) => {
        const flightId = `flight-${index}`;
        return (
          <div key={index} className={styles.flightCard}>
            <>
              <div className={styles.flightDetails}>
                <div className={styles.route}>
                  <span>{offer.outbound_flight.departure_city}</span>
                  <span className={styles.arrow}><ArrowRightAltIcon/></span>
                  <span>{offer.outbound_flight.arrival_city}</span>
                </div>
                <div className={styles.date}>
                {formatDate(offer.outbound_flight.origin_date)}
                </div>
              </div>
              <div className={styles.second}>
                <div className={styles.airline}>
                  {/* <img
                    src="https://satguruholidays.com/uploads/assets/images/airline-logos/AI.png"
                    alt="Air India"
                  /> */}
                  {offer.outbound_connected_flights.length === 0 ? (
                    <div className={styles.airlineCode}>
                      <span>
                        {offer.outbound_flight.airline_code}
                        {offer.outbound_flight.flight_number}{" "}
                      </span>
                    </div>
                  ) : (
                    <div className={styles.airlineCode}>
                      {offer.outbound_connected_flights.map(
                        (outbound, outboundIndex) => (
                          <span key={outboundIndex}>
                            {outbound?.airline_code}
                            {outbound.connecting_flight_number}{" "}
                          </span>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.third}>
                <>
                  <div className={styles.a}>
                    <div className={styles.departure}>
                      <div className={styles.departureTime}>
                      {formatTime(offer.outbound_flight.origin_time)}
                      </div>
                      <div className={styles.departureArpt}>
                        {offer.outbound_flight.origin_code}{" "}
                      </div>
                    </div>
                  </div>
                  <div className={styles.b}>
                    <div className={styles.time}>
                      {offer.outbound_flight.flight_duration} |{" "}
                      {offer.outbound_flight.cabin_type}
                    </div>
                    <div className={styles.flightPic}>
                      <Flight />
                    </div>



                    {offer.outbound_connected_flights.length > 0 && (
                      <div
                      className={`${styles.stops} ${styles.stopsHover}`}
                        onClick={() => toggleExpandStops(flightId)}
                      >
                        {offer.outbound_connected_flights.length - 1} Stop(s):{" "}
                        {offer.outbound_connected_flights
                          .slice(0, -1)
                          .map((flight) => flight.destination_code)
                          .join(", ")}
                      </div>
                    )}

                    {offer.outbound_connected_flights.length === 0 && (
                      <div className={styles.stops}>{TripCardText.NONSTOP}</div>
                    )}
                  </div>

                  <div className={styles.c}>
                    <div className={styles.departure}>
                      <div className={styles.departureTime}>
                      {formatTime(offer.outbound_flight.destination_time)}
                      </div>
                      <div className={styles.departureArpt}>
                        {offer.outbound_flight.destination_code}
                      </div>
                    </div>
                  </div>
                </>
              </div>
              {expandedFlightId === flightId &&
                offer.outbound_connected_flights.length > 0 && (
                  <div className={styles.last}>
                    <ConnectedFlights
                      connectedFlights={offer.outbound_connected_flights}
                    />{" "}
                  </div>
                )}

              <div className={styles.mutedLine}></div>
              <div className={styles.last}>
                <div className={styles.fare}>
                  <span className={styles.fareText}>
                 {TripCardText.TOTAL_FARE}
                  </span>
                  <span className={styles.amount}>
                    {offer.price} {offer.currency}
                  </span>
                </div>
                <div className={styles.bookNow}>
                  <button onClick={() => handleGenerateLink(offer)}>
                  {TripCardText.BOOK_FLIGHT}
                  </button>
                </div>
              </div>
            </>
          </div>
        );
      })}

      <div className={styles.showMore}>
        <button onClick={handleShowMoreClick}>{TripCardText.SHOW_MORE}</button>
      </div>
    </>
  );
};

export default OneWayTrip;
