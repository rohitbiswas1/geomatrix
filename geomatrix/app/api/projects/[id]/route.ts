import {NextResponse} from 'next/server';
import {findProject} from '../../../../lib/api';

export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){
  const project=findProject((await params).id);
  return project?NextResponse.json({data:project}):NextResponse.json({error:'Project not found.'},{status:404});
}
export async function PUT(req:Request,{params}:{params:Promise<{id:string}>}){
  const id=(await params).id;
  if(!findProject(id))return NextResponse.json({error:'Project not found.'},{status:404});
  const changes=await req.json().catch(()=>null);
  if(!changes||typeof changes!=='object'||Array.isArray(changes))return NextResponse.json({error:'Provide a JSON object of changes.'},{status:400});
  return NextResponse.json({message:'Updated in prototype mode',id,changes});
}
