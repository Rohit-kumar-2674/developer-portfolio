import type { Repository, PublicEvent } from '../src/types/github';
import { safeUrl } from '../src/lib/projects';
export const featured: Record<string,{rank:number;name:string;status:string;summary:string}> = {
  'trendforge-ai': {rank:3,name:'TrendForge AI',status:'Research MVP',summary:'An inspectable trend engine with historical analogues, probabilistic forecasts, and a research dashboard. Live forecasting calibration remains experimental.'},
  'socialintel': {rank:2,name:'SocialIntel',status:'Research release',summary:'A public-source research workspace with a Python engine, authenticated API, React dashboard, and traceable evidence. Provider coverage varies.'},
  'termwise-atlas': {rank:1,name:'Termwise Atlas',status:'Open guide',summary:'An independent learning hub for AI coding assistants, with Android-first workflows, terminal guides, provider choices, and reproducible examples.'},
};
export function redact(text:string) {
  return text.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,'[email omitted]').replace(/(?:gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,})/g,'[credential omitted]');
}
export function deriveTechnologies(languages:Record<string,number>, files:string[], manifests:Record<string,string>) {
  const evidence:Record<string,string> = Object.fromEntries(Object.keys(languages).map(l=>[l,'GitHub language statistics']));
  for(const [path,content] of Object.entries(manifests)) {
    if(path.endsWith('package.json')) {
      try {
        const pkg=JSON.parse(content); const deps={...pkg.dependencies,...pkg.devDependencies};
        for(const [key,label] of Object.entries({react:'React',next:'Next.js',vite:'Vite',typescript:'TypeScript',tailwindcss:'Tailwind CSS',prisma:'Prisma','@prisma/client':'Prisma',express:'Express'})) if(key in deps) evidence[label]=path;
        if(pkg.scripts) evidence['Node.js']=path;
      } catch { /* malformed manifest is not evidence */ }
    } else {
      for(const [key,label] of Object.entries({fastapi:'FastAPI',sqlalchemy:'SQLAlchemy',pydantic:'Pydantic',pytest:'pytest',pandas:'pandas',numpy:'NumPy',scikit:'scikit-learn'})) if(content.toLowerCase().includes(key)) evidence[label]=path;
    }
  }
  if(files.some(f=>f.startsWith('.github/workflows/'))) evidence['GitHub Actions']='.github/workflows/';
  if(files.some(f=>/(^|\/)Dockerfile$|docker-compose\.yml$/.test(f))) evidence.Docker='Docker configuration';
  return { technologies:Object.keys(evidence),evidence };
}
export function normalizeRepository(raw:any,extra:{languages?:Record<string,number>;readme?:string|null;releases?:any[];files?:string[];manifests?:Record<string,string>;warnings?:string[];demoUrl?:string|null;demoCheckedAt?:string|null}={}):Repository {
  if(raw.private!==false||raw.visibility==='private') throw new Error('Private repositories are never eligible.');
  const f=featured[raw.name]; const languages=extra.languages||{}; const files=extra.files||[];
  const readme=extra.readme ? redact(extra.readme) : null;
  const text=[raw.name,raw.description,...(raw.topics||[])].join(' ').toLowerCase();
  const categories:string[]=[];
  if(/\bai\b|llm|coding assistant/.test(text)) categories.push('AI');
  if(/trend|analytics|forecast/.test(text)) categories.push('Analytics','Data');
  if(/social|public.source|profile/.test(text)) categories.push('Social');
  if(/tool|terminal|scan|security|repository|access.control|guide/.test(text)) categories.push('Developer Tools');
  if(/automation|workflow/.test(text)) categories.push('Automation');
  const tech=deriveTechnologies(languages,files,extra.manifests||{});
  if(tech.technologies.some(t=>['React','HTML','Next.js'].includes(t))) categories.push('Web');
  if(/experiment|research/.test(text)||f?.status.includes('Research')) categories.push('Experimental');
  if(!categories.length) categories.push('Other');
  const screenshots:Record<string,[string,string]>={
    'trendforge-ai':['projects/trendforge-ai.webp','Repository screenshot · synthetic demo data'],
    'termwise-atlas':['projects/termwise-atlas.webp','Repository screenshot · documentation home'],
  };
  return {
    id:raw.id,name:raw.name,fullName:raw.full_name,description:raw.description?redact(raw.description):null,url:raw.html_url,
    homepage:safeUrl(raw.homepage),demoUrl:extra.demoUrl||null,demoCheckedAt:extra.demoCheckedAt||null,
    language:raw.language,languages,...tech,categories:[...new Set(categories)],
    stars:raw.stargazers_count||0,forks:raw.forks_count||0,watchers:raw.subscribers_count??null,openIssues:raw.open_issues_count||0,
    topics:raw.topics||[],license:raw.license?.spdx_id==='NOASSERTION'?null:raw.license?.spdx_id||null,
    createdAt:raw.created_at,updatedAt:raw.updated_at,pushedAt:raw.pushed_at,size:raw.size||0,defaultBranch:raw.default_branch,
    archived:Boolean(raw.archived),fork:Boolean(raw.fork),readme,readmeUrl:`${raw.html_url}#readme`,readmeSummary:f?.summary||null,
    releases:(extra.releases||[]).filter(r=>!r.draft).map(r=>({name:r.name||r.tag_name,tag:r.tag_name,url:r.html_url,publishedAt:r.published_at,prerelease:r.prerelease})),
    files,evidence:tech.evidence,screenshot:screenshots[raw.name]?.[0]||null,screenshotCaption:screenshots[raw.name]?.[1]||null,
    featured:raw.archived?0:f?.rank||0,displayName:f?.name||raw.name,status:raw.archived?'Archived':f?.status||'Public repository',dataWarnings:extra.warnings||[],
  };
}
export function normalizeEvents(events:any[],eligible:Set<string>):PublicEvent[] {
  const labels:Record<string,string>={PushEvent:'Pushed changes',CreateEvent:'Created a repository or branch',ReleaseEvent:'Published a release',PullRequestEvent:'Updated a pull request',IssuesEvent:'Updated an issue',WatchEvent:'Starred a repository',ForkEvent:'Forked a repository'};
  return events.filter(e=>e.public===true&&eligible.has(e.repo?.name)&&labels[e.type]).map(e=>({id:e.id,type:e.type,repository:e.repo.name,createdAt:e.created_at,url:`https://github.com/${e.repo.name}`,label:labels[e.type]}));
}
