import { combineReducers } from "redux";
import entitiesReducer from "./entities";

export default combineReducers({
  entities: entitiesReducer,
  // auth: authReducer - authentication data
  // ui: uiReducer - UI related like theme, showLoader
})

