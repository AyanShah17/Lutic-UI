import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import {site} from "@/lib/seo.mjs";
export const metadata={
 ...(site.origin?{metadataBase:new URL(site.origin)}:{}),
 title:{default:"Lutic | AI Solutions & Agentic Automation",template:"%s | Lutic"},
 description:"Custom AI solutions, agentic automation, integrations and production consulting.",
 applicationName:"Lutic",
 ...(process.env.GOOGLE_SITE_VERIFICATION?{verification:{google:process.env.GOOGLE_SITE_VERIFICATION}}:{}),
 robots:site.indexable?{index:true,follow:true}:{index:false,follow:false}
};
export default function RootLayout({children}){return <html lang="en"><head><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/><link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet"/></head><body><Header/><main id="main-content">{children}</main><Footer/></body></html>;}
