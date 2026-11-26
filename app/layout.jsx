import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
export const metadata={title:{default:"Lutic | AI studio",template:"%s | Lutic"},description:"AI solutions, agentic automation, integrations and production consulting.",applicationName:"Lutic",icons:{icon:"/icon.svg"}};
export default function RootLayout({children}){return <html lang="en"><head><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/><link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet"/></head><body><Header/><main id="main-content">{children}</main><Footer/></body></html>;}
