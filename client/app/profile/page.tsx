"use client"

import React, { FC, useState } from "react";
import Protected from "../hooks/UseProtected";
import Heading from "../utils/Heading";
import Header from "../components/Header";
import Profile from "../components/Profle/Profile";
import { useSelector } from "react-redux";


type Props = {};

const page: FC<Props> = (Props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login");
  const {user} = useSelector((state:any)=>state.auth)
  return (
    <div>
      <Protected>
        <Heading
          title={`${user?.name} profile`}
          description="Know net is a platform for students to learn and get help from teachers"
          keywords="programming,Mongodb,React,Nodejs,Frontend,Backend,MERN"
        />
        <Header
          open={open}
          setOpen={setOpen}
          activeItem={activeItem}
          setRoute={setRoute}
          route={route}
        />
        <Profile user={user}/>
      </Protected>
    </div>
  );
};

export default page;
