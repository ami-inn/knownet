"use client";
import React, { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiFillGithub,
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { styles } from "../../styles/style";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";
import {signIn} from 'next-auth/react'

type Props = {
  setRoute: (route: string) => void;
  setOpen:(open: boolean) => void;
};

const schema = yup.object().shape({
  email: yup.string().email("invalid email").required("Please enter you email"),
  password: yup.string().required("Please enter your password").min(6),
});

const Login: FC<Props> = ({setRoute,setOpen}) => {
  const [show, setShow] = useState(false);
  const [Login,{isSuccess,isLoading,data,error}] = useLoginMutation()

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: schema,
    onSubmit: async ({ email, password }) => {
      console.log(email, password);
      // here implement rtk query action
      await Login({email,password})
    },
  });

  useEffect(()=>{

    if(isSuccess){
      toast.success("login successfully")
      setRoute("")
      setOpen(false)
    }

    if(error){
      if("data" in error){
        const errorData = error as any;
        toast.error(errorData.data.message)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[isSuccess,error])

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <div className="w-full">
      <h1 className={`${styles.title}`}>Login With Know Net</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="email" className={`${styles.label}`}>
          Enter Your Email
        </label>
        <input
          type="emai"
          name=""
          value={values.email}
          onChange={handleChange}
          id="email"
          placeholder="loginmail@gmail.com"
          className={`${errors.email && touched.email && "border-red-500"}
            ${styles.input}
         `}
        />
        {errors.email && touched.email && (
          <span className="text-red-500 pt-2 block">{errors.email}</span>
        )}

        <div className="w-full mt-5 relative mb-1">
        <label htmlFor="password" className={`${styles.label}`}>
          Enter Your Password
        </label>
        <input
         type={!show?"password":"text"}
         value={values.password}
         id="password"
         placeholder="password!@%"
         onChange={handleChange}
         className={`${errors.password && touched.password && "border-red-500"}
         ${styles.input}
      `}
         />
         {!show?(
            <AiOutlineEyeInvisible
            className="absolute bottom-3 right-2 z-1 cursor-pointer"
            size={20}
            onClick={()=>setShow(true)}
            />
         ):(
            <AiOutlineEye
            className="absolute bottom-3 right-2 z-1 cursor-pointer"
            size={20}
            onClick={()=>setShow(false)}
            />
         )}
                 {errors.password && touched.password && (
          <span className="text-red-500 pt-2 block">{errors.password}</span>
        )}

        </div>

            <div className="w-full mt-5">
                    <input
                     type="submit"
                     value="Login"
                     className={`${styles.button}`}
                     />
            </div>

            <br />

            <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
                Or Join With
            </h5>

            <div className="flex items-center justify-center my-3">
                    <FcGoogle size={30} className="cursor-pointer mr-2"
                    onClick ={()=>signIn('google')} 
                    />
                    <AiFillGithub size={30} className="cursor-pointer ml-2"
                    onClick ={()=>signIn('github')} 
                    />
            </div>

            <h5 className="text-center pt-4 font-Poppins text-[14px]">
                    Not Have An Account? {""}
                    <span
                    className="text-[#2190ff] pl-1 cursor-pointer"
                    onClick={()=>setRoute("SignUp")}
                    >
                        Sign up 
                    </span>
            </h5>

      </form>
      <br />
    </div>
  );
};

export default Login;
