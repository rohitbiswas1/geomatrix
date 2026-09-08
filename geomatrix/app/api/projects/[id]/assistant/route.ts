import {NextResponse} from 'next/server';
import {findProject,recommendations} from '../../../../../lib/api';
import {explain,riskLevel} from '../../../../../lib/data';

const assistantInstructions=`You are the Geomatrix Land Acquisition AI decision-support assistant.
Help with land acquisition analysis, project delay analysis, risk assessment, legal and document analysis, compensation and rehabilitation, approvals, parcels, GIS insights, prioritization, recommendations, reports, data interpretation, executive summaries, AI explanations, comparisons, bottlenecks, and corrective actions.
Use only the supplied application data. Never invent statistics, cases, approvals, dates, locations, documents, financial values, or risk scores. If data is missing, say: "Insufficient data to determine this accurately." Label any inference as "Inference based on available data."
Do not claim to be a lawyer or that an action is legally guaranteed. Say further legal review may be required when appropriate. Do not claim to have changed records or performed actions.
Always explain a risk score and recommend practical, specific, prioritized government workflow actions. Keep responses professional, concise, evidence-based, and action-oriented.
For risk questions use: Risk Level, Risk Score, Main Reasons, Critical Bottlenecks, Potential Impact, Recommended Actions, Priority.
For recommendations use: URGENT, HIGH PRIORITY, MEDIUM PRIORITY, NEXT STEP.
Follow: PREDICT -> EXPLAIN -> PRIORITIZE -> ACT.`;

export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const project=findProject(id);
  if(!project)return NextResponse.json({error:'Project not found.'},{status:404});
  const body=await request.json().catch(()=>({}));
  const question=typeof body.question==='string'?body.question.trim():'';
  if(!question)return NextResponse.json({error:'Ask a question about this project.'},{status:400});

  const prediction={riskScore:project.risk,riskLevel:riskLevel(project.risk),delayProbability:project.delay/100,predictedDelayDays:project.delay,confidence:project.confidence};
  const context={project,riskLevel:riskLevel(project.risk),prediction,explanation:explain(project),recommendations:recommendations(id)};
  const apiKey=process.env.GEMINI_API_KEY;
  if(!apiKey)return NextResponse.json({error:'Gemini is not configured. Set GEMINI_API_KEY in .env.local.'},{status:503});

  const response=await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key='+encodeURIComponent(apiKey),{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({system_instruction:{parts:[{text:assistantInstructions}]},contents:[{role:'user',parts:[{text:'Application data:\n'+JSON.stringify(context)+'\n\nUser question:\n'+question}]}],generationConfig:{temperature:0.2,maxOutputTokens:2048}})
  });
  if(!response.ok)return NextResponse.json({error:'The AI service could not answer right now.'},{status:502});
  const result=await response.json();
  const answer=result.candidates?.[0]?.content?.parts?.[0]?.text;
  if(!answer)return NextResponse.json({error:'The AI service returned no answer.'},{status:502});
  return NextResponse.json({answer});
}
