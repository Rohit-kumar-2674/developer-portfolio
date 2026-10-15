import { Layers3 } from 'lucide-react';

export default function CurrentProject() {
  return (
    <section className="section current-project" aria-labelledby="current-project-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">BUILDING NOW</p>
          <h2 id="current-project-title">OmniForge AI</h2>
        </div>
        <span className="current-project-status">In development</span>
      </div>
      <article className="panel current-project-panel">
        <Layers3 size={30} aria-hidden="true" />
        <div>
          <h3>One workspace for multiple AI capabilities.</h3>
          <p>
            A multimodal AI orchestration platform with model routing, streaming chat,
            private knowledge retrieval, background jobs, and usage metering.
            Built with a FastAPI backend and a Next.js workspace.
          </p>
          <div className="tags" aria-label="Project technologies">
            {['Python', 'FastAPI', 'Next.js', 'TypeScript', 'PostgreSQL'].map(technology => (
              <span className="tag" key={technology}>{technology}</span>
            ))}
          </div>
          <p className="current-project-note">
            Local backend tests pass for this development milestone.
            Production deployment and live provider verification remain in progress.
            Source is currently private; this project is excluded from public GitHub statistics.
          </p>
        </div>
      </article>
    </section>
  );
}
