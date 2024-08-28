"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Dashboard = () => {
    const [paymentReport, setPaymentReport] = useState<any[]>([]);
    const [mtrReport, setMtrReport] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        setLoading(true);
        const response = await axios.get('/api/getData');
        const { mtrData, paymentData } = response.data;
        setMtrReport(mtrData)
        setPaymentReport(paymentData)
        setLoading(false);
    }

    if (loading) {
        return <div className='flex justify-center items-center w-full h-screen'>
            fetching data
        </div>
    }

    return (
        <>
            <div className='bg-[#fafafa] text-[#724DFF] flex justify-center items-center p-4 border'>
                <span className='font-bold'>
                    Dashboard
                </span>
            </div>
            <div className='p-2'>
                <div className='border'>
                    <form className="max-w-md mx-auto p-3">
                        <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </div>
                            <input type="search" id="default-search" className="block w-full p-4 ps-10 text-sm border rounded-lg" placeholder="Search Mockups, Logos..." required />
                        </div>
                    </form>
                </div>
                <div>

                </div>
            </div>
        </>
    )
}

export default Dashboard
