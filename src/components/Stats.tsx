import { Code2, GitFork, Layers3, Star } from 'lucide-react';
import { data } from '../data';
import { stats, formatDate } from '../lib/projects';
export default function Stats() {
  const s=stats(data.repositories);
  const entries=[{label:'Public repositories',value:s.repositories,Icon:Layers3},{label:'Languages in use',value:s.languages,Icon:Code2},{label:'GitHub stars',value:s.stars,Icon:Star},{label:'Public forks',value:s.forks,Icon:GitFork}];
  return <div><div className="stats-grid">{entries.map(({label,value,Icon})=><div className="stat" key={label}><span className="stat-label"><Icon size={16}/>{label}</span><strong>{data.fetchedAt?value:'—'}<span className="stat-period">.</span></strong></div>)}</div><p className="data-caption">GitHub public data <span>·</span> Snapshot {formatDate(data.fetchedAt)}{data.status!=='ok'&&<span> · {data.error||'Some details are unavailable.'}</span>}</p></div>;
}
