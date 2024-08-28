import prisma from "@/db";
import { NextResponse } from "next/server";

// In-memory cache
let cache: { mtrData?: any; paymentData?: any } = {};

export async function GET() {
    try {
        // Check if data is in cache
        if (cache.mtrData && cache.paymentData) {
            return NextResponse.json({
                mtrData: cache.mtrData,
                paymentData: cache.paymentData,
            });
        }

        // Fetch all entries from both tables
        const mtrData = await prisma.mtr.findMany();
        const paymentData = await prisma.payment.findMany();

        // Cache the results
        cache = { mtrData, paymentData };

        // Return the results as JSON
        return NextResponse.json({
            mtrData,
            paymentData
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json(
            { error: 'An error occurred while fetching data.' },
            { status: 500 }
        );
    }
}
