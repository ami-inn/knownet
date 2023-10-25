
'use client' // because this client component

import React,{FC,useState} from "react"
import Heading from "./utils/Heading"
import Header from "./components/Header"
import Hero from "./components/Route/Hero"

interface Props {}


const Page:FC<Props> = (props) =>{

  const [open,setOpen] = useState(false)
  const [activeItem,setActiveItem] = useState(0)
  const [route,setRoute] = useState('Login')

  return(
    <div>
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
      <Hero/>
    </div>
  )
}

export default Page