
'use client'
import React, { FC, useState } from "react";
import Protected from "../hooks/UseProtected";
import Heading from "../utils/Heading";
import Header from "../components/Header";

type Props = {};

const Page: FC<Props> = (props) => {
    const [open,setOpen] = useState(false)
    const [activeItem,setActiveItem] = useState(0)
    const [route,setRoute] = useState('Login')
  return (
    <div>
      <Protected>
        <Heading
          title="Know net"
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
      </Protected>
    </div>
  );
};

export default Page;
