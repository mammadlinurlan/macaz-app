import { cloneElement, createContext, isValidElement, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useAnimationControls, useReducedMotion } from 'framer-motion'
import { translations, type Lang, type Tr } from './i18n'
import './App.css'

type Page = 'home' | 'projects' | 'about' | 'contact'
type SectionSet = { left: ReactNode[]; right: ReactNode[]; mobile?: ReactNode[] }

/* ---------- Lang context ---------- */
const LangCtx = createContext<{ tr: Tr; lang: Lang; setLang: (l: Lang) => void }>({
  tr: translations.az, lang: 'az', setLang: () => { },
})
const useLang = () => useContext(LangCtx)

/* ---------- Project data ---------- */
interface Project { id: string; title: string; subtitle: string; cover: string; images: string[] }
const TV = '/tehvil-verilmis'
const enc = (s: string) => s.replace(/ /g, '%20').replace(/\(/g, '%28').replace(/\)/g, '%29')
const BVF = `${TV}/buzovna%20villa`
const BGF = `${TV}/bilgeh-villa`
const MOF = `${TV}/milli-onkologiya-merkezi`
const DKF = `${TV}/${enc('Daskesen filiz medenleri( Azergold)- Torpaqlama ve ildirim oturuculefin qurasdirilmasi')}`
const GUF = `${TV}/gurcustan-Baliq%20emali%20zavodunun%20rekanstruksiyasi`
const OZF = `${TV}/${enc('ozbekistan 4 km suvarma kanalinin tikintisi')}`
const bv = (f: string) => `${BVF}/${enc(f)}`
const bg = (f: string) => `${BGF}/${enc(f)}`
const mo = (f: string) => `${MOF}/${enc(f)}`
const dk = (f: string) => `${DKF}/${enc(f)}`
const gu = (f: string) => `${GUF}/${enc(f)}`
const oz = (f: string) => `${OZF}/${enc(f)}`

