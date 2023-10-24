"use client";
import React, { FC, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiFillGithub,
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { styles } from "../../styles/style";

type Props = {
  setRoute: (route: string) => void;
};

const schema = yup.object().shape({
  email: yup.string().email("invalid email").required("Please enter you email"),
  password: yup.string().required("Please enter your password").min(6),
});

const Login: FC<Props> = ({setRoute}) => {
  const [show, setShow] = useState(false);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: schema,
    onSubmit: async ({ email, password }) => {
      console.log(email, password);
      // here implement rtk query action
    },
  });

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
                    <FcGoogle size={30} className="cursor-pointer mr-2" />
                    <AiFillGithub size={30} className="cursor-pointer ml-2"/>
            </div>

            <h5 className="text-center pt-4 font-Poppins text-[14px]">
                    Not Have An Account? {""}
                    <span
                    className="text-[#2190ff] pl-1 cursor-pointer"
                    onClick={()=>setRoute("Sign-Up")}
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
