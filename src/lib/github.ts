const API = 'https://api.github.com';
export class GitHubError extends Error {
  constructor(public status: number, message: string, public resetAt: string | null = null) { super(message); this.name = 'GitHubError'; }
}
export function createGitHubClient(options: { token?: string; fetcher?: typeof fetch; timeoutMs?: number } = {}) {
  const fetcher = options.fetcher || fetch;
  async function request(path: string): Promise<any> {
    for(let attempt=0;attempt<3;attempt++) {
      const response = await fetcher(`${API}${path}`, { headers: { Accept:'application/vnd.github+json', 'X-GitHub-Api-Version':'2022-11-28', ...(options.token ? { Authorization:`Bearer ${options.token}` } : {}) }, signal:AbortSignal.timeout(options.timeoutMs || 15000) });
      if(response.ok) return response.json();
      if(response.status>=500&&attempt<2) { await new Promise(r=>setTimeout(r,250*2**attempt)); continue; }
      if(response.status===403||response.status===429) throw new GitHubError(response.status,'GitHub rate limit or access restriction.',response.headers.get('x-ratelimit-reset'));
      throw new GitHubError(response.status,response.status===404?'GitHub resource not found.':'GitHub request failed.');
    }
    throw new GitHubError(503,'GitHub temporarily unavailable.');
  }
  const repositoryPath = (owner:string,repo:string) => `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
  return {
    request,
    getUser: (user:string) => request(`/users/${encodeURIComponent(user)}`),
    async getRepositories(user:string) {
      const result:any[]=[];
      for(let page=1;page<=100;page++) {
        const batch=await request(`/users/${encodeURIComponent(user)}/repos?type=owner&per_page=100&sort=updated&page=${page}`);
        if(!Array.isArray(batch)) throw new Error('Invalid repository response.');
        result.push(...batch.filter(r=>r.private===false&&r.visibility!=='private'&&r.owner?.login?.toLowerCase()===user.toLowerCase()));
        if(batch.length<100) return result;
      }
      throw new Error('Repository pagination limit reached.');
    },
    getRepository:(owner:string,repo:string)=>request(repositoryPath(owner,repo)),
    getLanguages:(owner:string,repo:string)=>request(`${repositoryPath(owner,repo)}/languages`),
    getReadme:(owner:string,repo:string)=>request(`${repositoryPath(owner,repo)}/readme`),
    getReleases:(owner:string,repo:string)=>request(`${repositoryPath(owner,repo)}/releases?per_page=5`),
    getContributors:(owner:string,repo:string)=>request(`${repositoryPath(owner,repo)}/contributors?per_page=100`),
    getEvents:(user:string)=>request(`/users/${encodeURIComponent(user)}/events/public?per_page=100`),
    getTree:(owner:string,repo:string,branch:string)=>request(`${repositoryPath(owner,repo)}/git/trees/${encodeURIComponent(branch)}?recursive=1`),
    getFile:(owner:string,repo:string,path:string)=>request(`${repositoryPath(owner,repo)}/contents/${path.split('/').map(encodeURIComponent).join('/')}`),
  };
}
