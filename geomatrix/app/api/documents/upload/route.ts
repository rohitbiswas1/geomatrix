import {NextResponse} from 'next/server';

const allowedExtensions=new Set(['csv','xlsx','geojson','json','pdf']);
const maxFileSize=10*1024*1024;

export async function POST(req:Request){
  const fd=await req.formData().catch(()=>null);
  const file=fd?.get('file');
  if(!(file instanceof File))return NextResponse.json({error:'Attach a file in the file field.'},{status:400});
  const extension=file.name.split('.').pop()?.toLowerCase();
  if(!extension||!allowedExtensions.has(extension))return NextResponse.json({error:'Only CSV, XLSX, GeoJSON, JSON, and PDF files are supported.'},{status:415});
  if(file.size===0||file.size>maxFileSize)return NextResponse.json({error:'Files must be between 1 byte and 10 MB.'},{status:413});
  return NextResponse.json({mode:'mock',message:'Document accepted for simulated OCR/NLP extraction',fileName:file.name,extracted:{documentType:'Compensation Document',projectId:'NH-112-MAL-01',riskIndicators:['pending verification','signature review']}});
}
