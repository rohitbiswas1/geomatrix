import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import {prisma} from './lib/prisma';

const adminEmails=new Set((process.env.ADMIN_EMAILS||'').split(',').map(email=>email.trim().toLowerCase()).filter(Boolean));
const demoMode=process.env.DEMO_MODE==='true';
const googleConfigured=Boolean(process.env.GOOGLE_CLIENT_ID&&process.env.GOOGLE_CLIENT_SECRET);
const authSecret=process.env.AUTH_SECRET||(demoMode?'geomatrix-local-demo-secret-change-before-production':undefined);
const demoUsers={
  'admin@geomatrix.gov.in':{password:'Admin@123',name:'Demo Administrator',role:'ADMIN'},
  'officer@geomatrix.gov.in':{password:'Officer@123',name:'Demo Project Officer',role:'VIEWER'},
  'policymaker@geomatrix.gov.in':{password:'Policy@123',name:'Demo Policy Maker',role:'VIEWER'},
} as const;

async function getStoredUser(email:string){
  if(!process.env.DATABASE_URL)return null;
  try{return await prisma.user.findUnique({where:{email}})}catch{return null}
}

export const {handlers,auth,signIn,signOut}=NextAuth({
  trustHost:true,
  secret:authSecret,
  pages:{signIn:'/login'},
  providers:[
    ...(googleConfigured?[Google({clientId:process.env.GOOGLE_CLIENT_ID!,clientSecret:process.env.GOOGLE_CLIENT_SECRET!})]:[]),
    ...(demoMode?[Credentials({
      name:'Demo account',
      credentials:{email:{label:'Email',type:'email'},password:{label:'Password',type:'password'}},
      async authorize(credentials){
        const email=typeof credentials?.email==='string'?credentials.email.trim().toLowerCase():'';
        const password=typeof credentials?.password==='string'?credentials.password:'';
        const user=demoUsers[email as keyof typeof demoUsers];
        return user&&password===user.password?{id:'demo-'+email,email,name:user.name}:null;
      },
    })]:[]),
  ],
  session:{strategy:'jwt'},
  callbacks:{
    async signIn({user}){
      if(!user.email)return false;
      if(process.env.DATABASE_URL){
        try{
          const role=adminEmails.has(user.email.toLowerCase())?'ADMIN':'VIEWER';
          await prisma.user.upsert({where:{email:user.email},update:{name:user.name||user.email},create:{email:user.email,name:user.name||user.email,role}});
        }catch(error){console.error('Unable to sync authenticated user',error)}
      }
      return true;
    },
    async jwt({token,user}){
      const email=user?.email||token.email;
      if(email){
        const stored=await getStoredUser(email);
        const demoUser=demoMode?demoUsers[email.toLowerCase() as keyof typeof demoUsers]:undefined;
        token.role=stored?.role||demoUser?.role||(adminEmails.has(email.toLowerCase())?'ADMIN':token.role||'VIEWER');
        token.userId=stored?.id||token.userId;
        token.picture=user?.image||token.picture;
      }
      return token;
    },
    async session({session,token}){
      if(session.user){
        session.user.id=String(token.userId||'');
        session.user.role=String(token.role||'VIEWER');
        session.user.image=token.picture||session.user.image;
      }
      return session;
    },
  },
});
