
'use client' // because this client component

import React,{FC,useState} from "react"
import Heading from "./utils/Heading"
import Header from "./components/Header"

interface Props {}


const Page:FC<Props> = (props) =>{

  const [open,setOpen] = useState(false)
  const [activeItem,setActiveItem] = useState(0)

  return(
    <div>
      <Heading 
      title="Know net"
      description="Know net is a platform for students to learn and get help from teachers"
      keywords="programming, mern, Ai" 
      />
      <Header
      open={open}
      setOpen={setOpen}
      activeItem={activeItem}
      />
    </div>
  )
}

export default Page