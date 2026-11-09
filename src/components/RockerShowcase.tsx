import { Link } from 'react-router-dom';
import { ArrowUpRight, CheckCircle2, FolderOpen, Headphones, LockKeyhole, MonitorPlay, Palette } from 'lucide-react';
import { asset } from '../lib/projects';

/**
 * Editorial case study, deliberately separate from data.repositories.
 * ROCKER's code repository is private; it must not enter public GitHub
 * metrics, repository counts or the public API-driven project index.
 */
export default function RockerShowcase({ compact = false }: { compact?: boolean }) {
  return (
    <section className={`section rocker-feature ${compact ? 'rocker-feature-compact' : ''}`}
      aria-labelledby="rocker-feature-title" id="rocker-project">
      <div className="section-heading">
        <div>
          <p className="eyebrow">FEATURED ANDROID PROJECT</p>
          <h2 id="rocker-feature-title">ROCKER. All your media, one player.</h2>
        </div>
        <span className="rocker-beta-label"><CheckCircle2 size={14} /> v1.2 beta · APK built</span>
      </div>
      <div className="rocker-showcase">
        <div className="rocker-showcase-copy">
          <div className="rocker-brand-line">
            <img src={asset('projects/rocker-icon.png')} alt="ROCKER's real Android launcher icon"
              width="66" height="66" loading="lazy" />
            <div><strong>ROCKER</strong><span>Android music & video</span></div>
          </div>
          <p className="rocker-lead">
            A native Kotlin + Jetpack Compose player that brings local songs, videos and
            actual storage folders into a dark, customizable Android experience.
          </p>
          <div className="rocker-capabilities" aria-label="ROCKER feature highlights">
            <span><Headphones size={16} /> Music queues</span>
            <span><MonitorPlay size={16} /> Video & subtitles</span>
            <span><FolderOpen size={16} /> SD card folders</span>
            <span><Palette size={16} /> Dynamic themes</span>
          </div>
          <p className="rocker-editorial-note">
            <LockKeyhole size={16} aria-hidden="true" />
            Genuine Android emulator screenshots · beta features need device testing · source status on project page.
          </p>
          <div className="rocker-actions">
            <Link className="button primary rocker-accent-button" to="/rocker/">
              Explore ROCKER <ArrowUpRight size={17} />
            </Link>
            <Link className="button secondary" to="/projects/">See public repositories</Link>
          </div>
        </div>
        <Link className="rocker-showcase-preview" to="/rocker/" aria-label="Explore ROCKER and view authentic Android screenshots">
          <img src={asset('projects/rocker-home.png')} width="1080" height="1920"
            alt="Actual ROCKER Android app home screen captured in an emulator"
            loading="lazy" />
          <div className="rocker-preview-caption">
            <span>REAL ANDROID SCREENSHOT</span><ArrowUpRight size={17}/>
          </div>
        </Link>
      </div>
    </section>
  );
}
