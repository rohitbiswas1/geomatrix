import {projects,calcRisk} from './data';

export function findProject(id:string){return projects.find(p=>p.id===id)}
export function getProject(id:string){return findProject(id)||projects[0]}

export function predict(id:string){
  const p=findProject(id);
  if(!p)return null;
  return {...calcRisk(p),confidence:p.confidence,stageRisk:{Notification:18,Hearing:43,Compensation:92,Award:76,Possession:58,RandR:62,Legal:71}};
}

export function recommendations(id:string){
  return [{title:'Resolve pending compensation claims',priority:'Critical',impact:'Very High',owner:'District Land Acquisition Officer',expected:'Reduce delay probability by 18–24%'},{title:'Escalate unresolved legal cases',priority:'High',impact:'High',owner:'Legal Cell',expected:'Reduce exposure by 8–14 days'},{title:'Complete missing land documents',priority:'Medium',impact:'Moderate',owner:'Records & Verification Team',expected:'Improve confidence and stage throughput'}];
}
