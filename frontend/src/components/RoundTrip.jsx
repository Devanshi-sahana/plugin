import Flight from "@mui/icons-material/Flight";
import styles from "../styles/Trip.module.css";
import { useState } from "react";
import ConnectedFlights from "./ConnectedFlights";
import { generateBookingLink } from "../helpers/linkHelpers";
import { formatDate, formatTime } from "../helpers/formatHelpers";
import { TripCardText } from "../helpers/enums";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

const RoundTrip = ({ tripsData, handleShowMoreClick }) => {
  const [expandedFlightId, setExpandedFlightId] = useState(null);

  const toggleExpandStops = (flightId) => {
    setExpandedFlightId(expandedFlightId === flightId ? null : flightId);
  };
  const handleGenerateRoundTripLink = (offer) => {
    const link = generateBookingLink(offer);
    window.open(link, "_blank");
  };

  console.log("td:", tripsData);

  return (
    <>
      {tripsData?.content?.map((offer, index) => {
        const outboundFlightId = `outbound-flight-${index}`;
        const returnFlightId = `return-flight-${index}`;
        return (
          <div key={index} className={styles.flightCard}>
            {/* Outbound flight details */}
            <div className={styles.flightDetails}>
              <div className={styles.route}>
                <span>{offer.outbound_flight.departure_city}</span>
                <span className={styles.arrow}>
                  <ArrowRightAltIcon />
                </span>
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
                <div className={styles.airlineCode}>
                  {offer.outbound_connected_flights.length === 0 ? (
                    <span>
                      {offer.outbound_flight.airline_code}
                      {offer.outbound_flight.flight_number}
                    </span>
                  ) : (
                    offer.outbound_connected_flights.map(
                      (flight, flightIndex) => (
                        <span key={flightIndex}>
                          {flight.airline_code}
                          {flight.connecting_flight_number}{" "}
                        </span>
                      )
                    )
                  )}
                </div>
              </div>
            </div>

            <div className={styles.third}>
              <div className={styles.a}>
                <div className={styles.departure}>
                  <div className={styles.departureTime}>
                    {formatTime(offer.outbound_flight.origin_time)}
                  </div>
                  <div className={styles.departureArpt}>
                    {offer.outbound_flight.origin_code}
                  </div>
                </div>
              </div>
              <div className={styles.b}>
                <div className={styles.time}>
                  {formatTime(offer.outbound_flight.destination_time)}|{" "}
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
            </div>
            {expandedFlightId === outboundFlightId &&
              offer.outbound_connected_flights.length > 0 && (
                <div className={styles.last}>
                  <ConnectedFlights
                    connectedFlights={offer.outbound_connected_flights}
                  />{" "}
                </div>
              )}

            <div className={styles.mutedLine}></div>

            {/* Return flight details */}
            {offer.return_flight && (
              <>
                <div className={styles.flightDetails}>
                  <div className={styles.route}>
                    <span>{offer.return_flight.departure_city}</span>
                    <span className={styles.arrow}>
                      <ArrowRightAltIcon />
                    </span>
                    <span>{offer.return_flight.arrival_city}</span>
                  </div>
                  <div className={styles.date}>
                    {formatDate(offer.return_flight.origin_date)}
                  </div>
                </div>

                <div className={styles.second}>
                  <div className={styles.airline}>
                    {/* <img
                      src="https://satguruholidays.com/uploads/assets/images/airline-logos/AI.png"
                      alt="Air India"
                    /> */}
                    <div className={styles.airlineCode}>
                      {offer.return_connected_flights.length === 0 ? (
                        <span>
                          {offer.return_flight.airline_code}
                          {offer.return_flight.flight_number}
                        </span>
                      ) : (
                        offer.return_connected_flights.map(
                          (flight, flightIndex) => (
                            <span key={flightIndex}>
                              {flight.airline_code}
                              {flight.connecting_flight_number}{" "}
                            </span>
                          )
                        )
                      )}
                    </div>
                  </div>
                </div>

                <div className={styles.third}>
                  <div className={styles.a}>
                    <div className={styles.departure}>
                      <div className={styles.departureTime}>
                        {formatTime(offer.return_flight.origin_time)}
                      </div>
                      <div className={styles.departureArpt}>
                        {offer.return_flight.origin_code}
                      </div>
                    </div>
                  </div>
                  <div className={styles.b}>
                    <div className={styles.time}>
                      {formatTime(offer.return_flight.destination_time)} |{" "}
                      {offer.return_flight.cabin_type}
                    </div>
                    <div className={styles.flightPic}>
                      <Flight />
                    </div>

                    {offer.return_connected_flights.length > 0 && (
                      <div
                        className={`${styles.stops} ${styles.stopsHover}`}
                        onClick={() => toggleExpandStops(returnFlightId)}
                      >
                        {offer.return_connected_flights.length - 1} Stop(s):{" "}
                        {offer.return_connected_flights
                          .slice(0, -1)
                          .map((flight) => flight.destination_code)
                          .join(", ")}
                      </div>
                    )}
                    {offer.return_connected_flights.length === 0 && (
                      <div className={styles.stops}>{TripCardText.NONSTOP}</div>
                    )}
                  </div>
                  <div className={styles.c}>
                    <div className={styles.departure}>
                      <div className={styles.departureTime}>
                        {formatTime(offer.return_flight.destination_time)}
                      </div>
                      <div className={styles.departureArpt}>
                        {offer.return_flight.destination_code}
                      </div>
                    </div>
                  </div>
                </div>
                {expandedFlightId === returnFlightId &&
                  offer.return_connected_flights.length > 0 && (
                    <div className={styles.last}>
                      <ConnectedFlights
                        connectedFlights={offer.return_connected_flights}
                      />{" "}
                    </div>
                  )}

                <div className={styles.mutedLine}></div>
              </>
            )}

            {/* Fare and Book Now */}
            <div className={styles.last}>
              <div className={styles.fare}>
                <span className={styles.fareText}>
                  {TripCardText.TOTAL_FARE}{" "}
                </span>
                <span className={styles.amount}>
                  {offer.price} {offer.currency}
                </span>
              </div>
              <div className={styles.bookNow}>
                <button onClick={() => handleGenerateRoundTripLink(offer)}>
                  {TripCardText.BOOK_FLIGHT}{" "}
                </button>
              </div>
            </div>
          </div>
        );
      })}

      <div className={styles.showMore}>
        <button onClick={handleShowMoreClick}>{TripCardText.SHOW_MORE}</button>
      </div>
    </>
  );
};

export default RoundTrip;