const DELIVERED: Project[] = [
  {
    id: 'buzovna-villa',
    title: 'Buzovna Villa',
    subtitle: 'Buzovna, Bakı · Yaşayış tikintisi',
    cover: bv('buzovna cover.png'),
    images: ['buzovna cover.png', 'WhatsApp Image 2026-06-23 at 21.43.59 (1).jpeg', 'WhatsApp Image 2026-06-23 at 21.43.59 (2).jpeg', 'WhatsApp Image 2026-06-23 at 21.43.59 (3).jpeg', 'WhatsApp Image 2026-06-23 at 21.43.59 (4).jpeg', 'WhatsApp Image 2026-06-23 at 21.43.59.jpeg', 'WhatsApp Image 2026-06-23 at 21.44.00 (1).jpeg', 'WhatsApp Image 2026-06-23 at 21.44.00.jpeg'].map(bv),
  },
  {
    id: 'bilgeh-villa',
    title: 'Bilgəh Villa',
    subtitle: 'Bilgəh, Bakı · Yaşayış tikintisi',
    cover: bg('cover bilgeh.png'),
    images: ['cover bilgeh.png', 'WhatsApp Image 2026-06-23 at 21.44.26.jpeg', 'WhatsApp Image 2026-06-23 at 21.44.27.jpeg', 'WhatsApp Image 2026-06-23 at 21.44.27 (1).jpeg', 'WhatsApp Image 2026-06-23 at 21.44.27 (2).jpeg', 'WhatsApp Image 2026-06-23 at 21.44.27 (3).jpeg'].map(bg),
  },
  {
    id: 'milli-onkologiya',
    title: 'Milli Onkologiya Mərkəzi',
    subtitle: 'Bakı, Azərbaycan · Tibbi tikinti',
    cover: mo('WhatsApp Image 2026-06-23 at 21.38.19.jpeg'),
    images: ['WhatsApp Image 2026-06-23 at 21.38.19.jpeg', 'WhatsApp Image 2026-06-23 at 21.38.19 (1).jpeg', 'WhatsApp Image 2026-06-23 at 21.38.20.jpeg', 'WhatsApp Image 2026-06-23 at 21.38.20 (1).jpeg', 'WhatsApp Image 2026-06-23 at 21.38.20 (2).jpeg', 'WhatsApp Image 2026-06-23 at 21.38.21.jpeg', 'WhatsApp Image 2026-06-23 at 21.38.21 (1).jpeg'].map(mo),
  },
  {
    id: 'daskesen-azergold',
    title: 'Daşkəsən filiz mədənləri (AzerGold)',
    subtitle: 'Daşkəsən, Azərbaycan · Torpaqlama sistemi',
    cover: dk('WhatsApp Image 2026-06-23 at 21.41.44.jpeg'),
    images: ['WhatsApp Image 2026-06-23 at 21.41.44.jpeg', 'WhatsApp Image 2026-06-23 at 21.41.44 (1).jpeg', 'WhatsApp Image 2026-06-23 at 21.41.44 (2).jpeg', 'WhatsApp Image 2026-06-23 at 21.41.45.jpeg', 'WhatsApp Image 2026-06-23 at 21.41.45 (1).jpeg', 'WhatsApp Image 2026-06-23 at 21.41.45 (2).jpeg', 'WhatsApp Image 2026-06-23 at 21.41.45 (3).jpeg', 'WhatsApp Image 2026-06-23 at 21.41.45 (4).jpeg'].map(dk),
  },
  {
    id: 'gurcustan-baliq',
    title: 'Gürcüstan — Balıq emalı zavodu',
    subtitle: 'Gürcüstan · Rekonstruksiya',
    cover: gu('WhatsApp Image 2026-06-23 at 21.39.18.jpeg'),
    images: ['WhatsApp Image 2026-06-23 at 21.39.18.jpeg', 'WhatsApp Image 2026-06-23 at 21.39.19.jpeg', 'WhatsApp Image 2026-06-23 at 21.39.19 (1).jpeg', 'WhatsApp Image 2026-06-23 at 21.39.20.jpeg', 'WhatsApp Image 2026-06-23 at 21.39.20 (1).jpeg', 'WhatsApp Image 2026-06-23 at 21.39.20 (2).jpeg'].map(gu),
  },
  {
    id: 'ozbekistan-kanal',
    title: 'Özbəkistan — Suvarma kanalı',
    subtitle: 'Özbəkistan · 4 km infrastruktur tikintisi',
    cover: oz('WhatsApp Image 2026-06-23 at 21.40.35.jpeg'),
    images: ['WhatsApp Image 2026-06-23 at 21.40.35.jpeg', 'WhatsApp Image 2026-06-23 at 21.40.35 (1).jpeg', 'WhatsApp Image 2026-06-23 at 21.40.36.jpeg', 'WhatsApp Image 2026-06-23 at 21.40.36 (1).jpeg'].map(oz),
  },
]

// Images used on home / about / contact pages
const HP = {
  main: bv('buzovna cover.png'),
  ext1: bv('buzovna cover.png'),
  ext2: mo('WhatsApp Image 2026-06-23 at 21.38.19.jpeg'),
  ext3: gu('WhatsApp Image 2026-06-23 at 21.39.18.jpeg'),
  int1: bg('WhatsApp Image 2026-06-23 at 21.44.26.jpeg'),
  int2: bg('WhatsApp Image 2026-06-23 at 21.44.27.jpeg'),
  r1:   dk('WhatsApp Image 2026-06-23 at 21.41.44.jpeg'),
  r3:   oz('WhatsApp Image 2026-06-23 at 21.40.35.jpeg'),
  bl:   bg('cover bilgeh.png'),
}

/* ---------- Section helpers ---------- */
const ImgSec = (src: string): ReactNode => (
  <div className="ms-section s-img"><img src={src} alt="" /></div>
)
const Green = (children: ReactNode, pos: 'top' | 'mid' | 'bottom' = 'mid'): ReactNode => (
  <div className={`ms-section s-green ${pos === 'top' ? 'top' : pos === 'bottom' ? 'bottom' : ''}`}>
    <div className="anim">{children}</div>
  </div>
)
const Cream = (children: ReactNode, pos: 'top' | 'mid' | 'bottom' = 'mid'): ReactNode => (
  <div className={`ms-section s-cream ${pos === 'top' ? 'top' : pos === 'bottom' ? 'bottom' : ''}`}>
    <div className="anim">{children}</div>
  </div>
)

