import {NextResponse} from 'next/server';
import {z} from 'zod';
import {calcRisk} from '../../../lib/data';

const predictionInput=z.object({
  overdue:z.number().finite().min(0).max(3650),
  approval:z.boolean(),
  compensation:z.boolean(),
  legal:z.number().int().min(0).max(10000),
  docs:z.number().finite().min(0).max(100),
  families:z.number().int().min(0).max(10000000),
  land:z.number().finite().min(0).max(10000000),
});

export async function POST(req:Request){
  const parsed=predictionInput.safeParse(await req.json().catch(()=>null));
  if(!parsed.success)return NextResponse.json({error:'Provide valid prediction inputs.',details:parsed.error.flatten().fieldErrors},{status:400});
  return NextResponse.json({data:calcRisk({...parsed.data,risk:0})});
}
