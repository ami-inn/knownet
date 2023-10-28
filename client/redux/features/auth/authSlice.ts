// kind of reducer

import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    token:"",
    user:""
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        userRegistration : (state,action)=>{
            // it will be global state
            state.token = action.payload.token //we are setting the token
        },
        userLoggedIn:(state,action)=>{
            state.token = action.payload.accessToken
            state.user = action.payload.user
        },
        userLoggedOut:(state,action)=>{
            state.token ="",
            state.user = ""
        }
    }
})

export const {userRegistration} = authSlice.actions