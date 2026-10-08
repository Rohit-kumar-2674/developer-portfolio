import Github from '../components/Github';
import { Link } from 'react-router-dom';
import { Activity, BookOpen, Code2, Copy, ExternalLink, GitFork, Radio, Shield, Star, Check } from 'lucide-react';
import { useState } from 'react';
import type { Repository } from '../types/github';
import { asset, formatDate, languageColors } from '../lib/projects';
export function ProjectIcon({name,size=24}:{name:string;size?:number}) {
  const Icon = name.includes('trend')?Activity:name.includes('atlas')?BookOpen:name.includes('social')?Radio:name.includes('guard')||name.includes('breach')?Shield:Code2;
  return <Icon size={size} aria-hidden="true"/>;
}
export function CopyButton({url}:{url:string}) {
  const [state,setState]=useState('Copy URL');
  async function copy() { try { await navigator.clipboard.writeText(url); setState('Copied'); } catch { setState('Copy unavailable'); } }
  return <button className="icon-button" onClick={copy} title={state} aria-label={state}>{state==='Copied'?<Check size={16}/>:<Copy size={16}/>}<span className="sr-only" role="status">{state==='Copy URL'?'':state}</span></button>;
}
export function ProjectCard({repo,compact=false,featured=false}:{repo:Repository;compact?:boolean;featured?:boolean}) {
  return <article className={`project-card ${compact?'compact':''} ${featured?'featured':''}`}>
    {featured&&repo.screenshot&&<Link tabIndex={-1} aria-hidden="true" to={`/projects/${repo.name}/`} className="project-image"><img src={asset(repo.screenshot)} alt="" loading="lazy" width="960" height="600"/><span>{repo.screenshotCaption}</span></Link>}
    <div className="project-body"><div className="project-top"><span className={`project-symbol symbol-${repo.name}`}><ProjectIcon name={repo.name}/></span><span className="tag subtle">{repo.archived?'Archived':repo.status}</span><CopyButton url={repo.url}/></div>
      <div className="project-title-row"><h3><Link to={`/projects/${repo.name}/`}>{repo.displayName}</Link></h3>{repo.fork&&<span className="tag">Fork</span>}</div>
      <p className="project-description">{repo.readmeSummary||repo.description||'Explore the source code and documentation for this public repository.'}</p>
      <div className="tags">{repo.technologies.slice(0,4).map(t=><span className="tag" key={t}>{t}</span>)}</div>
      <div className="project-meta"><span><span className="language-dot" style={{background:languageColors[repo.language||'']||'#94a3b8'}}/>{repo.language||'Unspecified'}</span><span title="Stars"><Star size={14}/>{repo.stars}</span><span title="Forks"><GitFork size={14}/>{repo.forks}</span><span className="updated">{formatDate(repo.updatedAt)}</span></div>
      <div className="project-actions"><Link className="text-link" to={`/projects/${repo.name}/`}>View project</Link><a href={repo.url} target="_blank" rel="noreferrer" aria-label={`Source code for ${repo.displayName}`}><Github size={16}/> Source</a>{repo.demoUrl&&<a href={repo.demoUrl} target="_blank" rel="noreferrer">Live demo <ExternalLink size={14}/></a>}</div>
    </div>
  </article>;
}
