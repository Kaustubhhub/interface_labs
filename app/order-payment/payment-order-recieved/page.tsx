import TableComponent from '@/components/TableComponent'
import React from 'react'

const headers = ['order ID', 'Net Amount', 'Invoice Amount', 'Order Date', 'P_Description', 'Payment Details'];
const data = [
  ['John Doe', 30, 'Software Engineer'],
  ['Jane Smith', 28, 'Graphic Designer'],
  ['Sam Wilson', 35, 'Project Manager'],
];

const page = () => {
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
          Order & payment Received
        </span>

      </div>
      <div className='border ml-3 mt-3 w-full'>
        <TableComponent headers={headers} data={data} />
      </div>
    </div>
  )
}

export default page