/* ---------- Footer ---------- */
function FooterSection({ go, className }: Readonly<{ go: (p: Page) => void; className?: string }>) {
  const { tr } = useLang()
  const n = tr.nav
  const pages: Page[] = ['home', 'projects', 'about', 'contact']
  return (
    <div className={`ms-section s-green footer-sec${className ? ' ' + className : ''}`}>
      <nav className="footer-nav-big anim">
        {[n.home, n.projects, n.about, n.contact].map((label, i) => (
          <button key={i} onClick={() => go(pages[i])}>{label}</button>
        ))}
      </nav>
    </div>
  )
}

function FooterRight({ className }: Readonly<{ className?: string }>) {
  const { tr } = useLang()
  const f = tr.home.footer
  return (
    <div className={`ms-section s-green footer-sec${className ? ' ' + className : ''}`}>
      <div className="footer-contact anim">
        <p className="footer-company">{f.company}</p>
        <p className="footer-phone">{f.phone}</p>
        <p className="footer-addr">{f.address}</p>
        <a className="footer-insta" href="https://instagram.com/macaz.mmc" target="_blank" rel="noreferrer">
          {f.instagram} ↗
        </a>
        <p className="footer-copy">{f.copy}</p>
      </div>
    </div>
  )
}

/* ---------- Home sections ---------- */
// Multiscroll pairing: left[i] shows simultaneously with right[N-1-i]
// Layout: left[0..5] = hero + project images, right[3..7] = matching project texts
function homeSections(go: (p: Page) => void, goProject: (id: string) => void, tr: Tr) {
  const h = tr.home
  const bl = tr.bullets
  const T = (s: string) => s.split('\n').map((l, i, a) => <span key={i}>{l}{i < a.length - 1 && <br />}</span>)
  const footerLeft = <FooterSection go={go} />
  const footerRight = <FooterRight />

  // N = 10, pairs: left[i] ↔ right[9-i]
  // Alternating: image|text, text|image, image|text, text|image, image|text, text|image
  const left: ReactNode[] = [
    /* slide 0 */ Green(<><h1 className="h-display">{T(h.hero)}</h1><p className="eyebrow">{h.heroSub}</p></>, 'bottom'),
    /* slide 1 */ ImgSec(HP.ext1),        // BV  image left  → BV  text  right
    /* slide 2 */ Green(<><p className="eyebrow">02</p><h2 className="h-section peach">{T(h.bilgehTitle)}</h2><p className="body-text">{h.bilgehBody}</p><button className="btn peach" style={{ marginTop: 28 }} onClick={() => goProject('bilgeh-villa')}>{h.archBtn} →</button></>),  // BL text left → BL image right
    /* slide 3 */ ImgSec(HP.ext2),        // MO  image left  → MO  text  right
    /* slide 4 */ Green(<><p className="eyebrow">04</p><h2 className="h-section peach">{T(h.locTitle)}</h2><p className="body-text">{h.locBody}</p><button className="btn peach" style={{ marginTop: 28 }} onClick={() => goProject('gurcustan-baliq')}>{h.locBtn} →</button></>),  // GU text left → GU image right
    /* slide 5 */ ImgSec(HP.r3),          // OZ  image left  → OZ  text  right
    /* slide 6 */ Green(<><p className="eyebrow">06</p><h2 className="h-section peach">{T(h.loc2Title)}</h2><p className="body-text">{h.loc2Body}</p><button className="btn peach" style={{ marginTop: 28 }} onClick={() => goProject('daskesen-azergold')}>{h.archBtn} →</button></>),  // DK text left → DK image right
    /* slide 7 */ Green(<><p className="eyebrow">—</p><h2 className="h-section peach">{T(h.clubTitle)}</h2><p className="body-text">{h.clubBody}</p><button className="btn peach" style={{ marginTop: 28 }} onClick={() => go('projects')}>{h.clubBtn}</button></>),
    /* slide 8 */ Green(<><p className="eyebrow">SPEC</p><h2 className="h-section peach">{T(h.specTitle)}</h2><ul className="bullets" style={{ marginTop: 24 }}><li>{bl.b1}</li><li>{bl.b2}</li><li>{bl.b3}</li><li>{bl.b4}</li></ul></>),
    /* slide 9 */ footerLeft,
  ]

  const right: ReactNode[] = [
    /* R[0] ↔ slide 9 */ footerRight,
    /* R[1] ↔ slide 8 */ ImgSec(HP.int1),
    /* R[2] ↔ slide 7 */ Cream(<><p className="eyebrow" style={{ color: 'var(--green)' }}>{h.concept}</p><h2 className="h-section">{T(h.conceptTitle)}</h2><p className="body-text">{h.conceptBody}</p></>),
    /* R[3] ↔ slide 6 */ ImgSec(HP.r1),   // DK image right (pairs with DK text left)
    /* R[4] ↔ slide 5 */ Green(<><p className="eyebrow">05</p><h2 className="h-section peach">{T(h.finishTitle)}</h2><p className="body-text">{h.finishBody}</p><button className="btn peach" style={{ marginTop: 28 }} onClick={() => goProject('ozbekistan-kanal')}>{h.finishBtn} →</button></>),  // OZ text right
    /* R[5] ↔ slide 4 */ ImgSec(HP.ext3), // GU image right (pairs with GU text left)
    /* R[6] ↔ slide 3 */ Green(<><p className="eyebrow">03</p><h2 className="h-section peach">{T(h.natTitle)}</h2><p className="body-text">{h.natBody}</p><button className="btn peach" style={{ marginTop: 28 }} onClick={() => goProject('milli-onkologiya')}>{h.natBtn} →</button></>),  // MO text right
    /* R[7] ↔ slide 2 */ ImgSec(HP.bl),   // BL image right (pairs with BL text left)
    /* R[8] ↔ slide 1 */ Green(<><p className="eyebrow">01</p><h2 className="h-section peach">{T(h.archTitle)}</h2><p className="body-text">{h.archBody}</p><button className="btn peach" style={{ marginTop: 28 }} onClick={() => goProject('buzovna-villa')}>{h.archBtn} →</button></>),  // BV text right
    /* R[9] ↔ slide 0 */ ImgSec(HP.main),
  ]

  return { left, right }
}

