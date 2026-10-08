import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createGitHubClient, GitHubError } from '../src/lib/github';
import { normalizeRepository, normalizeEvents } from './normalize';
import { safeUrl, USERNAME } from '../src/lib/projects';
import type { GitHubData, Repository } from '../src/types/github';

const user = process.env.GITHUB_USERNAME || USERNAME;
const api = createGitHubClient({ token: process.env.GITHUB_TOKEN });
const output = new URL('../src/data/github.generated.json', import.meta.url);
const now = new Date().toISOString();
let previous: GitHubData | null = null;
try { previous = JSON.parse(await readFile(output, 'utf8')); } catch { /* first sync */ }

async function optional<T>(run: () => Promise<T>, fallback: T, warnings: string[], label: string): Promise<T> {
  try { return await run(); } catch(e) { if(!(e instanceof GitHubError && e.status === 404)) warnings.push(`${label} unavailable`); return fallback; }
}
async function collect(raw: any): Promise<Repository> {
  const warnings: string[] = [];
  const name = raw.name;
  const full = await optional(()=>api.getRepository(user,name),raw,warnings,'Watchers');
  // Re-check visibility because it may have changed since listing.
  if(full.private !== false) throw new Error('Repository visibility changed.');
  const languages = await optional(()=>api.getLanguages(user,name),{},warnings,'Languages');
  const readmeFile = await optional(()=>api.getReadme(user,name),null,warnings,'README');
  const releases = await optional(()=>api.getReleases(user,name),[],warnings,'Releases');
  const tree = await optional(()=>api.getTree(user,name,raw.default_branch),{tree:[]},warnings,'Source tree');
  const files: string[] = tree.tree.filter((x:any)=>x.type==='blob').map((x:any)=>x.path);
  const manifests: Record<string,string> = {};
  const candidates = files.filter(p=>['package.json','frontend/package.json','backend/package.json','pyproject.toml','backend/pyproject.toml','requirements.txt'].includes(p));
  for(const path of candidates) {
    const file = await optional(()=>api.getFile(user,name,path),null,warnings,`Manifest ${path}`);
    if(file?.content) manifests[path]=Buffer.from(file.content,'base64').toString('utf8');
  }
  const readme = readmeFile?.content ? Buffer.from(readmeFile.content,'base64').toString('utf8') : null;
  // Only probe an owner-controlled Pages URL, never an arbitrary repository URL.
  const pagesOrigin = `https://${user.toLowerCase()}.github.io/`;
  const linkedPages = readme?.match(new RegExp(`https://${user.toLowerCase()}\\.github\\.io/[^\\s)"<>]+`,'i'))?.[0];
  const candidate = safeUrl(raw.homepage) || safeUrl(linkedPages);
  let demoUrl:string|null=null;
  if(candidate?.startsWith(pagesOrigin)) {
    try { const res = await fetch(candidate,{method:'HEAD',redirect:'manual',signal:AbortSignal.timeout(10000)}); if(res.ok) demoUrl=candidate; } catch { /* no unverified live demo */ }
  }
  const repo=normalizeRepository(full,{languages,readme,releases,files,manifests,warnings,demoUrl,demoCheckedAt:demoUrl?now:null});
  if(repo.screenshot) {
    try { await readFile(new URL(`../public/${repo.screenshot}`,import.meta.url)); } catch { repo.screenshot=null;repo.screenshotCaption=null; }
  }
  return repo;
}

let next:GitHubData;
try {
  const publicRepos = await api.getRepositories(user);
  const repositories:Repository[]=[];
  for(const raw of publicRepos) repositories.push(await collect(raw));
  const eventWarnings:string[]=[];
  const events=await optional(()=>api.getEvents(user),[],eventWarnings,'Activity');
  next={schemaVersion:1,fetchedAt:now,lastAttemptAt:now,status:repositories.some(r=>r.dataWarnings.length)||eventWarnings.length?'partial':'ok',error:null,user:{login:user,name:'Rohit Kumar',url:`https://github.com/${user}`},repositories,events:normalizeEvents(events,new Set(repositories.map(r=>r.fullName))),eventsAvailable:!eventWarnings.length};
} catch {
  next=previous ? {...previous,status:'unavailable',error:'GitHub data temporarily unavailable.',lastAttemptAt:now} : {schemaVersion:1,fetchedAt:null,lastAttemptAt:now,status:'unavailable',error:'GitHub data temporarily unavailable.',user:{login:user,name:'Rohit Kumar',url:`https://github.com/${user}`},repositories:[],events:[],eventsAvailable:false};
  console.warn('GitHub sync unavailable. Keeping the dated public snapshot when one exists.');
}
await mkdir(new URL('../src/data/',import.meta.url),{recursive:true});
await writeFile(output,JSON.stringify(next,null,2)+'\n');
console.log(`Synced ${next.repositories.length} public repositories; status: ${next.status}.`);
