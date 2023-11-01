import React,{FC} from 'react'

type Props = {
    user:any,
    active:number,
    avatar:string|null,
    setActive:(active:number) => void
    logoutHandler:any
}

const SiderBarProfile:FC<Props> = ({user,active,avatar,setActive,logoutHandler}) => {
  return (
    <div>SiderBarProfile</div>
  )
}

export default SiderBarProfile