/* ---------- About sections ---------- */
function aboutSections(go: (p: Page) => void, tr: Tr) {
  const a = tr.about
  const left: ReactNode[] = [
    Green(<><p className="eyebrow">{a.eyebrow}</p><h1 className="h-display">{a.title}</h1></>, 'bottom'),
    ImgSec(HP.ext1),
    Green(<><h2 className="h-section peach">{a.approachTitle}</h2><ul className="bullets"><li>{tr.bullets.b1}</li><li>{tr.bullets.b2}</li><li>{tr.bullets.b3}</li><li>{tr.bullets.b4}</li></ul></>),
    ImgSec(HP.ext2),
    Green(<><p className="eyebrow">{a.teamEyebrow}</p><h2 className="h-section peach">{a.teamTitle.split('\n').map((l, i) => <span key={i}>{l}{i === 0 && <br />}</span>)}</h2><p className="body-text">{a.teamBody}</p><button className="btn peach" onClick={() => go('contact')}>{a.ctaBtn}</button></>, 'top'),
    <FooterSection key="footer" go={go} />,
  ]
  const right: ReactNode[] = [
    <FooterRight key="footer-r" />,
    ImgSec(HP.int1),
    Green(<><p className="eyebrow">{a.partnersTitle}</p><h2 className="h-section peach">{a.missionTitle.split('\n').map((l, i) => <span key={i}>{l}{i < 2 && <br />}</span>)}</h2><p className="body-text">{a.missionBody}</p></>),
    ImgSec(HP.int2),
    Green(<><p className="eyebrow">2008 — 2026</p><h2 className="h-section peach">{a.years.split('\n').map((l, i) => <span key={i}>{l}{i < 2 && <br />}</span>)}</h2><p className="body-text">{a.yearsBody}</p></>),
    ImgSec(HP.main),
  ]
  return { left, right }
}

