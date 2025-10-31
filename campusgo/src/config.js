const defaultStartDate = "2025-11-26T11:30:00";
const defaultPostDate = "2025-11-27T00:00:00";

// Lee la variable de entorno O usa el valor por defecto
export const eventStartDate = new Date(
  process.env.REACT_APP_EVENT_START_DATE || defaultStartDate
);

export const postEventDate = new Date(
  process.env.REACT_APP_POST_EVENT_DATE || defaultPostDate
);