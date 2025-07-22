import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../app/features/authSlice'
import jobReducer from '../app/features/jobSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        jobs: jobReducer
    }
})