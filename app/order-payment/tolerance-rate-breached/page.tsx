"use client"
import TableComponent from '@/components/TableComponent'
import axios from 'axios';
import React, { useEffect, useState } from 'react'


const headers = ['order ID', 'Net Amount', 'Invoice Amount', 'Order Date', 'P_Description', 'Payment Details'];
const data = [
  ['John Doe', 30, 'Software Engineer'],
  ['Jane Smith', 28, 'Graphic Designer'],
  ['Sam Wilson', 35, 'Project Manager'],
];

const page = () => {
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData();
  }, [])

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
    <div className='absolute top-0 left-20 w-11/12'>
      <div className='bg-[#fafafa] text-[#724DFF] flex items-center p-8 border'>
        <span className='font-bold'>
          Table-view
        </span>
        <span className='font-bold pl-3 text-[#1C1C1C33]'>
          /
        </span>
        <span className="text-black font-bold pl-3">
          Tolerance rate breached
        </span>

      </div>
      <div className='border ml-3 mt-3 w-full'>
        <TableComponent headers={headers} data={data} />
      </div>
    </div>
  )
}

export default page
