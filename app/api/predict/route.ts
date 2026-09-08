import {NextResponse} from 'next/server';
import {z} from 'zod';
import {calcRisk} from '../../../lib/data';

const predictionInput=z.object({
  overdue:z.number().min(0),
  approval:z.boolean(),
  compensation:z.boolean(),
  legal:z.number().min(0),
  docs:z.number().min(0),
  families:z.number().min(0),
  land:z.number().min(0)
});

export async function POST(req:Request){
  let body:unknown;
  try{body=await req.json();}catch{return NextResponse.json({error:'Request body must be valid JSON'},{status:400});}
  const parsed=predictionInput.safeParse(body);
  if(!parsed.success)return NextResponse.json({error:'Invalid prediction input',details:parsed.error.flatten()},{status:400});
  return NextResponse.json({data:calcRisk({...parsed.data,risk:0})});
}
