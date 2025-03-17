import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Get the current count from the request body
  const { count } = await request.json();
  
  // Simulate some server-side processing
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Increment the count
  const newCount = count + 1;
  
  // Return the new count
  return NextResponse.json({ newCount });
}