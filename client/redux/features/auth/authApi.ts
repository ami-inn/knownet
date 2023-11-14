import { apiSlice } from "../api/apiSlice";
import { userLoggedIn, userLoggedOut, userRegistration } from "./authSlice";

type RegistrationResponse = {
  message: string;
  activationToken: string;
};

type RegistrationData = {};

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // all end poinst will be here
    // in rtk query only two type req query = get or fetch mutation put post like that
    register: builder.mutation<RegistrationResponse, RegistrationData>({
      query: (data) => ({
        url: "registration", // localhost:8000/api/v1/registration this mean it
        method: "post",
        body: data,
        credentials: "include" as const, // afrer getting data we need to store it in our reducer
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled; // we get the data when it success
          dispatch(
            userRegistration({
              token: result.data.activationToken,
            })
          );
        } catch (error: any) {
          console.log(error);
        }
      },
    }),

    activation: builder.mutation({
      query: ({ activation_token, activation_code }) => ({
        // got to server activation token and code from req.body check it on backerns  // we recieving this arguments values
        url: "activate-user",
        method: "POST",
        body: {
          activation_token,
          activation_code,
        },
      }),
    }),

    login:builder.mutation({
      query:({email,password})=>({
        url: "login",
        method: "POST",
        body:{email,password},
        credentials:"include" as const
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled; // we get the data when it success
          dispatch(
            userLoggedIn({
              accessToken: result.data.activationToken,
              user:result.data.user
            })
          );
        } catch (error: any) {
          console.log(error);
        }
      },
    }),

    socialAuth:builder.mutation({
      query:({email,name,avatar})=>({
        url: "social-auth",
        method: "POST",
        body:{email,name,avatar},
        credentials:"include" as const
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled; // we get the data when it success
          dispatch(
            userLoggedIn({
              accessToken: result.data.activationToken,
              user:result.data.user
            })
          );
        } catch (error: any) {
          console.log(error);
        }
      },
    }),

    logout:builder.query({
      query:()=>({
        url: "logout",
        method: "Get",
        credentials:"include" as const
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try { // we get the data when it success
          dispatch(
          userLoggedOut()
          );
        } catch (error: any) {
          console.log(error);
        }
      },
    })

  }),
});
// this action is ready we can call it

export const { useRegisterMutation,useActivationMutation,useLoginMutation ,useSocialAuthMutation,useLogoutQuery} = authApi;
