"use client";
import prisma from '@/db';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';

const UploadFiles: React.FC = () => {
    const [paymentReport, setPaymentReport] = useState<any[]>([]);
    const [mtrReport, setMtrReport] = useState<any[]>([]);
    const [paymentReportFileName, setPaymentReportFileName] = useState<string | null>(null);
    const [mtrReportFileName, setMtrReportFileName] = useState<string | null>(null);
    const router = useRouter()

    const excelDateToUTC = (serial: number): Date => {
        const utcDays = Math.floor(serial - 25569);
        const utcValue = utcDays * 86400;
        const dateInfo = new Date(utcValue * 1000);

        const fractionalDay = serial - Math.floor(serial) + 0.0000001; // To avoid floating-point precision issues
        const totalSeconds = Math.floor(86400 * fractionalDay);

        const seconds = totalSeconds % 60;
        const minutes = Math.floor(totalSeconds / 60) % 60;
        const hours = Math.floor(totalSeconds / 3600);

        dateInfo.setUTCHours(hours);
        dateInfo.setUTCMinutes(minutes);
        dateInfo.setUTCSeconds(seconds);

        return dateInfo;
    };

    const isExcelDate = (value: number): boolean => {
        return value > 25569 && value < 2958465;
    };

    const handleCsvUpload = (
        event: React.ChangeEvent<HTMLInputElement>,
        setData: React.Dispatch<React.SetStateAction<any[]>>,
        setFileName: React.Dispatch<React.SetStateAction<string | null>>
    ) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result;
                if (result) {
                    const text = result as string;
                    const csvData = XLSX.utils.sheet_to_json(XLSX.read(text, { type: 'string' }).Sheets["Sheet1"], { header: 1 });

                    const headers = csvData[0] as string[]; // Assuming first row is header
                    const rowData = csvData.slice(1).map((row) => {
                        if (Array.isArray(row)) { // Check if 'row' is an array
                            return headers.reduce((acc, key, i) => {
                                const value = row[i];
                                if (value === null || value === undefined) {
                                    acc[key] = value; // Preserve null or undefined
                                } else if (typeof value === 'number' && isExcelDate(value)) {
                                    acc[key] = excelDateToUTC(value); // Convert only valid Excel dates
                                } else {
                                    acc[key] = value; // Preserve other values
                                }
                                return acc;
                            }, {} as { [key: string]: any });
                        }
                        return {}; // Return empty object if 'row' is not an array
                    });

                    setData(rowData);
                    console.log(rowData);
                }
            };
            reader.readAsText(file);
        }
    };



    const handleFileUpload = (
        event: React.ChangeEvent<HTMLInputElement>,
        setData: React.Dispatch<React.SetStateAction<any[]>>,
        setFileName: React.Dispatch<React.SetStateAction<string | null>>,
        isCSV: boolean = false
    ) => {
        if (isCSV) {
            handleCsvUpload(event, setData, setFileName);
        } else {
            const file = event.target.files?.[0];
            if (file) {
                setFileName(file.name);
                const reader = new FileReader();
                reader.onload = (e) => {
                    const result = e.target?.result;
                    if (result) {
                        const data = new Uint8Array(result as ArrayBuffer);
                        const workbook = XLSX.read(data, { type: 'array' });
                        const sheetName = workbook.SheetNames[0];
                        const worksheet = workbook.Sheets[sheetName];

                        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                        const headers = jsonData[0] as string[]; // Assuming first row is header
                        const rowData = jsonData.slice(1).map((row) =>
                            headers.reduce((acc, key, i) => {
                                const value = row[i];
                                if (value === null || value === undefined) {
                                    acc[key] = value; // Preserve null or undefined
                                } else if (typeof value === 'number' && isExcelDate(value)) {
                                    acc[key] = excelDateToUTC(value); // Convert only valid Excel dates
                                } else {
                                    acc[key] = value; // Preserve other values
                                }
                                return acc;
                            }, {} as { [key: string]: any })
                        );

                        setData(rowData);
                    }
                };
                reader.readAsArrayBuffer(file);
            }
        }
    };

    const handleRemoveFile = (setData: React.Dispatch<React.SetStateAction<any[]>>, setFileName: React.Dispatch<React.SetStateAction<string | null>>) => {
        setData([]);
        setFileName(null);
    };


    const handleSubmit = async () => {
        // Map paymentReport to Prisma-compatible data structure
        const paymentData = paymentReport.map((payment) => ({
            date: payment["date/time"] ?? "", // Default to empty string if undefined
            type: payment["type"]?.trim() ?? "", // Remove any trailing newline or whitespace, default to empty string if undefined
            orderId: payment["order id"] ?? "", // Assuming order id is already a string or default to empty string
            description: payment["description"] ?? "", // Default to empty string if undefined
            total: payment["total"]?.toString() ?? "", // Convert total to string, default to empty string if undefined
        }));

        // Map mtrReport to Prisma-compatible data structure
        const mtrData = mtrReport.map((mtr) => ({
            id: mtr["Order Id"] ?? "", // Use Order Id as the primary key (which is UUID), default to empty string if undefined
            invoiceDate: mtr["Invoice Date"] ?? "", // Default to empty string if undefined
            transactionType: mtr["Transaction Type"] ?? "", // Default to empty string if undefined
            shipmentDate: mtr["Shipment Date"] ?? "", // Default to empty string if undefined
            orderDate: mtr["Order Date"] ?? "", // Default to empty string if undefined
            shipmentItemId: mtr["Shipment Item Id"]?.toString() ?? "", // Convert to string, default to empty string if undefined
            description: mtr["Item Description"] ?? "", // Default to empty string if undefined
            invoiceAmount: mtr["Invoice Amount"]?.toString() ?? "", // Convert to string, default to empty string if undefined
        }));

        console.log('paymentData', paymentData);
        console.log('mtrData', mtrData);

        try {
            const response = await axios.post('/api/uploadExcel', {
                paymentData,
                mtrData,
            });

            if (response.status === 200) {
                router.push('/dashboard');
            } else {
                console.error('Failed to upload data', response);
            }
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };



    return (
        <div>
            <div className='flex justify-center'>
                <div className='p-4'>
                    <label className="block mb-2 text-sm font-medium">Upload payment report (CSV)</label>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={(event) => handleFileUpload(event, setPaymentReport, setPaymentReportFileName, true)}
                        className="p-3 block w-[6/12] text-sm border rounded-lg cursor-pointer"
                    />
                </div>
                <div className='p-4'>
                    <label className="block mb-2 text-sm font-medium">Upload merchant tax report (MTR)</label>
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={(event) => handleFileUpload(event, setMtrReport, setMtrReportFileName)}
                        className="p-3 block w-[6/12] text-sm border rounded-lg cursor-pointer"
                    />
                </div>
            </div>

            {paymentReport.length > 0 && mtrReport.length > 0 && (
                <div className='flex justify-center p-3'>
                    <button onClick={handleSubmit} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                        Submit
                    </button>
                </div>
            )}

            <div className='flex justify-between'>
                {paymentReport.length > 0 && (
                    <div className='border'>
                        <h3>Uploaded Payment Report: {paymentReportFileName}</h3>
                        <pre>{JSON.stringify(paymentReport, null, 2)}</pre>
                        <button onClick={() => handleRemoveFile(setPaymentReport, setPaymentReportFileName)}>Remove Payment Report</button>
                    </div>
                )}
                {mtrReport.length > 0 && (
                    <div className='border'>
                        <h3>Uploaded MTR Report: {mtrReportFileName}</h3>
                        <pre>{JSON.stringify(mtrReport, null, 2)}</pre>
                        <button onClick={() => handleRemoveFile(setMtrReport, setMtrReportFileName)}>Remove MTR Report</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadFiles;
