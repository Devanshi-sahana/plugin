export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });
  };
  
  export const formatTime = (timeString) => {
    return timeString.slice(0, 5);
  };

  