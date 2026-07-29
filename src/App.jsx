import { useEffect, useState } from 'react'
import './App.css'

const BASE_URL = import.meta.env.BASE_URL

// Deployed Cloudflare Worker that commits stats.json/stalls.json back to
// GitHub. See cloudflare-worker/README.md for deploy instructions.
const DASHBOARD_API_URL = 'https://papyri-stats-proxy.papyri-template.workers.dev'
// Shared secret the Worker checks before committing; must match its
// DASHBOARD_TOKEN secret. Limits writes to the dashboard JSON files, not a
// full GitHub token, but is still visible in this public source — see README.
const DASHBOARD_EDIT_TOKEN = 'papyristores'

const GST_URL = 'https://www.gst.gov.in/'

const getPeriodKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

const getMonthYearLabel = (date) =>
  date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()

const commitDashboardFile = async (file, data) => {
  const res = await fetch(DASHBOARD_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Dashboard-Token': DASHBOARD_EDIT_TOKEN,
    },
    body: JSON.stringify({ file, data }),
  })
  if (!res.ok) throw new Error('Request failed')
}

function TickIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  )
}

const FIGMA_TEAM_URL =
  'https://www.figma.com/files/team/1507998345350890059/recents-and-sharing?fuid=1507998343150900536'

const LINKS = [
  {
    label: 'Polaroids',
    href: 'https://www.figma.com/files/team/1655813091897424519/drafts?fuid=1507998343150900536',
  },
  {
    label: 'Stickers',
    href: 'https://www.figma.com/files/team/1656159504782565874/drafts?fuid=1507998343150900536',
  },
  {
    label: 'Branding',
    href: 'https://www.figma.com/files/team/1655816611632182467/drafts?fuid=1507998343150900536',
  },
  {
    label: 'Minoids',
    href: 'https://www.figma.com/files/team/1655837562755055567/drafts?fuid=1507998343150900536',
  },
  {
    label: 'Posters',
    href: 'https://www.figma.com/files/team/1655838889265396225/drafts?fuid=1507998343150900536',
  },
  {
    label: 'Unedited',
    href: 'https://www.figma.com/files/team/1656204574950086248/drafts?fuid=1507998343150900536',
  },
  {
    label: 'Coloring',
    href: 'https://www.figma.com/files/team/1663451933381034846/drafts?fuid=1507998343150900536',
  },
  {
    label: 'Minook',
    href: 'https://www.figma.com/files/team/1655814377941904558/drafts?fuid=1507998343150900536',
    signature: true,
  },
  {
    label: "Team's",
    href: 'https://www.figma.com/files/team/1507998345350890059/drafts?fuid=1507998343150900536',
  },
  { label: 'ID23M1003', href: '' },
]

const SHEETS_LOGO_URL = 'https://docs.google.com/spreadsheets/u/0/'

const SHEETS = [
  {
    label: 'Minoid',
    href: 'https://docs.google.com/spreadsheets/d/15dOewGO6oay415mBn4-UZNjyJtboCJl6-8donRVup9A/edit?gid=0#gid=0',
  },
  {
    label: 'Papyri',
    href: 'https://docs.google.com/spreadsheets/d/1yXB-V0PYA6GoKxFlLkP5vc2Jz_pzyb70EL8czp4r3P0/edit?gid=759504678#gid=759504678',
  },
  {
    label: 'Amazon',
    href: 'https://docs.google.com/spreadsheets/d/1dkj8e7rbak5TVxTSmAoY45QMAinJN-lqpKFk7TJmjJ8/edit?gid=56791174#gid=56791174',
  },
  {
    label: 'Pop',
    href: 'https://docs.google.com/spreadsheets/d/1j9uZDTBKx-9-PJokY5nKao9lZ7mEp07Y2YgBbfMkhBM/edit?gid=0#gid=0',
  },
  {
    label: 'Music Sheet',
    href: 'https://docs.google.com/spreadsheets/d/1TpaW09O83ldyRRSOO2d80yPxm124HCeKgi4TldhBxZY/edit?gid=1367986402#gid=1367986402',
  },
  {
    label: 'Raw Enquiry',
    href: 'https://docs.google.com/spreadsheets/d/1XSqDwFkaoxf8ZDt_Vi_u5sb3ZowWv6ueuC8sQIA2ucE/edit?gid=0#gid=0',
  },
  {
    label: 'Stalls',
    href: 'http://docs.google.com/spreadsheets/d/17RXXf889gKeytu869eRnrkbzA5LmX36IYQ7PkzFE0Ck/edit?ouid=104002587544367348628&usp=sheets_home&ths=true',
  },
  {
    label: 'Inventory',
    href: 'https://docs.google.com/spreadsheets/d/16UfhEuwu4Kn9KioqL5gUrZtu5KiOwFfrufKlMwtYNn4/edit?gid=0#gid=0',
  },
]

