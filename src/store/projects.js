import { createSlice  } from "@reduxjs/toolkit";

const slice = createSlice({
    name: 'projects',
    initialState: [],
    reducers:{
        projectAdded: (projects, action) => {
            projects.push({
                id: projects.length + 1,
                name: action.payload.name
            })
        }
    }
});

export const { projectAdded } = slice.actions;

export default slice.reducer;