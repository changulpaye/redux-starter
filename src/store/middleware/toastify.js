const logger = (store) => (next) => (action) => {
  console.log("action", action);
  if (action.type === "error")
    console.log(`Toastify - ${action.payload.message}`);
  else next(action);
};

export default logger;