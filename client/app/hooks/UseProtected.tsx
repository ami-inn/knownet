import { redirect } from "next/navigation";
import userAuth from "./userAuth";
import React from "react";

// we need to set the custom logic here the user is logged in or not like that
// its an custom hook

interface ProtectedProps{
    children:React.ReactNode
}


export default function Protected({children}:ProtectedProps){
    
    const isAuthenticated = userAuth()

    return isAuthenticated ? children : redirect('/')
}