/* ---------- Contact sections ---------- */
function contactSections(go: (p: Page) => void, tr: Tr) {
  const c = tr.contact
  const f = tr.home.footer
  const left: ReactNode[] = [
    Green(<><p className="eyebrow">{c.eyebrow}</p><h1 className="h-display">{c.title}</h1></>, 'bottom'),
    Green(<><h2 className="h-section peach">{c.officeTitle}</h2><p className="body-text" style={{ marginBottom: 16 }}>{c.address}<br />{c.hours}</p><p className="body-text"><strong>{f.phone}</strong><br />Instagram: @eratower.az</p></>),
    ImgSec(HP.ext3),
    <FooterSection key="footer" go={go} />,
  ]
  const right: ReactNode[] = [
    <FooterRight key="footer-r" />,
    Green(<><h2 className="h-section peach">{c.formTitle}</h2><form className="contact-form" onSubmit={(e) => { e.preventDefault(); alert(c.thanks) }}><input type="text" placeholder={c.name} required /><input type="tel" placeholder={c.phone} required /><input type="email" placeholder={c.email} /><textarea placeholder={c.message} /><button type="submit" className="btn peach">{c.send}</button></form></>),
    ImgSec(HP.main),
    ImgSec(HP.int1),
  ]
  return { left, right }
}

/* ---------- Lightbox (mobile only) ---------- */
function Lightbox({ project, onClose }: Readonly<{ project: Project; onClose: () => void }>) {
  const { tr } = useLang()
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setIdx(i => Math.min(i + 1, project.images.length - 1))
      if (e.key === 'ArrowLeft') setIdx(i => Math.max(i - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, project.images.length])

  return (
    <motion.div className="lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button className="lightbox-close" onClick={onClose}>✕</button>
      <div className="lightbox-main">
        <button className="lightbox-nav prev" onClick={() => setIdx(i => Math.max(i - 1, 0))} disabled={idx === 0}>‹</button>
        <motion.img key={idx} src={project.images[idx]} alt="" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} />
        <button className="lightbox-nav next" onClick={() => setIdx(i => Math.min(i + 1, project.images.length - 1))} disabled={idx === project.images.length - 1}>›</button>
      </div>
      <div className="lightbox-info">
        <h3>{project.title}</h3>
        <p>{project.subtitle}</p>
      </div>
      <div className="lightbox-thumbs">
        {project.images.map((img, i) => (
          <img key={img} src={img} alt="" className={i === idx ? 'active' : ''} onClick={() => setIdx(i)} />
        ))}
      </div>
      <button className="lightbox-back-btn" onClick={onClose}>{tr.projects.backBtn}</button>
    </motion.div>
  )
}

/* ---------- Project detail (multiscroll per project) ---------- */
function ProjectDetail({ project, onClose }: Readonly<{ project: Project; onClose: () => void }>) {
  const { tr } = useLang()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const T = (s: string) => s.split('\n').map((l, i, a) => <span key={i}>{l}{i < a.length - 1 && <br />}</span>)

  const titlePanel = Green(
    <>
      <p className="eyebrow">{tr.projects.projectLabel}</p>
      <h2 className="h-section peach">{T(project.title)}</h2>
      <p className="body-text">{project.subtitle}</p>
      <button className="btn peach" style={{ marginTop: 32 }} onClick={onClose}>{tr.projects.backBtn}</button>
    </>
  )

  const left: ReactNode[] = [titlePanel]
  const right: ReactNode[] = []
  project.images.forEach((src, i) => {
    if (i % 2 === 0) left.push(ImgSec(src))
    else right.push(ImgSec(src))
  })
  const filler = <div className="ms-section s-green" />
  while (left.length > right.length) right.push(filler)
  while (right.length > left.length) left.push(filler)

  return (
    <div className="proj-detail">
      <button className="proj-detail-close" onClick={onClose}>✕</button>
      <Multiscroll key={project.id} left={left} right={right} />
    </div>
  )
}

