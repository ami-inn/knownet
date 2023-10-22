
'use client' // because this client component

import React,{FC,useState} from "react"
import Heading from "./utils/Heading"

interface Props {}


const Page:FC<Props> = (props) =>{
  return(
    <div>
      <Heading 
      title="Know net"
      description="Know net is a platform for students to learn and get help from teachers"
      keywords="programming, mern, Ai" 
      />
    </div>
  )
}

export default Page