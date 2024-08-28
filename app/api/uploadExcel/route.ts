import prisma from '@/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { paymentData, mtrData } = body;

        console.log('Received paymentData:', paymentData[0]);
        console.log('Received mtrData:', mtrData[0]);

        // Validate and log each data item
        if (!Array.isArray(paymentData) || !Array.isArray(mtrData)) {
            throw new Error('Invalid data format: paymentData and mtrData should be arrays');
        }

        // Create MTR records
        await prisma.mtr.createMany({
            data: mtrData,
            skipDuplicates: true, // Remove if not supported by your Prisma version
        });

        // Create Payment records
        await prisma.payment.createMany({
            data: paymentData,
        });

        return NextResponse.json({ message: "Database updated successfully" });
    } catch (error) {
        console.error('Error processing request:', error);
        console.error('Full error details:', error);
        return NextResponse.json({ error: 'An error occurred while processing the request.' }, { status: 500 });
    }
}
