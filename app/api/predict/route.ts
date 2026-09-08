import {NextResponse} from 'next/server';import {calcRisk} from '../../../lib/data';export async function POST(req:Request){return NextResponse.json({data:calcRisk({...await req.json(),risk:0})})}
