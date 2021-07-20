import axios from "axios";
import * as actions from "../api";

const api =
  ({ dispatch }) =>
  (next) =>
  async (action) => {
    if (action.type !== actions.apiCallBegan.type) return next(action);

    const { url, method, data, onSuccess, onStart, onError } = action.payload;

    if(onStart)  dispatch({ type: onStart});

    next(action);

    try {
      const response = await axios.request({
        baseURL: "http://localhost:3000/api",
        url,
        method,
        data,
      });
      dispatch(actions.apiCallSuccess(response.data));
      // Sepecific
      if (onSuccess) dispatch({ type: onSuccess, payload: response.data });
    } catch (error) {
      //General
      dispatch(actions.apiCallFailed({ error: error.message }));
      //Specific
      if (onError) dispatch({ type: onError, payload: error.message });
    }
  };
export default api;
