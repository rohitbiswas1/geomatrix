import './globals.css';
import {Shell} from '../components/Shell';
import {ProjectAssistant} from '../components/ProjectAssistant';
import {AuthProvider} from '../components/AuthProvider';
import {ThemeProvider} from '../components/ThemeProvider';
export const metadata={title:'Geomatrix | Land Acquisition AI',description:'Predictive Intelligence for Smarter Infrastructure'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:`try{const t=localStorage.getItem('geomatrix_theme')||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){}`}} /></head><body><ThemeProvider><AuthProvider><Shell>{children}</Shell><ProjectAssistant/></AuthProvider></ThemeProvider></body></html>}
