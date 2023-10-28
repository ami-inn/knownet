import { apiSlice } from "../api/apiSlice";
import { userRegistration } from "./authSlice";


type RegistrationResponse = {
    message: string
    activationToken: string
}

type RegistrationData = {}


export const authApi = apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        // all end poinst will be here
        // in rtk query only two type req query = get or fetch mutation put post like that
        register:builder.mutation<RegistrationResponse,RegistrationData>({
            query:(data)=>({
                url:"registration", // localhost:8000/api/v1/registration this mean it
                method:"post",
                body:data,
                credentials:"include" as const, // afrer getting data we need to store it in our reducer 
            }),

            async onQueryStarted(arg,{queryFulfilled,dispatch}){
                try {
                    const result = await queryFulfilled // we get the data when it success
                    dispatch(
                        userRegistration({
                            token:result.data.activationToken
                        })
                    )
                    
                } catch (error:any) {
                    console.log(error);
                    
                }
            }
        })
    })
})
// this action is ready we can call it

export const {useRegisterMutation} = authApi