"use client"

import { useRouter } from 'next/navigation';
import React from 'react'
import { MdOutlineNavigateNext } from "react-icons/md";

interface DisplayBoxProps {
    text: string,
    amount: number,
    nextPath: string
}

const DisplayBox = ({ text, amount, nextPath }: DisplayBoxProps) => {
    const router = useRouter();
    const handleClick = () => {
        router.push(nextPath)
    }

    return (
        <div className='flex justify-between p-4 items-center border rounded-lg'>
            <div className=''>
                <div className='font-bold p-3'>
                    {text}
                </div>
                <div className='text-2xl font-bold px-3 py-2'>
                    {amount}
                </div>
            </div>
            <div onClick={handleClick} className='p-4 text-2xl cursor-pointer'>
                <MdOutlineNavigateNext />
            </div>
        </div>
    )
}

export default DisplayBox
