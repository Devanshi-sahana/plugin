export const generateBookingLink = (offer) => {
    const link = `https://satguruholidays.com/flight-service.html?sid=${offer.sid}&:sid=${offer.sid}&code=${offer.code}&iti=${offer.itinerary_code}:${offer.index}&:iti=${offer.itinerary_code}:${offer.index}`;
    return link;
  };