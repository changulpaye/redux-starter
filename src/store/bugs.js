import { createSlice, createSelector } from "@reduxjs/toolkit";
import axios from "axios";
import { getDifferenceInMinutes } from "../utils";
import { apiCallBegan } from "./api";

//************************* SLICE ***********************/
//-------------------------------------------------------/
const slice = createSlice({
  name: "bugs",
  initialState: {
    list: [],
    loading: false,
    lastFetch: null,
  },
  reducers: {
    bugsRequested: (bugs, action) => {
      bugs.loading = true;
    },

    bugsReceived: (bugs, action) => {
      bugs.list = action.payload;
      bugs.loading = false;
      bugs.lastFetch = Date.now();
    },

    bugsRequestFailed: (bugs, action) => {
      bugs.loading = false;
    },

    bugAssignedToUser: (bugs, action) => {
      const { id: bugId, userId } = action.payload;
      const i = bugs.list.findIndex((e) => e.id === bugId);
      bugs.list[i].userId = userId;
    },

    bugAdded: (bugs, action) => {
      const bug = action.payload;
      bugs.list.push(bug);
    },

    bugResolved: (bugs, action) => {
      const i = bugs.list.findIndex((e) => e.id === action.payload.id);
      bugs.list[i].resolved = true;
    },

    bugRemoved: (bugs, action) => {
      bugs.list = bugs.list.filter((bug) => bug.id !== action.payload.id);
    },
  },
});

export const {
  bugAdded,
  bugRemoved,
  bugResolved,
  bugAssignedToUser,
  bugsReceived,
  bugsRequested,
  bugsRequestFailed,
} = slice.actions;
export default slice.reducer;

/***********************ACTION CREATORS ***************************/
//-----------------------------------------------------------------/
const url = "/bugs";

export const loadBugs = () => (dispatch, getState) => {
  const { lastFetch } = getState().entities.bugs;
  //Caching
  const diffInMinutes = getDifferenceInMinutes(lastFetch);
  if (diffInMinutes < 10) return;

  return  dispatch(
    apiCallBegan({
      url,
      onStart: bugsRequested.type,
      onSuccess: bugsReceived.type,
      onError: bugsRequestFailed.type,
    })
  );
};

// make an API call
// promise resolved => dispatch(success/error)
// API Call without middleware ***** Voila!!!!
// export const addBug = (bug) => async (dispatch) => {
//   try {
//     const { data } = await axios.request({
//       baseURL: "http://localhost:3000/api",
//       url: "/bugs",
//       method: "post",
//       data: bug,
//     });
//     dispatch(bugAdded(data));
//   } catch (error) {
//     dispatch(bugsRequestFailed({ message: error.message }));
//   }
// };

export const addBug = bug => apiCallBegan({
  url,
  method:"post",
  data: bug,
  onSuccess: bugAdded.type,
})

export const resolveBug = (id) =>
  apiCallBegan({
    url: url + "/" + id,
    method: "patch",
    data: { resolved: true },
    onSuccess: bugResolved.type,
  });

export const assignBugToUser = (bugId, userId) =>
  apiCallBegan({
    url: url + "/" + bugId,
    method: "patch",
    data: { userId },
    onSuccess: bugAssignedToUser.type,
  });

export const removeBug = (id) =>
  apiCallBegan({
    url: url + "/" + id,
    method: "delete",
    onSuccess: bugRemoved.type,
  });

// *************** SELECTORS **********************/
//--------------------------------------------------------------/
export const getUnresolvedBugs = createSelector(
  (state) => state.entities.bugs.list,
  (list) => list.filter((bug) => !bug.resolved)
);

export const getBugsByUser = (userId) =>
  createSelector(
    (state) => state.entities.bugs.list,
    (list) => list.filter((bug) => bug.userId === userId)
  );

export const getAssignedBugs = createSelector(
  (state) => state.entities.bugs.list,
  (list) => list.filter((bug) => bug.userId)
);
