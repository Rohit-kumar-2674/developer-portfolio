import Github from '../components/Github';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Command, Sun, House, Code2, GitBranch } from 'lucide-react';
import { data } from '../data';
import { matches, PROFILE_URL } from '../lib/projects';
export default function CommandPalette({open,onClose,onTheme}:{open:boolean;onClose:()=>void;onTheme:()=>void}) {
  const dialog=useRef<HTMLDialogElement>(null),input=useRef<HTMLInputElement>(null);const [query,setQuery]=useState('');const navigate=useNavigate();
  useEffect(()=>{if(open){dialog.current?.showModal();input.current?.focus();}else dialog.current?.close();},[open]);
  const go=(path:string)=>{navigate(path);onClose();};
  const actions=[{name:'Search projects',Icon:Search,run:()=>go('/projects/')},{name:'Open GitHub',Icon:Github,run:()=>{window.open(PROFILE_URL,'_blank','noopener,noreferrer');onClose();}},{name:'View recent work',Icon:GitBranch,run:()=>go('/github/#activity')},{name:'View skills',Icon:Code2,run:()=>go('/#skills')},{name:'Toggle theme',Icon:Sun,run:()=>{onTheme();onClose();}},{name:'Go home',Icon:House,run:()=>go('/')}].filter(a=>a.name.toLowerCase().includes(query.toLowerCase()));
  const projects=data.repositories.filter(r=>matches(r,query));
  return <dialog ref={dialog} className="command-dialog" aria-label="Search projects and commands" onCancel={onClose} onClick={e=>{if(e.target===e.currentTarget)onClose();}}><div className="command-search"><Search size={22}/><input ref={input} aria-label="Search projects and commands" placeholder="Search projects or run a command…" value={query} onChange={e=>setQuery(e.target.value)}/><button className="icon-button" onClick={onClose} aria-label="Close command palette"><X size={19}/></button></div><div className="command-results">{actions.length>0&&<><p className="eyebrow">NAVIGATE</p>{actions.map(a=><button key={a.name} onClick={a.run}><a.Icon size={17}/>{a.name}<Command size={13}/></button>)}</>}{projects.length>0&&<><p className="eyebrow">PROJECTS</p>{projects.map(r=><button key={r.id} onClick={()=>go(`/projects/${r.name}/`)}><Code2 size={17}/><span>{r.displayName}</span><small>{r.language}</small></button>)}</>}{!actions.length&&!projects.length&&<p className="empty-note">No results. Try a project name or technology.</p>}</div><div className="command-footer"><span>Tab to navigate · Enter to select</span><span>Esc to close</span></div></dialog>;
}
