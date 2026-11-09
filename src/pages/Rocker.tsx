import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowUpRight, BadgeCheck, Captions, Clapperboard, FolderOpen, Headphones, LockKeyhole, Palette, ShieldCheck, Smartphone, Sparkles } from 'lucide-react';
import { asset } from '../lib/projects';

const screens = [
  { title: 'Home', src: 'projects/rocker-home.png', detail: 'Crimson and obsidian dashboard, with quick access to music, videos and library scanning.' },
  { title: 'Folder library', src: 'projects/rocker-folders.png', detail: 'Browse indexed media by physical storage folder and add permitted SD-card directories.' },
  { title: 'Themes & settings', src: 'projects/rocker-themes.png', detail: 'Customize colors, playback settings and optional dynamic media backgrounds.' },
];
const features = [
  { Icon: Headphones, heading: 'Real music playback', description: 'Local audio discovery, Media3 queues, repeat, shuffle, seeking and background MediaSession controls.' },
  { Icon: Clapperboard, heading: 'Video playback', description: 'Fullscreen video, speed and aspect-ratio controls, with audio-track and subtitle selection when provided by the file.' },
  { Icon: FolderOpen, heading: 'One media folder', description: 'Combine audio and video in a single filename-ordered queue; browse internal storage and supported SD-card subfolders.' },
  { Icon: Captions, heading: 'Language & captions', description: 'Select embedded audio languages, turn subtitles off or load supported external subtitle files.' },
  { Icon: Palette, heading: 'Dynamic backgrounds', description: 'Use album artwork or an available video thumbnail to tint the player, with theme fallback and reduced-motion controls.' },
  { Icon: ShieldCheck, heading: 'Local-first approach', description: 'Media remains on the device during normal playback; Android permissions and user-approved folder access control discovery.' },
];

export default function Rocker() {
  const [sourcePublic, setSourcePublic] = useState(false);
  useEffect(() => {
    let cancelled = false;
    fetch('https://api.github.com/repos/Rohit-kumar-2674/Rocker', {
      headers: { Accept: 'application/vnd.github+json' }
    }).then(async response => {
      if (response.ok && !cancelled) {
        const metadata: { private?: boolean } = await response.json();
        setSourcePublic(metadata.private === false);
      }
    }).catch(() => { /* Public status unavailable: keep conservative label */ });
    return () => { cancelled = true; };
  }, []);
  return <div className="page rocker-page">
    <Link className="breadcrumb" to="/projects/"><ArrowLeft size={15} /> Projects / <span>ROCKER</span></Link>
    <header className="rocker-detail-hero">
      <div className="rocker-detail-copy">
        <p className="eyebrow">ANDROID MEDIA PLAYER · EDITORIAL PROJECT SHOWCASE</p>
        <div className="rocker-detail-title">
          <img src={asset('projects/rocker-icon.png')} width="84" height="84" alt="ROCKER's genuine Android launcher icon"/>
          <h1>ROCKER</h1>
        </div>
        <p className="rocker-detail-subtitle">Music. Motion. One player.</p>
        <p>
          A native Android music and video player built with Kotlin, Jetpack Compose and AndroidX Media3.
          ROCKER combines an expressive dark interface with local file playback, folder navigation,
          SD-card access, video track controls, and customizable artwork-based backgrounds.
        </p>
        <div className="tags">
          {['Android', 'Kotlin', 'Jetpack Compose', 'Media3', 'Material 3', 'Room', 'DataStore'].map(tag =>
            <span className="tag" key={tag}>{tag}</span>)}
        </div>
        <div className="rocker-status-row">
          <span><BadgeCheck size={18}/> v1.2.0-beta.1 APK compiled</span>
          <span><LockKeyhole size={18}/> {sourcePublic ? 'Public source on GitHub' : 'Source access restricted'}</span>
        </div>
        <p className="rocker-access-note">
          This is an editorial project case study. Source access is checked against GitHub's public API,
          and private repositories are not counted in public GitHub statistics.
          Compilation was verified in GitHub Actions; real-device playback testing remains ongoing.
        </p>
        <div className="rocker-actions">
          {sourcePublic && <>
            <a className="button primary rocker-accent-button"
              href="https://github.com/Rohit-kumar-2674/Rocker/releases/tag/v1.2.0-beta.1"
              target="_blank" rel="noreferrer">
              View APK release <ArrowUpRight size={16}/>
            </a>
            <a className="button secondary" href="https://github.com/Rohit-kumar-2674/Rocker"
              target="_blank" rel="noreferrer">
              Source repository <ArrowUpRight size={16}/>
            </a>
          </>}
          <Link className={`button ${sourcePublic ? 'secondary' : 'primary rocker-accent-button'}`}
            to="/projects/">Explore public projects <ArrowUpRight size={16}/></Link>
        </div>
      </div>
      <figure className="rocker-hero-shot">
        <img src={asset('projects/rocker-home.png')} alt="ROCKER Android home screen on the emulator" width="1080" height="1920" />
        <figcaption><Smartphone size={14}/> Real Android emulator capture</figcaption>
      </figure>
    </header>

    <section className="section rocker-detail-section" aria-labelledby="rocker-feature-grid-title">
      <div className="section-heading"><div><p className="eyebrow">BUILT FOR LOCAL MEDIA</p><h2 id="rocker-feature-grid-title">One library. Different formats.</h2></div></div>
      <div className="rocker-feature-grid">
        {features.map(({Icon,heading,description}) =>
          <article className="rocker-feature-tile" key={heading}>
            <div className="rocker-tile-icon"><Icon size={22}/></div>
            <h3>{heading}</h3><p>{description}</p>
          </article>)}
      </div>
    </section>

    <section className="section rocker-detail-section" aria-labelledby="rocker-screens-title">
      <div className="section-heading">
        <div><p className="eyebrow">ACTUAL APP INTERFACE</p><h2 id="rocker-screens-title">ROCKER on Android.</h2></div>
      </div>
      <p className="rocker-gallery-note">
        These are actual screenshots captured from a compiled ROCKER APK running in an Android 15 emulator,
        not AI mockups. The sample files had not finished indexing during capture, so some media lists are empty.
      </p>
      <div className="rocker-screenshot-gallery">
        {screens.map(screen => <figure key={screen.title} className="rocker-screenshot-card">
          <div className="rocker-phone-frame"><img loading="lazy"
            src={asset(screen.src)} alt={`Actual ROCKER Android screenshot: ${screen.title}`}
            width="1080" height="1920"/></div>
          <figcaption><strong>{screen.title}</strong><span>{screen.detail}</span></figcaption>
        </figure>)}
      </div>
    </section>

    <section className="rocker-footnote panel" aria-label="ROCKER verification and source status">
      <Sparkles size={23} aria-hidden="true" />
      <div>
        <h2>Built, not just designed.</h2>
        <p>
          ROCKER v1.2.0-beta.1 produced an Android debug APK in GitHub Actions. The screenshots above
          were taken from the running app. This verifies buildability and actual UI rendering, not complete
          codec coverage, seamless audio/video transitions on every device, or a production signing setup.
          The public-repository dashboard remains sourced only from GitHub's public API.
        </p>
      </div>
    </section>
  </div>;
}