const NOTION_LOGO_URL = 'https://app.notion.com/'

const NOTION_LINKS = [
  {
    label: 'Expenditure',
    href: 'https://app.notion.com/p/3aa292e05a488057bf7dc8775226cde0?v=3aa292e05a488056b3be000c66d408cb',
  },
  {
    label: 'Revenue',
    href: 'https://app.notion.com/p/3aa292e05a4880558008f65fd783ebcc?v=3aa292e05a4880999557000c9902f83d',
  },
  {
    label: 'Pre-Purchase',
    href: 'https://app.notion.com/p/Pre-375292e05a4880f19c24e31a0bf16011',
  },
  {
    label: 'Meeting',
    href: 'https://app.notion.com/p/3aa292e05a488073a418fd7c96767286?v=3aa292e05a4880fca199000c19a6efde',
  },
  {
    label: 'Projects',
    href: 'https://app.notion.com/p/3aa292e05a488042b692d6b8fce3691e?v=3aa292e05a4880e8a44e000c248fc3b7',
  },
]

const OPENAI_URL = 'https://chatgpt.com/'
const PINTEREST_URL = 'https://pinterest.com'
const TRELLO_URL = 'https://trello.com/w/papyristores'
const AMAZON_URL =
  'https://sellercentral.amazon.in/home?mons_sel_mkid=amzn1.mp.o.A21TJRUUN4KGV&mons_sel_dir_mcid=amzn1.merchant.d.ACPD7WVCAVPZLVO3FSECBPBWLYYA&mons_sel_dir_paid=amzn1.pa.d.ABJTW55LWPF2OQREDCLIHFJYAPLQ&ignore_selection_changed=true'
const GITHUB_URL = 'https://github.com/papyristores?tab=repositories'
const NOTION_CALENDAR_URL = 'https://calendar.notion.so/'
const GMAIL_URL = 'https://mail.google.com/'

const QUICK_ICONS = [
  { label: 'Pinterest', href: PINTEREST_URL, img: 'pinterest.png' },
  { label: 'Trello', href: TRELLO_URL, img: 'trello.png' },
  { label: 'Amazon', href: AMAZON_URL, img: 'amazon.png' },
  { label: 'GitHub', href: GITHUB_URL, img: 'github.png' },
  { label: 'Gmail', href: GMAIL_URL, img: 'gmail.png' },
]

const GOAL_ITEMS = [
  { name: 'Ptah', caption: 'MINOOK 50', img: 'ptah.png', nameImg: 'Ptah-name.png' },
  { name: 'Ra', caption: 'WEBSITE', img: 'ra.png', nameImg: 'Ra-name.png' },
  { name: 'Khonsu', caption: 'AUG 1 LAC', img: 'khonsu.png', nameImg: 'Khonsu-name.png' },
]

const STATS_META = [
  { key: 'expenditure', label: 'Expenditure' },
  { key: 'revenue', label: 'Revenue' },
  { key: 'balance', label: 'Balance' },
]

const NEXT_STALL_DATE = 'August 05'

