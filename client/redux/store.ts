"use client"

import {configureStore} from "@reduxjs/toolkit"
import { apiSlice } from './features/api/apiSlice' // import something from
import authSlice from "./features/auth/authSlice"



export const store = configureStore({
    reducer:{
        [apiSlice.reducerPath]:apiSlice.reducer,
        auth:authSlice
    },
    devTools:false, // if we keep this true then people can got to  website they can use redux dev tools to debug it
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware().concat(apiSlice.middleware)
})


// when application reeload call the refresh token function every page load
const initializeApp = async()=>{
    await store.dispatch(apiSlice.endpoints.refreshToken.initiate({},{forceRefetch:true}))
}

initializeApp()