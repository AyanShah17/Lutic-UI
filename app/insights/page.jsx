import ContentPage from "@/components/content-page";
import {pageMetadata,site} from "@/lib/seo.mjs";
export const metadata=pageMetadata("insights",site);
export default function Page(){return <ContentPage page="insights"/>;}
