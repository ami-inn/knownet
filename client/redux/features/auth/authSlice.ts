// kind of reducer

import { PayloadAction, createSlice } from "@reduxjs/toolkit";


const initialState = {
    token:"",
    user:""
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        userRegistration : (state,action:PayloadAction<{token:string}>)=>{
            // it will be global state
            state.token = action.payload.token //we are setting the token
        },
        userLoggedIn:(state,action:PayloadAction<{accessToken:string,user:string}>)=>{
            state.token = action.payload.accessToken
            state.user = action.payload.user
        },
        userLoggedOut:(state,action)=>{
            state.token ="",
            state.user = ""
        }
    }
})

export const {userRegistration,userLoggedIn,userLoggedOut} = authSlice.actions

export default authSlice.reducer