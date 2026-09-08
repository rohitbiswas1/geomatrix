import {NextResponse} from 'next/server';
import {z} from 'zod';
import {alerts} from '../../../../../lib/data';

const bodySchema=z.object({status:z.enum(['Acknowledged','Resolved'])});

export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){
  const id=(await params).id;
  if(!alerts.some(alert=>alert.id===id))return NextResponse.json({error:'Alert not found.'},{status:404});
  const body=bodySchema.safeParse(await request.json().catch(()=>null));
  if(!body.success)return NextResponse.json({error:'Status must be Acknowledged or Resolved.'},{status:400});
  return NextResponse.json({id,status:body.data.status,timestamp:new Date().toISOString()});
}
