"use client"

import {configureStore} from "@reduxjs/toolkit"
import { apiSlice } from './features/api/apiSlice' // import something from




export const store = configureStore({
    reducer:{
        [apiSlice.reducerPath]:apiSlice.reducer,
    },
    devTools:false, // if we keep this true then people can got to  website they can use redux dev tools to debug it
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware().concat(apiSlice.middleware)
})