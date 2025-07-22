import { createSlice } from "@reduxjs/toolkit";

export const jobSlice = createSlice({
    name: "jobs",
    initialState: {
        loading: false,
        jobs: []
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setJobs: (state, action) => {
            state.jobs = action.payload;
        },
        addJob: (state, action) => {
            state.jobs.push(action.payload);
        },
        updateJobDetails: (state, action) => {
            const { jobId, details } = action.payload;
            const jobIndex = state.jobs.findIndex((job) => job._id === jobId);

            if (jobIndex !== -1) {
                state.jobs[jobIndex].Details = {
                    ...state.jobs[jobIndex].Details,
                    ...details,
                };
            }
        },
        updateFullJob: (state, action) => {
            const updatedJob = action.payload;
            const jobIndex = state.jobs.findIndex((job) => job._id === updatedJob._id);

            if (jobIndex !== -1) {
                state.jobs[jobIndex] = updatedJob;
            }
        },
    }
});

export const { setLoading, setJobs, addJob, updateJobDetails, updateFullJob } = jobSlice.actions;
export default jobSlice.reducer;
