import { cloneElement, createContext, isValidElement, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { translations, type Lang, type Tr } from './i18n'
import './App.css'

type Page = 'home' | 'projects' | 'about' | 'contact'
type ProjectTab = 'ongoing' | 'delivered'
type SectionSet = { left: ReactNode[]; right: ReactNode[]; mobile?: ReactNode[] }

/* ---------- Lang context ---------- */
const LangCtx = createContext<{ tr: Tr; lang: Lang; setLang: (l: Lang) => void }>({
  tr: translations.az, lang: 'az', setLang: () => { },
})
const useLang = () => useContext(LangCtx)

/* ---------- Images ---------- */
const TS = '/eraTower/tikinti-sekilleri'
const ERA_TOWER_MAP_SRC = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3039.1315974457607!2d49.8951996!3d40.383775899999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307d63f1f82341%3A0xd4350a17e445437c!2sEra%20Tower!5e0!3m2!1sen!2saz!4v1778046657477!5m2!1sen!2saz'
const ET = {
  main: '/eraTower/2323.jpg', ext1: '/eraTower/2324.jpg',
  ext2: '/eraTower/2325.jpg', ext3: '/eraTower/2326.jpg',
  int1: '/eraTower/2327.jpg', int2: '/eraTower/2328.jpg',
  plan2: '/eraTower/menziller/2otaq.jpg', plan3: '/eraTower/menziller/3otaq.jpg',
  plan4: '/eraTower/menziller/4otaq.jpg', plan5: '/eraTower/menziller/5otaq.jpg',
  r1: `${TS}/rakurs1/mart2023.png`,
  r2: `${TS}/rakurs2/mart23.png`,
  r3: `${TS}/rakurs3/mart23.png`,
  r4: `${TS}/rakurs4/Screenshot%202026-05-06%20at%2007.59.51.png`,
  r5: `${TS}/rakurs5/Screenshot%202026-05-06%20at%2008.00.02.png`,
  r6: `${TS}/rakurs6/Screenshot%202026-05-06%20at%2008.00.11.png`,
  r7: `${TS}/rakurs7/Screenshot%202026-05-06%20at%2008.00.24.png`,
  r8: `${TS}/rakurs8/Screenshot%202026-05-06%20at%2008.00.35.png`,
  r9: `${TS}/rakurs9/Screenshot%202026-05-06%20at%2008.00.48.png`,
  r10: `${TS}/rakurs10/Screenshot%202026-05-06%20at%2008.00.57.png`,
  c1: `${TS}/556882779_24574746725487588_6870368033154942161_n.jpg`,
  c2: `${TS}/556908910_24574747138820880_4899668595593576797_n.jpg`,
}

/* ---------- Section helpers ---------- */
const ImgSec = (src: string): ReactNode => (
  <div className="ms-section s-img"><img src={src} alt="" /></div>
)
const MapSec = (): ReactNode => (
  <div className="ms-section map-section">
    <iframe
      className="map-frame"
      src={ERA_TOWER_MAP_SRC}
      title="Era Tower Google Map"
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  </div>
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
const ApartPlan = (title: string, size: string, price: string, img: string): ReactNode => (
  <div className="ms-section s-cream apart-plan">
    <div className="anim">
      <p className="apart-title">{title}</p>
      <p className="apart-size">{size}</p>
      <p className="apart-price">{price}</p>
      <div className="apart-img"><img src={img} alt={title} /></div>
    </div>
  </div>
)

/* ---------- Footer section (last section of home) ---------- */
function FooterSection({ go, className }: Readonly<{ go: (p: Page) => void; className?: string }>) {
  const { tr } = useLang()
  const f = tr.home.footer
  return (
    <div className={`ms-section s-green footer-sec${className ? ' ' + className : ''}`}>
      <div className="anim footer-inner">
        <div className="footer-left">
          <nav className="footer-big-nav">
            {f.primary.map((label, i) => {
              const pages: Page[] = ['home', 'projects', 'about', 'contact']
              return <button key={i} onClick={() => go(pages[i])}>{label}</button>
            })}
          </nav>
        </div>
        <div className="footer-right">
          <p className="footer-company">{f.company}</p>
          <p className="footer-phone">{f.phone}</p>
          <p className="footer-addr">{f.address}</p>
          <a className="footer-insta" href="https://instagram.com/eratower.az" target="_blank" rel="noreferrer">
            {f.instagram} ↗
          </a>
          <p className="footer-copy">{f.copy}</p>
        </div>
      </div>
    </div>
  )
}

/* ---------- Home ---------- */
function homeSections(go: (p: Page) => void, tr: Tr) {
  const h = tr.home
  const bl = tr.bullets

  const footerLeft = <FooterSection go={go} />
  const footerRight = <div className="ms-section s-green footer-sec" />

  const left: ReactNode[] = [
    Green(
      <>
        <h1 className="h-display">{h.hero.split('\n').map((l, i) => <span key={i}>{l}{i === 0 && <br />}</span>)}</h1>
        <p className="eyebrow">{h.heroSub}</p>
      </>,
      'bottom'
    ),
    ImgSec(ET.ext1),
    Green(
      <>
        <p className="eyebrow">ARCH</p>
        <h2 className="h-section peach">{h.archTitle.split('\n').map((l, i) => <span key={i}>{l}{i === 0 && <br />}</span>)}</h2>
        <p className="body-text">{h.archBody}</p>
      </>
    ),
    ImgSec(ET.ext2),
    Green(
      <>
        <p className="eyebrow">ECO</p>
        <h2 className="h-section peach">{h.natTitle.split('\n').map((l, i) => <span key={i}>{l}{i === 0 && <br />}</span>)}</h2>
        <p className="body-text">{h.natBody}</p>
      </>
    ),
    ImgSec(ET.int1),
    Green(
      <>
        <p className="eyebrow">CLUB</p>
        <h2 className="h-section peach">{h.clubTitle.split('\n').map((l, i) => <span key={i}>{l}{i === 0 && <br />}</span>)}</h2>
        <p className="body-text">{h.clubBody}</p>
        <button className="btn peach" onClick={() => go('projects')}>{h.clubBtn}</button>
      </>
    ),
    ImgSec(ET.r1),
    footerLeft,
  ]

  // Right array is REVERSED display order
  const right: ReactNode[] = [
    footerRight,            // i=8
    Green(<><p className="eyebrow">{h.locTitle.split('\n')[0]}</p><h2 className="h-section peach">{h.locTitle.split('\n').map((l, i) => <span key={i}>{l}{i === 0 && <br />}</span>)}</h2><p className="body-text">{h.locBody}</p></>),  // i=7 alongside forest (img+green ✓)
    Cream(
      <>
        <p className="eyebrow" style={{ color: 'var(--green)' }}>{h.concept}</p>
        <h2 className="h-section">{h.conceptTitle.split('\n').map((l, i) => <span key={i}>{l}{i === 0 && <br />}</span>)}</h2>
        <p className="body-text">{h.conceptBody}</p>
      </>
    ),                      // i=6 (alongside interior)
    Green(
      <>
        <p className="eyebrow">SPEC</p>
        <h2 className="h-section peach">{h.specTitle.split('\n').map((l, i) => <span key={i}>{l}{i === 0 && <br />}</span>)}</h2>
        <ul className="bullets" style={{ marginTop: 24 }}>
          <li>{bl.b1}</li>
          <li>{bl.b2}</li>
          <li>{bl.b3}</li>
          <li>{bl.b4}</li>
        </ul>
      </>
    ),                      // i=5 (alongside nature)
    ImgSec(ET.r3),          // i=4 (alongside facade)
    Green(
      <>
        <p className="eyebrow">FINISH</p>
        <h2 className="h-section peach">{h.finishTitle.split('\n').map((l, i) => <span key={i}>{l}{i === 0 && <br />}</span>)}</h2>
        <p className="body-text">{h.finishBody}</p>
      </>
    ),                      // i=3 (alongside arch text)
    ImgSec(ET.ext3),        // i=2 (alongside city img)
    Cream(
      <>
        <p className="eyebrow" style={{ color: 'var(--green)' }}>LOC</p>
        <h2 className="h-section">{h.locTitle.split('\n').map((l, i) => <span key={i}>{l}{i === 0 && <br />}</span>)}</h2>
        <p className="body-text">{h.locBody}</p>
      </>
    ),                      // i=1 (alongside hero)
    ImgSec(ET.main),        // i=0 (alongside hero)
  ]

  return { left, right }
}

/* ---------- Tab switcher ---------- */
function TabSwitcher({ active, setTab }: { active: ProjectTab; setTab: (t: ProjectTab) => void }) {
  const { tr } = useLang()
  return (
    <div className="tab-switcher">
      <button className={active === 'ongoing' ? 'tab-btn active' : 'tab-btn'} onClick={() => setTab('ongoing')}>
        {tr.projects.tabOngoing}
      </button>
      <button className={active === 'delivered' ? 'tab-btn active' : 'tab-btn'} onClick={() => setTab('delivered')}>
        {tr.projects.tabDelivered}
      </button>
    </div>
  )
}

/* ---------- Projects ---------- */
function ongoingSections(go: (p: Page) => void, tr: Tr, setTab: (t: ProjectTab) => void) {
  const p = tr.projects
  const left: ReactNode[] = [
    Green(
      <>
        <TabSwitcher active="ongoing" setTab={setTab} />
        <h1 className="h-display">{p.ongoingTitle.split('\n').map((l, i) => <span key={i}>{l}{i === 0 && <br />}</span>)}</h1>
        <p className="body-text" style={{ marginTop: 16, opacity: 0.7 }}>{p.ongoingEmpty}</p>
      </>,
      'bottom'
    ),
    Green(
      <>
        <h2 className="h-section peach">{p.contactUs}</h2>
        <p className="body-text">{p.contactBody}</p>
        <button className="btn peach" onClick={() => go('contact')}>{p.contactUs}</button>
      </>
    ),
    <FooterSection key="footer" go={go} />,
  ]
  const right: ReactNode[] = [
    <div key="footer-r" className="ms-section s-green footer-sec" />,  // i=2 footer
    ImgSec(ET.ext1),                                                    // i=1 (alongside CTA green)
    ImgSec(ET.ext2),                                                    // i=0 (alongside hero green)
  ]
  return { left, right }
}

function deliveredSections(go: (p: Page) => void, tr: Tr, setTab: (t: ProjectTab) => void) {
  const p = tr.projects
  const sp = tr.specs

  const pairs: Array<{ left: ReactNode; right: ReactNode }> = [
    {
      left: Green(
        <>
          <TabSwitcher active="delivered" setTab={setTab} />
          <h1 className="h-display">{p.deliveredTitle}</h1>
          <p className="body-text" style={{ marginTop: 8, opacity: 0.8 }}>{p.deliveredSub}</p>
        </>,
        'bottom'
      ),
      right: ImgSec(ET.main),
    },
    {
      left: ImgSec(ET.ext1),
      right: Green(
        <>
          <p className="eyebrow">{p.aboutTitle.split('\n')[0]}</p>
          <h2 className="h-section peach">{p.aboutTitle.split('\n').map((l, i) => <span key={i}>{l}{i === 0 && <br />}</span>)}</h2>
          <p className="body-text">{p.aboutBody}</p>
        </>
      ),
    },
    {
      left: Green(
        <>
          <p className="eyebrow">MAP</p>
          <h2 className="h-section peach">{p.mapTitle.split('\n').map((l, i) => <span key={i}>{l}{i === 0 && <br />}</span>)}</h2>
          <p className="body-text">{p.mapBody}</p>
        </>
      ),
      right: MapSec(),
    },
    {
      left: Green(
        <>
          <p className="eyebrow">{p.specsTitle}</p>
          <ul className="bullets et-specs">
            <li><span>{sp.floors}</span><strong>22</strong></li>
            <li><span>{sp.tech}</span><strong>{p.vTech}</strong></li>
            <li><span>{sp.walls}</span><strong>{p.vWalls}</strong></li>
            <li><span>{sp.facade}</span><strong>{p.vFacade}</strong></li>
            <li><span>{sp.ceiling}</span><strong>3,3 m</strong></li>
            <li><span>{sp.area}</span><strong>62–396 m²</strong></li>
            <li><span>{sp.blocks}</span><strong>1</strong></li>
          </ul>
        </>
      ),
      right: Green(
        <>
          <p className="eyebrow">{p.extraTitle}</p>
          <ul className="bullets et-specs">
            <li><span>{sp.count}</span><strong>{p.vCount}</strong></li>
            <li><span>{sp.finish}</span><strong>{p.vFinish}</strong></li>
            <li><span>{sp.transport}</span><strong>{p.vTransport}</strong></li>
            <li><span>{sp.env}</span><strong>{p.vEnv}</strong></li>
            <li><span>{sp.view}</span><strong>{p.vView}</strong></li>
          </ul>
        </>
      ),
    },
    { left: ApartPlan(p.rooms2, '64 m²', p.price, ET.plan2), right: ApartPlan(p.rooms3, '162–344 m²', p.price, ET.plan3) },
    { left: ApartPlan(p.rooms4, '190 m²', p.price, ET.plan4), right: ApartPlan(p.rooms5, '227–396 m²', p.price, ET.plan5) },
    {
      left: ImgSec(ET.int1),
      right: Green(
        <>
          <p className="eyebrow">{p.infraTitle}</p>
          <ul className="bullets et-specs">
            <li><span>{sp.parking}</span><strong>{p.vParking}</strong></li>
            <li><span>{sp.lift}</span><strong>{p.vLift}</strong></li>
            <li><span>{sp.security}</span><strong>{p.vSecurity}</strong></li>
            <li><span>{sp.infra}</span><strong>{p.vInfra}</strong></li>
            <li><span>{sp.utility}</span><strong>{p.vUtility}</strong></li>
            <li><span>{sp.heating}</span><strong>{p.vHeating}</strong></li>
          </ul>
        </>
      ),
    },
    {
      left: Green(
        <>
          <p className="eyebrow">{p.constrEyebrow}</p>
          <h2 className="h-section peach">{p.constrTitle.split('\n').map((l, i) => <span key={i}>{l}{i < 2 && <br />}</span>)}</h2>
        </>,
        'bottom'
      ),
      right: ImgSec(ET.r1),
    },
    { left: ImgSec(ET.r2), right: ImgSec(ET.r3) },
    { left: ImgSec(ET.r4), right: ImgSec(ET.r5) },
    { left: ImgSec(ET.r6), right: ImgSec(ET.r7) },
    { left: ImgSec(ET.r8), right: ImgSec(ET.r9) },
    { left: ImgSec(ET.r10), right: ImgSec(ET.c1) },
    { left: ImgSec(ET.c2), right: ImgSec(ET.ext2) },
    {
      left: ImgSec(ET.ext3),
      right: Green(
        <>
          <h2 className="h-section peach">{p.ctaTitle.split('\n').map((l, i) => <span key={i}>{l}{i === 0 && <br />}</span>)}</h2>
          <p className="body-text" style={{ marginBottom: 8 }}>{p.ctaInsta}</p>
          <button className="btn peach" onClick={() => go('contact')}>{p.ctaBtn}</button>
        </>,
        'top'
      ),
    },
    {
      left: <FooterSection key="footer" go={go} />,
      right: <div key="footer-r" className="ms-section s-green footer-sec" />,
    },
  ]

  const left = pairs.map(pair => pair.left)
  const right = pairs.map(pair => pair.right).reverse()
  const mobile = pairs.flatMap(pair => orderPlainScene([pair.left, pair.right])).filter(node => !isMobilePlaceholder(node))

  return { left, right, mobile }
}

function projectsSections(go: (p: Page) => void, tr: Tr, tab: ProjectTab, setTab: (t: ProjectTab) => void): SectionSet {
  return tab === 'ongoing' ? ongoingSections(go, tr, setTab) : deliveredSections(go, tr, setTab)
}

/* ---------- About ---------- */
function aboutSections(go: (p: Page) => void, tr: Tr) {
  const a = tr.about
  const left: ReactNode[] = [
    Green(<><p className="eyebrow">{a.eyebrow}</p><h1 className="h-display">{a.title}</h1></>, 'bottom'),
    ImgSec(ET.ext1),
    Green(<><h2 className="h-section peach">{a.approachTitle}</h2><ul className="bullets"><li>{tr.bullets.b1}</li><li>{tr.bullets.b2}</li><li>{tr.bullets.b3}</li><li>{tr.bullets.b4}</li></ul></>),
    ImgSec(ET.ext2),
    Green(<><p className="eyebrow">{a.teamEyebrow}</p><h2 className="h-section peach">{a.teamTitle.split('\n').map((l, i) => <span key={i}>{l}{i === 0 && <br />}</span>)}</h2><p className="body-text">{a.teamBody}</p><button className="btn peach" onClick={() => go('contact')}>{a.ctaBtn}</button></>, 'top'),
    <FooterSection key="footer" go={go} />,
  ]
  // Right reversed (right[N-1-i] shows at position i)
  const right: ReactNode[] = [
    <div key="footer-r" className="ms-section s-green footer-sec" />,  // i=5 footer
    ImgSec(ET.int1),          // i=4 alongside team (green+img ✓)
    Green(<><p className="eyebrow">{a.partnersTitle}</p><h2 className="h-section peach">{a.missionTitle.split('\n').map((l, i) => <span key={i}>{l}{i < 2 && <br />}</span>)}</h2><p className="body-text">{a.missionBody}</p></>),  // i=3 alongside ET.ext2 (img+green ✓)
    ImgSec(ET.int2),          // i=2 alongside approach (green+img ✓)
    Green(<><p className="eyebrow">2008 — 2026</p><h2 className="h-section peach">{a.years.split('\n').map((l, i) => <span key={i}>{l}{i < 2 && <br />}</span>)}</h2><p className="body-text">{a.yearsBody}</p></>),  // i=1 alongside ET.ext1 (img+green ✓)
    ImgSec(ET.main),          // i=0 alongside hero (green+img ✓)
  ]
  return { left, right }
}

/* ---------- Contact ---------- */
function contactSections(go: (p: Page) => void, tr: Tr) {
  const c = tr.contact
  const f = tr.home.footer
  const left: ReactNode[] = [
    Green(<><p className="eyebrow">{c.eyebrow}</p><h1 className="h-display">{c.title}</h1></>, 'bottom'),
    Green(<><h2 className="h-section peach">{c.officeTitle}</h2><p className="body-text" style={{ marginBottom: 16 }}>{c.address}<br />{c.hours}</p><p className="body-text"><strong>{f.phone}</strong><br />Instagram: @eratower.az</p></>),
    ImgSec(ET.ext3),
    <FooterSection key="footer" go={go} />,
  ]
  const right: ReactNode[] = [
    <div key="footer-r" className="ms-section s-green footer-sec" />,  // i=3 footer
    Green(<><h2 className="h-section peach">{c.formTitle}</h2><form className="contact-form" onSubmit={(e) => { e.preventDefault(); alert(c.thanks) }}><input type="text" placeholder={c.name} required /><input type="tel" placeholder={c.phone} required /><input type="email" placeholder={c.email} /><textarea placeholder={c.message} /><button type="submit" className="btn peach">{c.send}</button></form></>),  // i=2 alongside ET.ext3 (img+green ✓)
    ImgSec(ET.main),          // i=1 alongside office (green+img ✓)
    ImgSec(ET.int1),          // i=0 alongside hero (green+img ✓)
  ]
  return { left, right }
}

/* ---------- Header ---------- */
function Header({ onMenu, onHome }: { onMenu: () => void; onHome: () => void }) {
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
function Menu({ onClose, go }: { onClose: () => void; go: (p: Page) => void }) {
  const { tr } = useLang()
  const nav = (p: Page) => { go(p); onClose() }
  const n = tr.nav
  return (
    <div className="menu">
      <div className="logo"><img src="/logo-modified.png" alt="Tikint" /></div>
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
  if (!isValidElement<{ className?: string; children?: ReactNode }>(node)) {
    return false
  }
  return (
    node.type === 'div' &&
    !node.props.children &&
    typeof node.props.className === 'string' &&
    node.props.className.includes('footer-sec')
  )
}

function getSectionClassName(node: ReactNode): string {
  if (!isValidElement<{ className?: string }>(node)) {
    return ''
  }
  return typeof node.props.className === 'string' ? node.props.className : ''
}

function isVisualSection(node: ReactNode): boolean {
  const className = getSectionClassName(node)
  return className.includes('s-img') || className.includes('apart-plan') || className.includes('map-section')
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

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (Math.abs(e.deltaY) < 8) return
      goTo(i + (e.deltaY > 0 ? 1 : -1))
    }
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
        {mobileNodes.map((node, idx) => (
          <div key={idx}>{addActive(node, true)}</div>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="ms">
        <div className="ms-col">
          <div className="ms-strip" style={{ transform: leftY }}>
            {left.map((node, idx) => (
              <div key={idx}>{addActive(node, idx === i)}</div>
            ))}
          </div>
        </div>
        <div className="ms-col">
          <div className="ms-strip" style={{ transform: rightY }}>
            {right.map((node, idx) => (
              <div key={idx}>{addActive(node, idx === N - 1 - i)}</div>
            ))}
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
  const [projectsTab, setProjectsTab] = useState<ProjectTab>('delivered')
  const [lang, setLang] = useState<Lang>('az')
  const tr = translations[lang]

  const page: Page = PAGE_ROUTES[location.pathname] ?? 'home'
  const go = (p: Page) => navigate(p === 'home' ? '/' : `/${p}`)

  const sections: SectionSet =
    page === 'home' ? homeSections(go, tr)
      : page === 'projects' ? projectsSections(go, tr, projectsTab, setProjectsTab)
        : page === 'about' ? aboutSections(go, tr)
          : contactSections(go, tr)

  const msKey = page === 'projects' ? `projects-${projectsTab}-${lang}` : `${location.pathname}-${lang}`

  return (
    <LangCtx.Provider value={{ tr, lang, setLang }}>
      <div className="site">
        <Header onMenu={() => setMenuOpen(true)} onHome={() => go('home')} />
        {menuOpen && <Menu onClose={() => setMenuOpen(false)} go={go} />}
        <Multiscroll key={msKey} left={sections.left} right={sections.right} mobile={sections.mobile} />
        <button className="fab" aria-label="Call" onClick={() => go('contact')}>☎</button>
      </div>
    </LangCtx.Provider>
  )
}
