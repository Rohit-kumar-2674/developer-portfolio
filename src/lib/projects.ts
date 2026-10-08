import type { Repository } from '../types/github';
export const USERNAME = 'Rohit-kumar-2674';
export const PROFILE_URL = `https://github.com/${USERNAME}`;
export const SOURCE_URL = `${PROFILE_URL}/developer-portfolio`;
export const SITE_URL = 'https://rohit-kumar-2674.github.io/developer-portfolio';
export const asset = (path: string) => `${import.meta.env?.BASE_URL || (typeof process !== 'undefined' ? process.env.BASE_PATH : null) || '/'}${path.replace(/^\//, '')}`;
export function safeUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try { const u = new URL(value); return u.protocol === 'https:' && !u.username && !u.password ? u.href : null; } catch { return null; }
}
export const formatDate = (value: string | null) => value ? new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(value)) : 'Unavailable';
export const languageColors: Record<string, string> = { Python:'#6da9ff', TypeScript:'#9b8cff', JavaScript:'#f5cf69', CSS:'#dc90d4', HTML:'#f39179', Shell:'#80c9ad', Dockerfile:'#89b4c7' };
export function stats(repositories: Repository[]) {
  return { repositories: repositories.length, stars: repositories.reduce((n,r)=>n+r.stars,0), forks: repositories.reduce((n,r)=>n+r.forks,0), languages: new Set(repositories.flatMap(r=>Object.keys(r.languages))).size, licensed: repositories.filter(r=>r.license).length };
}
export function languageTotals(repositories: Repository[]) {
  const totals: Record<string,number> = {};
  for(const r of repositories) for(const [l,n] of Object.entries(r.languages)) totals[l]=(totals[l]||0)+n;
  return Object.entries(totals).sort((a,b)=>b[1]-a[1]);
}
export function matches(r:Repository, query:string) {
  return [r.name,r.description,r.displayName,...r.technologies,...Object.keys(r.languages),...r.topics,...r.categories].join(' ').toLowerCase().includes(query.trim().toLowerCase());
}
export function filterProjects(repositories:Repository[], query='', category='All', tech='All', sort='featured') {
  return repositories.filter(r=>matches(r,query)&&(category==='All'||r.categories.includes(category))&&(tech==='All'||r.technologies.includes(tech)||Object.hasOwn(r.languages,tech))).sort((a,b)=> {
    if(sort==='name') return a.name.localeCompare(b.name);
    if(sort==='stars') return b.stars-a.stars||a.name.localeCompare(b.name);
    if(sort==='technology') return (a.language||'').localeCompare(b.language||'')||a.name.localeCompare(b.name);
    if(sort==='category') return (a.categories[0]||'').localeCompare(b.categories[0]||'')||a.name.localeCompare(b.name);
    if(sort==='featured'&&a.featured!==b.featured) return (b.featured||-1)-(a.featured||-1);
    return Date.parse(b.updatedAt)-Date.parse(a.updatedAt);
  });
}
