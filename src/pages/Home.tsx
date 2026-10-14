import Github from '../components/Github';
import { Link } from 'react-router-dom';
import { Braces, GitBranch, Code2, Layers3, BookOpen, Fingerprint, ExternalLink } from 'lucide-react';
import { data } from '../data';
import { asset, PROFILE_URL, filterProjects, formatDate } from '../lib/projects';
import { ProjectCard } from '../components/ProjectCard';
import Stats from '../components/Stats';
import LanguageChart from '../components/LanguageChart';
import Terminal from '../components/Terminal';
import CurrentProject from '../components/CurrentProject';
export function Skills() {
  const evidence=new Map<string,string[]>();
  for(const r of data.repositories) for(const t of r.technologies) evidence.set(t,[...(evidence.get(t)||[]),r.name]);
  const groups=[{name:'Interfaces',items:['React','TypeScript','JavaScript','HTML','CSS','Tailwind CSS','Vite','Next.js']},{name:'Systems & data',items:['Python','FastAPI','SQLAlchemy','Pydantic','pandas','NumPy','scikit-learn','Node.js']},{name:'Shipping & quality',items:['Docker','GitHub Actions','Shell','pytest','Prisma']}];
  return <section className="section" id="skills"><div className="section-heading"><div><p className="eyebrow">02 / TOOLKIT</p><h2>The tools behind the work.</h2></div><p>Technologies used in public projects.<br/>Every tag has a source.</p></div><div className="skills-grid">{groups.map((g,i)=><div className="skill-group" key={g.name}><span className="number">0{i+1}</span><h3>{g.name}</h3><div className="skill-tags">{g.items.filter(t=>evidence.has(t)).map(t=><Link to={`/projects/?tech=${encodeURIComponent(t)}`} key={t} title={`Used in ${evidence.get(t)!.join(', ')}`}>{t}<span>{evidence.get(t)!.length}</span></Link>)}</div></div>)}</div><p className="data-caption">Derived from language statistics, dependency manifests, and workflow files. No proficiency ratings.</p></section>;
}
export function Philosophy() {
  const items=[{Icon:Fingerprint,title:'Start with a real problem.',text:'Build around a useful outcome. Keep the purpose clear before reaching for the next tool.'},{Icon:Layers3,title:'Make the system understandable.',text:'Choose modular architecture, visible data sources, and features that explain their limits.'},{Icon:BookOpen,title:'Leave a useful trail.',text:'Document setup, decisions, and trade-offs so the next person can reproduce the work.'},{Icon:GitBranch,title:'Keep improving in the open.',text:'Ship a working foundation, test what matters, and let each iteration earn its place.'}];
  return <section className="section" id="about"><div className="section-heading"><div><p className="eyebrow">04 / APPROACH</p><h2>How I build.</h2></div><p>Ambitious ideas. Practical foundations.<br/>A work in progress, made public.</p></div><div className="philosophy-grid">{items.map(({Icon,title,text},i)=><article key={title}><div className="philosophy-top"><Icon size={22}/><span>0{i+1}</span></div><h3>{title}</h3><p>{text}</p></article>)}</div></section>;
}
export function Contact() { return <section className="contact-section" id="contact"><div><p className="eyebrow">LET’S BUILD SOMETHING USEFUL</p><h2>Good work starts<br/>with a conversation.</h2><p>Explore the code, open an issue, or connect on GitHub.</p></div><a className="button primary" href={PROFILE_URL} target="_blank" rel="noreferrer"><Github size={19}/>Connect on GitHub<ExternalLink size={15}/></a></section>; }
export default function Home() {
  const featured=filterProjects(data.repositories).filter(r=>r.featured).slice(0,3);
  const recent=[...data.repositories].sort((a,b)=>Date.parse(b.pushedAt)-Date.parse(a.pushedAt)).slice(0,3);
  return <>
    <section className="hero"><div className="hero-copy"><p className="eyebrow"><span className="small-line"/>DEVELOPER · OPEN-SOURCE BUILDER</p><h1>Ideas into software.<br/><span>Built in the open.</span></h1><p className="hero-intro">I’m <strong>Rohit Kumar.</strong> I build useful web applications, intelligent tools, and ambitious open-source projects.</p><p className="hero-detail">From the first experiment to a working system — with a focus on functionality, transparency, and thoughtful design.</p><div className="hero-buttons"><Link className="button primary" to="/projects/"><Code2 size={18}/>Explore projects</Link><a className="button secondary" href={PROFILE_URL} target="_blank" rel="noreferrer"><Github size={19}/>View GitHub</a></div><div className="hero-tags"><span>FULL STACK</span><span>AI & AUTOMATION</span><span>BUILDING IN PUBLIC</span></div></div>
    <div className="portrait-stage"><div className="portrait-grid" aria-hidden="true"/><span className="portrait-code" aria-hidden="true">{'{ build, learn, repeat }'}</span><div className="portrait-frame"><img src={asset('profile-512.webp')} srcSet={`${asset('profile-256.webp')} 256w, ${asset('profile-512.webp')} 512w, ${asset('profile.webp')} 1200w`} sizes="(max-width: 700px) 220px, 360px" width="512" height="512" fetchPriority="high" alt="Rohit Kumar, developer and open-source builder"/></div><div className="portrait-caption"><span className="avatar-mark"><Braces size={21}/></span><div><strong>Rohit Kumar</strong><span>@Rohit-kumar-2674</span></div><GitBranch size={22}/></div><span className="portrait-index" aria-hidden="true">01 — ALWAYS BUILDING</span></div></section>
    <CurrentProject/>
    <Stats/>
    <section className="section" id="featured"><div className="section-heading"><div><p className="eyebrow">01 / SELECTED WORK</p><h2>A few things I’ve built.</h2></div><Link className="button secondary small" to="/projects/">All projects <span className="count-pill">{data.repositories.length}</span></Link></div><div className="featured-grid">{featured.map(r=><ProjectCard key={r.id} repo={r} featured/>)}</div>{featured.length===0&&<p className="empty-state">GitHub data temporarily unavailable.</p>}</section>
    <Skills/>
    <section className="section" id="activity"><div className="section-heading"><div><p className="eyebrow">03 / IN THE OPEN</p><h2>The code tells the story.</h2></div><Link className="text-link" to="/github/">Explore GitHub activity</Link></div><div className="github-home-grid"><div className="panel"><h3>Languages across my work</h3><LanguageChart/></div><div className="panel"><div className="panel-heading"><h3>Recently pushed</h3><GitBranch size={18}/></div><div className="recent-list">{recent.map(r=><Link to={`/projects/${r.name}/`} key={r.id}><span className="timeline-node"/><span><strong>{r.displayName}</strong><small>{r.language} <span>·</span> {formatDate(r.pushedAt)}</small></span><Code2 size={18}/></Link>)}</div><p className="data-caption">Repository push dates from GitHub’s public API.</p></div></div></section>
    <Philosophy/>
    <div className="terminal-section"><div><p className="eyebrow">A SMALL SHORTCUT</p><h2>At home in the terminal.</h2><p>Try <code>help</code>, <code>projects</code>, or <code>skills</code>.</p></div><Terminal/></div>
    <Contact/>
  </>;
}
