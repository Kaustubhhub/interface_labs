"use client"
import React, { useState } from 'react';

interface TableProps {
    headers: string[];
    data: Array<Array<string | number>>;
}

const TableComponent = ({ headers, data }: TableProps) => {
    // State to manage the checked rows
    const [checkedRows, setCheckedRows] = useState<boolean[]>(new Array(data.length).fill(false));

    // Handle checkbox change
    const handleCheckboxChange = (index: number) => {
        setCheckedRows(prev => {
            const newCheckedRows = [...prev];
            newCheckedRows[index] = !newCheckedRows[index];
            return newCheckedRows;
        });
    };

    return (
        <div className=''>
            <table className="table-auto w-full">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border-b border-gray-300 text-left">
                            <input
                                type="checkbox"
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                checked={checkedRows.every(Boolean)} // Check if all are checked
                                onChange={() => {
                                    const allChecked = checkedRows.every(Boolean);
                                    setCheckedRows(checkedRows.map(() => !allChecked));
                                }}
                            />
                        </th>
                        {headers.map((header, index) => (
                            <th key={index} className="px-4 py-4 border-b border-gray-300 text-left">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            <td className="px-4 py-3 border-b border-gray-300 text-left">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                    checked={checkedRows[rowIndex]}
                                    onChange={() => handleCheckboxChange(rowIndex)}
                                />
                            </td>
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className="px-4 py-2 border-b border-gray-300 text-left">
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TableComponent;
