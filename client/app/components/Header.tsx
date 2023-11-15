"use client";
import React, { FC, useEffect, useState } from "react";
import Link from "next/link";
import NavItems from "../utils/NavItems";
import { ThemeSwitcher } from "../utils/ThemeSwitcher";
import { HiOutlineMenuAlt1, HiOutlineUserCircle } from "react-icons/hi";
import CustomModal from "../utils/CustomModal";
import Login from "../components/Auth/Login";
import SignUp from "../components/Auth/SignUp";
import Verification from '../components/Auth/Verification'
import { useSelector } from "react-redux";
import Image from "next/image";
import avatar from '../../public/assets/avatar.jpg'
import { useSession } from "next-auth/react";
import { useLogoutQuery, useSocialAuthMutation } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route: string;
  setRoute: (route: string) => void;
};

const Header: FC<Props> = ({ activeItem, setOpen, route, open, setRoute }) => {
  console.log(route);

  const [active, setActive] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const {user} = useSelector((state:any) => state.auth)
  const {data} = useSession()
  const [socialAuth,{isSuccess,error}] = useSocialAuthMutation()

  const [logout,setLogout] = useState(false)
  const {} = useLogoutQuery(undefined,{
    skip: !logout ? true : false // when will click logout is false then true
  })

  // in data we gey google auth data

  useEffect(()=>{

    if(!user){
      if(data){
        socialAuth({email:data.user?.email,name:data.user?.name,avatar:data.user?.image})
      }
      if(data === null ){
        if(isSuccess){

          toast.success("login successfully")
        }
      }
      
    if(data == null){
      console.log('The problem is here.....');
      
      setLogout(true)
    }
    }




  },[data,user])

  //   when active true

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 80) {
        setActive(true);
      } else {
        setActive(false);
      }
    });
  }

  const handleClose = (e: any) => {
    if (e.target.id === "screen") {
      {
        setOpenSidebar(false);
      }
    }
  };

  return (
    <div className="w-full relative">
      <div
        className={`${
          active
            ? "dark:bg-opacity-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-[80px] z-[80] border-b dark:border-[#ffffff1c] shadow-xl transition duration-500"
            : "w-full border-b dark:border-[#ffffff1c] h-[80px] z-[80] dark:shadow "
        }`}
      >
        <div className="w-[95%] 800px:w-[92%] m-auto py-2 h-full ">
          <div className="w-full h-[80px] flex items-center justify-between p-3 ">
            <div>
              <Link
                href={"/"}
                className={`text-[25px] font-Poppins font-[500] text-black dark:text-white`}
              >
                KnowNet
              </Link>
            </div>

            <div className="flex items-center">
              <NavItems activeItem={activeItem} isMobile={false} />
              <ThemeSwitcher />
              {/* this is only for mobile */}
              <div className="800px:hidden">
                <HiOutlineMenuAlt1
                  size={25}
                  className="cursor-pointer text-black dark:text-white"
                  onClick={() => setOpenSidebar(true)}
                />
              </div>
              {
                user ? 
                <Link href={'/profile'}>
                <Image
                src={user.avatar?user.avatar.url:avatar}
                alt="image"
                width={30}
                height={30}
                className="w-[30px] h-[30px] rounded-full cursor-pointer"
                />
                </Link>
                :
                <HiOutlineUserCircle
                  size={25}
                  className="hidden 800px:block cursor-pointer dark:text-white text-black"
                  onClick={() => setOpen(true)}
                />
              }



            </div>
          </div>
        </div>

        {/* mobile sidebar  */}

        {openSidebar && (
          <div
            className="fixed w-full h-screen top-0 left-0 z-[99999] dark:bg-[unset] bg-[#00000024]"
            onClick={handleClose}
            id="screen"
          >
            <div className="w-[70%] fixed z-[999999999] h-screen bg-white dark:bg-slate-900 dark:bg-opacity-90 top-0 right-0">
              <NavItems activeItem={activeItem} isMobile={true} />
              <HiOutlineUserCircle
                size={25}
                className="cursor-pointer ml-5 my-2 dark:text-white text-black"
                onClick={() => setOpen(true)}
              />

              <br />
              <br />
              <p className="text-[16px] px-2 pl-5 text-black dark:text-white">
                copyright @ 2023 know net
              </p>
            </div>
          </div>
        )}
      </div>
      {route === "Login" && (
        <>
          {open && (
            <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Login}
            />
          )}
        </>
      )}
      {route === "SignUp" && (
        <>
          {open && (
            <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={SignUp}
            />
          )}
        </>
      )}
          {route === "verification" && (
        <>
          {open && (
            <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Verification}
            />
          )}
        </>
      )}

    </div>
  );
};

export default Header;
