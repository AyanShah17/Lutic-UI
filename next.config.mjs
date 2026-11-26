import {getSiteSettings} from "./lib/seo.mjs";
/** @type {import('next').NextConfig} */
const nextConfig={poweredByHeader:false,async headers(){
 return [
  {source:"/:path*",headers:[{key:"X-Content-Type-Options",value:"nosniff"},{key:"Referrer-Policy",value:"strict-origin-when-cross-origin"}]},
  {source:"/motion-loop.html",headers:[{key:"X-Robots-Tag",value:"noindex, follow"}]},
  {source:"/api/:path*",headers:[{key:"X-Robots-Tag",value:"noindex, nofollow"}]},
  ...(!getSiteSettings(process.env).indexable?[{source:"/:path*",headers:[{key:"X-Robots-Tag",value:"noindex, nofollow"}]}]:[])
 ];
}};
export default nextConfig;
