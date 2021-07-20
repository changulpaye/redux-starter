import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "users",
  initialState: [],
  reducers: {
    userAdded: (users, action) => {
      users.push({
        id: users.length + 1,
        name: action.payload.name
      });
    },
  },
});

export const { userAdded, bugAssigned } = slice.actions; // actions 
export default slice.reducer; // default user reducer