/* ---------- Projects page ---------- */
function ProjectsPage({ go }: Readonly<{ go: (p: Page) => void }>) {
  const { tr } = useLang()
  const location = useLocation()
  const [tab, setTab] = useState<'ongoing' | 'delivered'>('delivered')
  const [detail, setDetail] = useState<Project | null>(() => {
    const id = (location.state as { projectId?: string } | null)?.projectId
    return id ? (DELIVERED.find(p => p.id === id) ?? null) : null
  })

  const isMobile = useIsMobile()
  if (detail) return isMobile
    ? <Lightbox project={detail} onClose={() => setDetail(null)} />
    : <ProjectDetail project={detail} onClose={() => setDetail(null)} />

  return (
    <div className="proj-page">
      <div className="proj-tabs">
        <button
          className={`proj-tab proj-tab--ongoing${tab === 'ongoing' ? ' active' : ''}`}
          onClick={() => setTab('ongoing')}
        >
          <span className="proj-tab-dot" />
          {tr.projects.tabOngoing}
        </button>
        <button
          className={`proj-tab proj-tab--delivered${tab === 'delivered' ? ' active' : ''}`}
          onClick={() => setTab('delivered')}
        >
          ✓ {tr.projects.tabDelivered}
        </button>
      </div>

      {tab === 'ongoing' && (
        <div className="proj-empty">
          <p className="proj-empty-icon">⧖</p>
          <h2 className="proj-empty-title">{tr.projects.ongoingTitle.replace('\n', ' ')}</h2>
          <p className="proj-empty-sub">{tr.projects.contactBody}</p>
          <button className="btn" onClick={() => go('contact')}>{tr.projects.contactUs}</button>
        </div>
      )}

      {tab === 'delivered' && (
        <div className="proj-grid">
          {DELIVERED.map(project => (
            <div key={project.id} className="proj-card" onClick={() => setDetail(project)}>
              <img src={project.cover} alt={project.title} />
              <div className="proj-card-meta">
                <h3>{project.title}</h3>
                <p>{project.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ---------- Intro (logo reveal → header handoff) ---------- */
const EASE_OUT_CUBIC = [0.16, 0.84, 0.34, 1] as const
const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const

function Intro({ onDone }: Readonly<{ onDone: () => void }>) {
  const reduce = useReducedMotion()
  const logo = useAnimationControls()
  const bg = useAnimationControls()
  const wrapRef = useRef<HTMLDivElement>(null)
  const doneRef = useRef(false)

  const handoff = useCallback(async () => {
    if (doneRef.current) return
    doneRef.current = true
    const target = document.querySelector<HTMLImageElement>('.header .logo img')
    const wrap = wrapRef.current
    if (target && wrap) {
      const from = wrap.getBoundingClientRect()
      const to = target.getBoundingClientRect()
      const scale = to.height / from.height
      const x = (to.left + to.width / 2) - (from.left + from.width / 2)
      const y = (to.top + to.height / 2) - (from.top + from.height / 2)
      bg.start({ opacity: 0, transition: { duration: 0.9, ease: 'easeInOut' } })
      await logo.start({ x, y, scale, transition: { duration: 1, ease: EASE_IN_OUT } })
    } else {
      await bg.start({ opacity: 0, transition: { duration: 0.6 } })
    }
    onDone()
  }, [bg, logo, onDone])

  useEffect(() => {
    let cancelled = false
    const wait = (ms: number) => new Promise<void>(res => setTimeout(res, ms))
    async function run() {
      await logo.start({
        opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
        transition: reduce ? { duration: 0.4 } : { duration: 1.2, ease: EASE_OUT_CUBIC },
      })
      if (cancelled) return
      await wait(reduce ? 300 : 1100)
      if (cancelled || doneRef.current) return
      handoff()
    }
    run()
    return () => { cancelled = true }
  }, [logo, reduce, handoff])

  return (
    <motion.div className="intro" onClick={handoff} exit={{ opacity: 0, transition: { duration: 0.4 } }}>
      <motion.div className="intro-bg" initial={{ opacity: 1 }} animate={bg} />
      <motion.div ref={wrapRef} className="intro-logo" initial={{ opacity: 0, scale: 0.8, y: 28, filter: 'blur(10px)' }} animate={logo}>
        <img src="/logo-modified.png" alt="Macaz MMC" />
        <span className="intro-sweep" />
      </motion.div>
      <motion.p
        className="intro-tag"
        initial={{ opacity: 0, y: 10 }}
        animate={reduce ? { opacity: 0.7 } : { opacity: [0, 0.7, 0.7, 0], y: 0 }}
        transition={{ duration: 2.3, times: [0, 0.25, 0.7, 1], delay: 0.5, ease: 'easeInOut' }}
      >
        Macaz MMC
      </motion.p>
    </motion.div>
  )
}

/* ---------- Header ---------- */
function Header({ onMenu, onHome }: Readonly<{ onMenu: () => void; onHome: () => void }>) {
  const { lang, setLang } = useLang()
  return (
    <header className="header">
      <div className="logo" onClick={onHome}>
        <img src="/logo-modified.png" alt="Tikint" />
      </div>
      <div className="header-right">
        <div className="lang-switcher">
          {(['az', 'en', 'ru'] as Lang[]).map(l => (
            <button key={l} className={lang === l ? 'lang-btn active' : 'lang-btn'} onClick={() => setLang(l)}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <button className="burger" onClick={onMenu} aria-label="Menu"><span /></button>
      </div>
    </header>
  )
}

/* ---------- Menu ---------- */
function Menu({ onClose, go }: Readonly<{ onClose: () => void; go: (p: Page) => void }>) {
  const { tr } = useLang()
  const nav = (p: Page) => { go(p); onClose() }
  const n = tr.nav
  return (
    <div className="menu">
      <img src="/logo-modified.png" className="menu-logo" alt="Macaz" />
      <div className="mlinks">
        <button onClick={() => nav('home')}>{n.home}</button>
        <button onClick={() => nav('projects')}>{n.projects}</button>
        <button onClick={() => nav('about')}>{n.about}</button>
        <button onClick={() => nav('contact')}>{n.contact}</button>
      </div>
      <button className="close" onClick={onClose} aria-label="Close">{tr.menu.close}</button>
    </div>
  )
}

/* ---------- Multiscroll engine ---------- */
function addActive(node: ReactNode, active: boolean): ReactNode {
  if (!active) return node
  if (isValidElement<{ className?: string }>(node)) {
    const className = typeof node.props.className === 'string' ? node.props.className : ''
    return cloneElement(node, { className: `${className} active` })
  }
  return node
}

function isMobilePlaceholder(node: ReactNode): boolean {
  if (!isValidElement<{ className?: string; children?: ReactNode }>(node)) return false
  return node.type === 'div' && !node.props.children && typeof node.props.className === 'string' && node.props.className.includes('footer-sec')
}

function getSectionClassName(node: ReactNode): string {
  if (!isValidElement<{ className?: string }>(node)) return ''
  return typeof node.props.className === 'string' ? node.props.className : ''
}

function isVisualSection(node: ReactNode): boolean {
  const cn = getSectionClassName(node)
  return cn.includes('s-img') || cn.includes('map-section')
}

function orderPlainScene(nodes: ReactNode[]): ReactNode[] {
  if (nodes.length !== 2) return nodes
  const [first, second] = nodes
  return isVisualSection(first) && !isVisualSection(second) ? [second, first] : nodes
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => (
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)').matches : false
  ))
  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)')
    const onChange = () => setIsMobile(media.matches)
    onChange()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])
  return isMobile
}

function Multiscroll({ left, right, mobile }: SectionSet) {
  const [i, setI] = useState(0)
  const N = Math.min(left.length, right.length)
  const lock = useRef(false)
  const touchY = useRef(0)
  const isMobile = useIsMobile()

  const goTo = useCallback((next: number) => {
    if (lock.current) return
    const clamped = Math.max(0, Math.min(N - 1, next))
    if (clamped === i) return
    lock.current = true
    setI(clamped)
    setTimeout(() => { lock.current = false }, 950)
  }, [N, i])

  useEffect(() => {
    if (isMobile) return
    const onWheel = (e: WheelEvent) => { e.preventDefault(); if (Math.abs(e.deltaY) < 8) return; goTo(i + (e.deltaY > 0 ? 1 : -1)) }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') goTo(i + 1)
      if (e.key === 'ArrowUp' || e.key === 'PageUp') goTo(i - 1)
    }
    const onTouchStart = (e: TouchEvent) => { touchY.current = e.touches[0]?.clientY ?? 0 }
    const onTouchEnd = (e: TouchEvent) => {
      const dy = touchY.current - (e.changedTouches[0]?.clientY ?? touchY.current)
      if (Math.abs(dy) > 40) goTo(i + (dy > 0 ? 1 : -1))
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKey)
    window.addEventListener('touchstart', onTouchStart)
    window.addEventListener('touchend', onTouchEnd)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [goTo, i, isMobile])

  const leftY = `translateY(${-i * 100}vh)`
  const rightY = `translateY(${-(N - 1 - i) * 100}vh)`
  const plainSections = Array.from({ length: N }).flatMap((_, idx) => (
    orderPlainScene([left[idx], right[N - 1 - idx]].filter(node => !isMobilePlaceholder(node)))
  ))

  if (isMobile) {
    const mobileNodes = mobile ?? plainSections
    return (
      <div className="plain-sections">
        {mobileNodes.map((node, idx) => <div key={idx}>{addActive(node, true)}</div>)}
      </div>
    )
  }

  return (
    <>
      <div className="ms">
        <div className="ms-col">
          <div className="ms-strip" style={{ transform: leftY }}>
            {left.map((node, idx) => <div key={idx}>{addActive(node, idx === i)}</div>)}
          </div>
        </div>
        <div className="ms-col">
          <div className="ms-strip" style={{ transform: rightY }}>
            {right.map((node, idx) => <div key={idx}>{addActive(node, idx === N - 1 - i)}</div>)}
          </div>
        </div>
      </div>
      <div className="pager">
        {Array.from({ length: N }).map((_, idx) => (
          <button key={idx} className={idx === i ? 'on' : ''} onClick={() => goTo(idx)} aria-label={`${idx + 1}`} />
        ))}
      </div>
    </>
  )
}

/* ---------- App ---------- */
const PAGE_ROUTES: Record<string, Page> = {
  '/': 'home', '/projects': 'projects', '/about': 'about', '/contact': 'contact',
}

export default function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [lang, setLang] = useState<Lang>('az')
  const [showIntro, setShowIntro] = useState(true)
  const tr = translations[lang]

  const page: Page = PAGE_ROUTES[location.pathname] ?? 'home'
  const go = useCallback((p: Page) => navigate(p === 'home' ? '/' : `/${p}`), [navigate])
  const goProject = useCallback((id: string) => navigate('/projects', { state: { projectId: id } }), [navigate])

  const sections: SectionSet =
    page === 'home' ? homeSections(go, goProject, tr)
      : page === 'about' ? aboutSections(go, tr)
        : contactSections(go, tr)

  const msKey = `${location.pathname}-${lang}`

  return (
    <LangCtx.Provider value={{ tr, lang, setLang }}>
      <AnimatePresence>
        {showIntro && <Intro key="intro" onDone={() => setShowIntro(false)} />}
      </AnimatePresence>
      <div className="site" data-page={page}>
        <Header onMenu={() => setMenuOpen(true)} onHome={() => go('home')} />
        {menuOpen && <Menu onClose={() => setMenuOpen(false)} go={go} />}
        {page === 'projects'
          ? <ProjectsPage go={go} />
          : <Multiscroll key={msKey} left={sections.left} right={sections.right} mobile={sections.mobile} />
        }
        <button className="fab" aria-label="Call" onClick={() => go('contact')}>☎</button>
      </div>
    </LangCtx.Provider>
  )
}
