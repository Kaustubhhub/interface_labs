"use client"

import React from 'react'
import { LuHistory } from "react-icons/lu";
import { TbTopologyBus } from "react-icons/tb";
import { IoFileTrayStackedOutline } from "react-icons/io5";
import { PiChartPieSlice } from "react-icons/pi";
import { IoChatbubblesOutline } from "react-icons/io5";
import { IoBookOutline } from "react-icons/io5";
import { RiFolder6Line } from "react-icons/ri";
import { IoFingerPrint } from "react-icons/io5";
import { CiDumbbell } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { IoMdShare } from "react-icons/io";
import { MdLogout } from "react-icons/md";
import { useRouter } from 'next/navigation';


const SIDEBAR_ICONS = [
    {
        img: <PiChartPieSlice />
        ,
        path: "/dashboard"

    }, {
        img: <IoChatbubblesOutline />
        ,
        path: "/dashboard"

    }, {
        img: <IoBookOutline />
        ,
        path: "/dashboard"

    }, {
        img: <RiFolder6Line />

        ,
        path: "/dashboard"

    }, {
        img: <IoFileTrayStackedOutline />
        ,
        path: "/dashboard"

    }, {
        img: <LuHistory />
        ,
        path: "/dashboard"

    }, {
        img: <TbTopologyBus />
        ,
        path: "/dashboard"

    }, {
        img: <IoFingerPrint />,
        path: "/dashboard"

    }, {
        img: <IoFingerPrint />
        ,
        path: "/dashboard"

    }, {
        img: <CiDumbbell />
        ,
        path: "/dashboard"

    },
]

const LOWER_SIDEBAR_ICONS = [
    {
        img: <CgProfile />
        ,
        path: "/dashboard"

    }, {
        img: <IoMdShare />
        ,
        path: "/dashboard"

    }, {
        img: <MdLogout />
        ,
        path: "/dashboard"

    }
]

const Sidebar = () => {

    const router = useRouter()
    return (
        <div className='relative border flex flex-col justify-between items-center h-screen w-20 bg-[#FAFAFA]'>
            <div className='py-10'>
                {SIDEBAR_ICONS.map((x, i) => {
                    return <div onClick={() => (router.push(`${x.path}`))} key={i} className='p-3 text-xl cursor-pointer'>
                        {x.img}
                    </div>
                })}
            </div>
            <div className="py-10">
                {LOWER_SIDEBAR_ICONS.map((x, i) => {
                    return <div key={i} className='p-3 text-xl  cursor-pointer'>
                        {x.img}
                    </div>
                })}
            </div>
        </div>
    )
}

export default Sidebar