function App() {
  const [query, setQuery] = useState('')
  const monthYearLabel = getMonthYearLabel(new Date())
  const currentPeriod = getPeriodKey(new Date())

  const [stats, setStats] = useState(null)
  const [editingStat, setEditingStat] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [savingStat, setSavingStat] = useState(null)
  const [statError, setStatError] = useState(null)

  const [stalls, setStalls] = useState(null)
  const [editingStall, setEditingStall] = useState(null)
  const [editStallValue, setEditStallValue] = useState('')
  const [savingStall, setSavingStall] = useState(null)
  const [stallError, setStallError] = useState(null)

  const [gstData, setGstData] = useState(null)
  const [gstError, setGstError] = useState(null)

  const gstState =
    gstData && gstData.period === currentPeriod
      ? gstData
      : { period: currentPeriod, gstr1: false, gstr3b: false }

  useEffect(() => {
    fetch(`${BASE_URL}stats.json`, { cache: 'no-store' })
      .then((res) => res.json())
      .then(setStats)
      .catch(() => setStatError('Could not load stats.json'))

    fetch(`${BASE_URL}stalls.json`, { cache: 'no-store' })
      .then((res) => res.json())
      .then(setStalls)
      .catch(() => setStallError('Could not load stalls.json'))

    fetch(`${BASE_URL}gst.json`, { cache: 'no-store' })
      .then((res) => res.json())
      .then(setGstData)
      .catch(() => setGstError('Could not load gst.json'))
  }, [])

  const handleGstToggle = async (key) => {
    if (gstState[key]) return
    const nextState = { ...gstState, [key]: true }
    setGstData(nextState)
    setGstError(null)
    try {
      await commitDashboardFile('gst.json', nextState)
    } catch {
      setGstError('Failed to save to GitHub. Value is updated on screen only.')
    }
  }

  const startEditingStat = (key) => {
    setStatError(null)
    setEditingStat(key)
    setEditValue(stats?.[key] ?? '')
  }

  const cancelEditingStat = () => {
    setEditingStat(null)
    setEditValue('')
  }

  const commitStat = async (key) => {
    const nextStats = { ...stats, [key]: editValue }
    setStats(nextStats)
    setEditingStat(null)
    setSavingStat(key)
    setStatError(null)
    try {
      await commitDashboardFile('stats.json', nextStats)
    } catch {
      setStatError(`Failed to save ${key} to GitHub. Value is updated on screen only.`)
    } finally {
      setSavingStat(null)
    }
  }

  const handleStatKeyDown = (e, key) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      commitStat(key)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      cancelEditingStat()
    }
  }

  const startEditingStall = (index, field) => {
    setStallError(null)
    setEditingStall({ index, field })
    setEditStallValue(stalls?.[index]?.[field] ?? '')
  }

  const cancelEditingStall = () => {
    setEditingStall(null)
    setEditStallValue('')
  }

  const commitStall = async (index, field) => {
    const nextStalls = stalls.map((stall, i) =>
      i === index ? { ...stall, [field]: editStallValue } : stall,
    )
    setStalls(nextStalls)
    setEditingStall(null)
    setSavingStall({ index, field })
    setStallError(null)
    try {
      await commitDashboardFile('stalls.json', nextStalls)
    } catch {
      setStallError('Failed to save to GitHub. Value is updated on screen only.')
    } finally {
      setSavingStall(null)
    }
  }

  const handleStallKeyDown = (e, index, field) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      commitStall(index, field)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      cancelEditingStall()
    }
  }

  const runSearch = () => {
    const trimmed = query.trim()
    if (!trimmed) return
    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    runSearch()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      runSearch()
    }
  }

  const clearQuery = () => setQuery('')

  return (
    <div className="dashboard">
      <aside className="sidebar-left">
        <a href={FIGMA_TEAM_URL} rel="noopener noreferrer" aria-label="Open Figma team">
          <img
            src={`${BASE_URL}figma-logo.png`}
            alt="Figma logo"
            className="figma-logo"
          />
        </a>
        <nav className="sidebar-nav">
          {LINKS.map((link) => {
            const className = `link-btn${link.signature ? ' signature-btn' : ''}`
            return link.href ? (
              <a key={link.label} href={link.href} rel="noopener noreferrer" className={className}>
                {link.label}
              </a>
            ) : (
              <button key={link.label} type="button" className={className}>
                {link.label}
              </button>
            )
          })}
        </nav>
      </aside>

      <main className="main-content">
        <div className="brand-header">
          <img src={`${BASE_URL}brand.png`} alt="Papyri HQ" className="brand-logo" />

          <form className="search-bar" onSubmit={handleSubmit} role="search">
            <input
              type="text"
              className="search-input"
              placeholder="Google search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Search"
            />
            {query && (
              <button
                type="button"
                className="icon-btn clear-btn"
                aria-label="Clear search"
                onClick={clearQuery}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
                  <path
                    fill="currentColor"
                    d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                  />
                </svg>
              </button>
            )}
            <button type="submit" className="icon-btn search-icon-btn" aria-label="Search">
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
                <path
                  fill="currentColor"
                  d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z"
                />
              </svg>
            </button>
          </form>

          <div className="quick-icons-row">
            {QUICK_ICONS.map((icon) => (
              <a
                key={icon.label}
                href={icon.href}
                rel="noopener noreferrer"
                className="quick-icon-link"
                aria-label={`Open ${icon.label}`}
              >
                <img src={`${BASE_URL}${icon.img}`} alt={icon.label} className="quick-icon-img" />
              </a>
            ))}
          </div>
        </div>

        <div className="goal-card">
          <div className="goal-label-wrap">
            <div className="goal-label">
              Goal of
              <br />
              the month
            </div>
          </div>
          {GOAL_ITEMS.map((item) => (
            <div className="goal-item" key={item.name}>
              <img
                src={`${BASE_URL}${item.img}`}
                alt={item.name}
                className="goal-photo"
              />
              <span className="goal-caption">{item.caption}</span>
              <img
                src={`${BASE_URL}${item.nameImg}`}
                alt={item.name}
                className={`goal-name-img goal-name-${item.name.toLowerCase()}`}
              />
            </div>
          ))}
        </div>

        <div className="content-grid">
          <div className="sheet-card">
            <div className="sheet-card-grid">
              {SHEETS.filter((sheet) => sheet.label !== 'Raw Enquiry').map((sheet) => (
                <a
                  key={sheet.label}
                  href={sheet.href}
                  rel="noopener noreferrer"
                  className="sheet-mini-item"
                >
                  <span className="sheet-mini-badge">
                    <img
                      src={`${BASE_URL}excel-document.png`}
                      alt=""
                      className="sheet-mini-icon"
                    />
                    <span className="sheet-mini-label">{sheet.label}</span>
                  </span>
                </a>
              ))}
              <a
                href={SHEETS_LOGO_URL}
                rel="noopener noreferrer"
                aria-label="Open Google Sheets"
                className="sheet-card-logo-cell"
              >
                <img
                  src={`${BASE_URL}spreadsheet.png`}
                  alt="Google Sheets"
                  className="sheet-card-logo"
                />
              </a>
            </div>
          </div>

          <div className="notion-calendar-card">
            <div className="notion-card-body">
              <a href={NOTION_LOGO_URL} rel="noopener noreferrer" aria-label="Open Notion">
                <img
                  src={`${BASE_URL}notion-logo.png`}
                  alt="Notion"
                  className="notion-card-logo"
                />
              </a>
              <ul className="notion-list">
                {NOTION_LINKS.map((item) => (
                  <li key={item.label}>
                    <a href={item.href} rel="noopener noreferrer" className="notion-list-link">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <a
              href={NOTION_CALENDAR_URL}
              rel="noopener noreferrer"
              className="app-icon-link"
              aria-label="Open Notion Calendar"
            >
              <img
                src={`${BASE_URL}notion-calendar.png`}
                alt="Notion Calendar"
                className="app-icon-img"
              />
            </a>
          </div>

          <div className="bottom-row">
            <div className="button-container">
              <a
                href={OPENAI_URL}
                rel="noopener noreferrer"
                className="brutalist-button openai button-1"
              >
                <div className="openai-logo">
                  <svg
                    className="openai-icon"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.8956zm16.0993 3.8558L12.5907 8.3829 14.6108 7.2144a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.3927-.6813zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"
                      fill="#10A37F"
                    />
                  </svg>
                </div>
                <div className="button-text">
                  <span>Powered By</span>
                  <span>GPT-Omni</span>
                </div>
              </a>
            </div>

            <div className="next-stall-card">
              <span className="next-stall-label">Next Stall on</span>
              <span className="next-stall-date">{NEXT_STALL_DATE}</span>
            </div>
          </div>
        </div>
      </main>

      <aside className="sidebar-right">
        <div className="stats-block">
          {STATS_META.map((stat) => (
            <div className="stat-item" key={stat.key}>
              <span className="stat-label">{stat.label}</span>
              {editingStat === stat.key ? (
                <span className="inline-edit-row">
                  <input
                    type="text"
                    className="inline-edit-input"
                    value={editValue}
                    autoFocus
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => handleStatKeyDown(e, stat.key)}
                    aria-label={`Edit ${stat.label}`}
                  />
                  <button
                    type="button"
                    className="inline-edit-confirm-btn"
                    aria-label={`Save ${stat.label}`}
                    onClick={() => commitStat(stat.key)}
                  >
                    <TickIcon />
                  </button>
                </span>
              ) : (
                <span
                  className="stat-value"
                  onDoubleClick={() => startEditingStat(stat.key)}
                  title="Double-click to edit"
                >
                  {stats?.[stat.key] ?? '–'}
                  {savingStat === stat.key && <span className="inline-edit-saving"> ⋯</span>}
                </span>
              )}
            </div>
          ))}
          {statError && <span className="inline-edit-error">{statError}</span>}
        </div>

        <div className="stalls-card">
          <span className="stalls-title">Stalls</span>
          {(stalls ?? []).map((stall, index) => (
            <div className="stall-row" key={index}>
              {editingStall?.index === index && editingStall?.field === 'date' ? (
                <span className="inline-edit-row">
                  <input
                    type="text"
                    className="inline-edit-input stall-date-input"
                    value={editStallValue}
                    autoFocus
                    onChange={(e) => setEditStallValue(e.target.value)}
                    onKeyDown={(e) => handleStallKeyDown(e, index, 'date')}
                    aria-label={`Edit stall ${index + 1} date`}
                  />
                  <button
                    type="button"
                    className="inline-edit-confirm-btn"
                    aria-label={`Save stall ${index + 1} date`}
                    onClick={() => commitStall(index, 'date')}
                  >
                    <TickIcon />
                  </button>
                </span>
              ) : (
                <span
                  className="stall-date"
                  onDoubleClick={() => startEditingStall(index, 'date')}
                  title="Double-click to edit"
                >
                  {stall.date}
                  {savingStall?.index === index && savingStall?.field === 'date' && (
                    <span className="inline-edit-saving"> ⋯</span>
                  )}
                </span>
              )}

              {editingStall?.index === index && editingStall?.field === 'place' ? (
                <span className="inline-edit-row">
                  <input
                    type="text"
                    className="inline-edit-input stall-place-input"
                    value={editStallValue}
                    autoFocus
                    onChange={(e) => setEditStallValue(e.target.value)}
                    onKeyDown={(e) => handleStallKeyDown(e, index, 'place')}
                    aria-label={`Edit stall ${index + 1} place`}
                  />
                  <button
                    type="button"
                    className="inline-edit-confirm-btn"
                    aria-label={`Save stall ${index + 1} place`}
                    onClick={() => commitStall(index, 'place')}
                  >
                    <TickIcon />
                  </button>
                </span>
              ) : (
                <span
                  className="stall-place"
                  onDoubleClick={() => startEditingStall(index, 'place')}
                  title="Double-click to edit"
                >
                  {stall.place}
                  {savingStall?.index === index && savingStall?.field === 'place' && (
                    <span className="inline-edit-saving"> ⋯</span>
                  )}
                </span>
              )}
            </div>
          ))}
          {stallError && <span className="inline-edit-error">{stallError}</span>}
        </div>

        <div className="gst-widget">
          <a href={GST_URL} rel="noopener noreferrer" aria-label="Open GST portal">
            <img src={`${BASE_URL}gst.png`} alt="GSTIN" className="gst-logo" />
          </a>
          <div className="gst-info">
            <div className="gst-month">{monthYearLabel}</div>
            <div className="gst-toggles">
              <div className="gst-toggle-item">
                <span className="gst-toggle-label">GSTR-1</span>
                <input
                  type="checkbox"
                  id="gstr1Toggle"
                  className="gst-toggle-input"
                  checked={gstState.gstr1}
                  disabled={gstState.gstr1}
                  onChange={() => handleGstToggle('gstr1')}
                />
                <label htmlFor="gstr1Toggle" className="toggleSwitch"></label>
              </div>
              <div className="gst-toggle-item">
                <span className="gst-toggle-label">GSTR-3B</span>
                <input
                  type="checkbox"
                  id="gstr3bToggle"
                  className="gst-toggle-input"
                  checked={gstState.gstr3b}
                  disabled={gstState.gstr3b}
                  onChange={() => handleGstToggle('gstr3b')}
                />
                <label htmlFor="gstr3bToggle" className="toggleSwitch"></label>
              </div>
            </div>
          </div>
          {gstError && <span className="inline-edit-error">{gstError}</span>}
        </div>
      </aside>
    </div>
  )
}

export default App
