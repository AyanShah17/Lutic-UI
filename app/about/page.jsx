import ContentPage from "@/components/content-page";
import {pageMetadata,site} from "@/lib/seo.mjs";
export const metadata=pageMetadata("about",site);
export default function Page(){return <ContentPage page="about"/>;}
