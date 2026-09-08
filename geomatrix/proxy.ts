import {NextResponse} from 'next/server';
import {auth} from './auth';

export default auth(request=>{
  const pathname=request.nextUrl.pathname;
  if(!request.auth?.user)return NextResponse.redirect(new URL('/login',request.url));
  if(pathname.startsWith('/admin')&&request.auth.user.role!=='ADMIN')return NextResponse.redirect(new URL('/dashboard?error=forbidden',request.url));
  return NextResponse.next();
});

export const config={matcher:['/dashboard/:path*','/projects/:path*','/map/:path*','/alerts/:path*','/analytics/:path*','/reports/:path*','/data/:path*','/settings/:path*','/admin/:path*','/api/projects/:path*','/api/alerts/:path*','/api/analytics/:path*','/api/reports/:path*','/api/predict/:path*','/api/documents/:path*','/api/map/:path*']};
