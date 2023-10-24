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
  name: yup.string().required("Please enter Your Name"),
  email: yup.string().email("invalid email").required("Please enter you email"),
  password: yup.string().required("Please enter your password").min(6),
});

const SignUp: FC<Props> = ({setRoute}) => {
  const [show, setShow] = useState(false);

  const formik = useFormik({
    initialValues: {name:"", email: "", password: "" },
    validationSchema: schema,
    onSubmit: async ({ email, password }) => {
      console.log(email, password);
      // here implement rtk query action
      setRoute("verification")
    },
  });

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <div className="w-full">
      <h1 className={`${styles.title}`}>Join to Know Net</h1>

      <form onSubmit={handleSubmit}>

        <div className="mb-3">
        <label htmlFor="email" className={`${styles.label}`}>
          Enter Your Name
        </label>
        <input
          type="text"
          name=""
          value={values.name}
          onChange={handleChange}
          id="name"
          placeholder="Enter Your Name"
          className={`${errors.name && touched.name && "border-red-500"}
            ${styles.input}
         `}
        />
                {errors.name && touched.name && (
          <span className="text-red-500 pt-2 block">{errors.name}</span>
        )}
        </div>

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


        </div>
        {errors.password && touched.password && (
          <span className="text-red-500 pt-2 block">{errors.password}</span>
        )}

            <div className="w-full mt-5">
                    <input
                     type="submit"
                     value="Sign-Up"
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
                    Already Have An Account? {""}
                    <span
                    className="text-[#2190ff] pl-1 cursor-pointer"
                    onClick={()=>setRoute("Login")}
                    >
                        Sign in
                    </span>
            </h5>

      </form>
      <br />
    </div>
  );
};

export default SignUp;
