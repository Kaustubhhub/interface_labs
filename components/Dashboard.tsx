"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import DisplayBox from './DisplayBox';
import BasicBars from './Barcharts';
import BasicPie from './Piecharts';

const Dashboard = () => {
    const [paymentReport, setPaymentReport] = useState<any[]>([]);
    const [mtrReport, setMtrReport] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastMonthOrder, setLastMonthOrder] = useState(0);
    const [paymentRecieved, setPaymentRecieved] = useState(0);
    const [paymentPending, setPaymentPending] = useState(0);
    const [returnOrder, setReturnOrder] = useState(0);
    const [negativePayout, setNegavtivePayout] = useState(0);
    const [lastMonthOrderArray, setLastMonthOrderArray] = useState<any[]>([]);
    const [paymentRecievedArray, setPaymentRecievedArray] = useState<any[]>([]);
    const [paymentPendingArray, setPaymentPendingArray] = useState<any[]>([]);
    const [returnOrderArray, setReturnOrderArray] = useState<any[]>([]);
    const [negativePayoutArray, setNegavtivePayoutArray] = useState<any[]>([]);


    useEffect(() => {
        getData()
    }, [])

    const countLastMonthOrder = (data: any) => {
        const currentDate = new Date();

        // Get the last month's year and month
        const lastMonth = currentDate.getMonth() === 0 ? 11 : currentDate.getMonth() - 1;
        const lastMonthYear = lastMonth === 11 ? currentDate.getFullYear() - 1 : currentDate.getFullYear();

        // Filter the data to find orders from the last month
        const lastMonthOrders = data.filter((order: any) => {
            const orderDate = new Date(order.orderDate);
            return orderDate.getMonth() === lastMonth && orderDate.getFullYear() === lastMonthYear;
        });

        // Return the count of last month's orders
        setLastMonthOrderArray(lastMonthOrders)
        setLastMonthOrder(lastMonthOrders.length);
    }

    const countPaymentRecieved = (data: any) => {
        let finalCount = 0;
        let arr: any = [];
        data.forEach((item: any) => {
            if (item.category !== '') {
                if (item.category === 'Order & Payment Received') {
                    finalCount++;
                    arr.push(item)
                }
            }
        })
        console.log('arr', arr);
        setPaymentRecieved(arr)
        setPaymentRecieved(finalCount)
    }

    const countPaymentPending = (data: any) => {
        let finalCount = 0;
        let arr: any = [];
        data.forEach((item: any) => {
            if (item.category !== '') {
                if (item.category === 'Payment Pending') {
                    arr.push(item);
                    finalCount++;
                }
            }
        })
        setPaymentPendingArray(arr)
        setPaymentPending(finalCount)
    }

    const countReturnOrder = (data: any) => {
        let finalCount = 0;
        let arr: any = [];
        data.forEach((item: any) => {
            if (item.category !== '') {
                if (item.category === 'Return') {
                    arr.push(item);
                    finalCount++;
                }
            }
        })
        setReturnOrderArray(arr)
        setReturnOrder(finalCount)
    }

    const countNegativePayout = (data: any) => {
        let finalCount = 0;
        let arr: any = [];
        data.forEach((item: any) => {
            if (item.category !== '') {
                if (item.category === 'Negative Payout') {
                    arr.push(item);
                    finalCount++;
                }
            }
        })
        setNegavtivePayoutArray(arr)
        setNegavtivePayout(finalCount)
    }



    const transformMtrData = (mtrData: any[]) => {
        const filteredMtrData = mtrData
            .filter((mtr) => mtr.transactionType !== "Cancel")
            .map((mtr) => {
                if (mtr.transactionType === "Refund" || mtr.transactionType === "FreeReplacement") {
                    mtr.transactionType = "Return";
                }
                return mtr;
            });
        return filteredMtrData;
    };

    const mergeDataByOrderId = (mtrData: any[], paymentData: any[]) => {
        return mtrData.map((mtr) => {
            const matchingPayment = paymentData.find(pay => pay.orderId === mtr.id);
            if (matchingPayment) {
                return { ...mtr, ...matchingPayment };
            }
            return mtr; // Return mtr as is if no matching payment data is found
        });
    };


    const transformPaymentData = (paymentData: any[]) => {
        const filteredPaymentData = paymentData
            .map((pay) => {
                if (pay.type !== "Transfer") {
                    if (
                        ["Adjustment", "Fulfilment Fee Refund", "FBA Inventory Fee", "Service Fee"].includes(pay.type)
                    ) {
                        pay.type = "Order";
                    } else if (pay.type === "Refund") {
                        pay.type = "Return";
                    }
                    return pay;
                }
            })
            .filter((pay) => pay !== undefined);
        return filteredPaymentData;
    };

    const getData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/getData');
            const { mtrData, paymentData } = response.data;
            const filteredMtrData = transformMtrData(mtrData);
            const filteredPaymentData = transformPaymentData(paymentData);
            let mergedData = mergeDataByOrderId(filteredMtrData, filteredPaymentData);
            mergedData = mergedData.map(x => ({
                ...x,
                id: x.orderId ?? x.id
            }));
            mergedData.forEach(item => {
                let category = '';

                if (item.orderId && item.orderId.length === 10) {
                    category = 'Removal Order IDs';
                }
                else if (item.transactionType === 'Return' && item.invoiceAmount) {
                    category = 'Return';
                }
                else if (item.transactionType === 'Payment' && item.total < 0) {
                    category = 'Negative Payout';
                }
                else if (item.orderId && item.total && item.invoiceAmount) {
                    category = 'Order & Payment Received';
                }
                else if (item.orderId && item.total && !item.invoiceAmount) {
                    category = 'Order Not Applicable but Payment Received';
                }
                else if (item.orderId && item.invoiceAmount && !item.total) {
                    category = 'Payment Pending';
                }

                item.category = category; // Assign the category to the item
            });
            console.log('mergedData', mergedData);
            countLastMonthOrder(mergedData)
            countPaymentRecieved(mergedData)
            countPaymentPending(mergedData)
            countReturnOrder(mergedData)
            countNegativePayout(mergedData)
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };


    if (loading) {
        return <div className='flex justify-center items-center w-full h-screen'>
            <div role="status">
                <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
                <span className="sr-only">Loading...</span>
            </div>
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
                            <input type="search" id="default-search" className="block w-full p-4 ps-10 text-sm border rounded-lg" placeholder="Search" required />
                        </div>
                    </form>
                </div>
                <div className='flex flex-wrap py-2'>
                    <div className='w-full md:w-1/2 lg:w-1/3 pr-2'>
                        <DisplayBox text={"Previous Month Order"} nextPath='/order-payment/previous-month-order' amount={lastMonthOrder} />
                    </div>
                    <div className='w-full md:w-1/2 lg:w-1/3 pr-2'>
                        <DisplayBox text={"Orders & Payments Recieved"} nextPath='/order-payment/payment-order-recieved' amount={paymentRecieved} />
                    </div>
                    <div className='w-full lg:w-1/3'>
                        <DisplayBox text={"payment Pending"} nextPath='/order-payment/payment-pending' amount={paymentPending} />
                    </div>
                </div>

                <div className='flex flex-wrap py-2'>
                    <div className='w-full md:w-1/2 lg:w-1/3 pr-2'>
                        <DisplayBox text={"Tolerance rate breached"} nextPath='/order-payment/tolerance-rate-breached' amount={lastMonthOrder} />
                    </div>
                    <div className='w-full md:w-1/2 lg:w-1/3 pr-2'>
                        <DisplayBox text={"Return"} nextPath='/order-payment/return' amount={returnOrder} />
                    </div>
                    <div className='w-full lg:w-1/3'>
                        <DisplayBox text={"Negative Payout"} nextPath='/order-payment/negative-payout' amount={negativePayout} />
                    </div>
                </div>
                <div className='flex flex-col md:flex-row justify-around'>
                    <div className='border w-full md:w-1/2 pr-1 flex flex-col justify-center items-center rounded-lg'>
                        <div className='flex flex-col justify-center items-center pt-5 font-bold'>
                            Reimbursements by Dispute Type - last 30 days
                        </div>
                        <BasicBars />
                    </div>
                    <div className='border w-full md:w-1/2 md:ml-3 mt-4 md:mt-0 flex flex-col justify-center items-center rounded-lg'>
                        <div className='flex flex-col justify-center items-center pt-5 font-bold'>
                            % Reimbursements by Dispute Type - this year
                        </div>
                        <BasicPie />
                    </div>
                </div>

            </div>
        </>
    )
}

export default Dashboard
