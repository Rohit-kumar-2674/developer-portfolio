import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { PassThrough } from 'node:stream';
import App from '../src/App';
import { data } from '../src/data';
const base=process.env.BASE_PATH||'/';
const site=(process.env.SITE_URL||'https://rohit-kumar-2674.github.io/developer-portfolio').replace(/\/$/,'');
const html=await readFile('dist/index.html','utf8');
const routes=['/','/projects/','/github/','/privacy/',...data.repositories.map(r=>`/projects/${r.name}/`)];
const escape=(s:string)=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
async function render(route:string):Promise<string>{
  return new Promise((resolve,reject)=>{
    const output=new PassThrough();const chunks:Buffer[]=[];
    output.on('data',chunk=>chunks.push(Buffer.from(chunk)));output.on('end',()=>resolve(Buffer.concat(chunks).toString()));output.on('error',reject);
    const stream=renderToPipeableStream(<StaticRouter basename={base} location={`${base.replace(/\/$/,'')}${route}`}><App/></StaticRouter>,{onAllReady(){stream.pipe(output);},onError:reject});
  });
}
for(const route of [...routes,'/404/']){
  const repo=data.repositories.find(r=>route===`/projects/${r.name}/`);
  const title=repo?`${repo.displayName} — Rohit Kumar`:route==='/projects/'?'Projects — Rohit Kumar':route==='/github/'?'GitHub Activity — Rohit Kumar':route==='/privacy/'?'Privacy & Data — Rohit Kumar':route==='/404/'?'Page Not Found — Rohit Kumar':'Rohit Kumar — Developer & Open-source Builder';
  const description=repo?.readmeSummary||repo?.description||'Useful software, intelligent tools, and open-source projects. Explore Rohit Kumar’s public GitHub work, technologies, and development activity.';
  const canonical=`${site}${route}`;
  const structured=repo?{'@context':'https://schema.org','@type':'SoftwareSourceCode',name:repo.displayName,description,codeRepository:repo.url,programmingLanguage:Object.keys(repo.languages),url:canonical,author:{'@type':'Person',name:'Rohit Kumar',url:`${site}/`}}:{'@context':'https://schema.org','@type':'ProfilePage',url:canonical,mainEntity:{'@type':'Person',name:'Rohit Kumar',jobTitle:'Developer and open-source builder',url:`${site}/`,sameAs:[data.user.url],image:`${site}/profile-512.webp`}};
  const preview=repo?.screenshot?`${site}/${repo.screenshot}`:repo?null:`${site}/og-image.png`;
  const seo=`<link rel="canonical" href="${escape(canonical)}"/><meta property="og:type" content="website"/><meta property="og:title" content="${escape(title)}"/><meta property="og:description" content="${escape(description)}"/><meta property="og:url" content="${escape(canonical)}"/><meta name="twitter:card" content="${preview?'summary_large_image':'summary'}"/><meta name="twitter:title" content="${escape(title)}"/><meta name="twitter:description" content="${escape(description)}"/>${preview?`<meta property="og:image" content="${escape(preview)}"/><meta name="twitter:image" content="${escape(preview)}"/>`:''}<script type="application/ld+json">${JSON.stringify(structured).replaceAll('<','\\u003c')}</script>`;
  const page=html.replace(/<title>[^<]*<\/title>/,`<title>${escape(title)}</title>`).replace(/<meta name="description" content="[^"]*"\s*\/?\s*>/,`<meta name="description" content="${escape(description)}"/>`).replace('<!--seo-->',seo).replace('<!--app-->',await render(route));
  const folder=route==='/404/'?'dist':`dist${route}`;await mkdir(folder,{recursive:true});await writeFile(`${folder}/${route==='/404/'?'404.html':'index.html'}`,page);
}
await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(r=>`<url><loc>${escape(site+r)}</loc></url>`).join('')}</urlset>`);
await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\nSitemap: ${site}/sitemap.xml\n`);
await writeFile('dist/.nojekyll','');
await writeFile('dist/manifest.webmanifest',JSON.stringify({name:'Rohit Kumar — Developer Portfolio',short_name:'Rohit / builds',start_url:base,scope:base,display:'standalone',background_color:'#07090d',theme_color:'#07090d',icons:[{src:`${base}favicon.svg`,sizes:'any',type:'image/svg+xml',purpose:'any'}]}));
console.log(`Prerendered ${routes.length} pages and a 404 page. Base path: ${base}`);
