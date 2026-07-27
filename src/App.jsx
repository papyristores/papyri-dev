import { useState } from 'react'
import './App.css'

const BASE_URL = import.meta.env.BASE_URL

const BACKGROUND_IMAGE_URL = `${BASE_URL}wallpaper.png`

const GST_URL = 'https://www.gst.gov.in/'
const GST_STORAGE_KEY = 'gst-return-toggles'

const getPeriodKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

const getMonthYearLabel = (date) =>
  date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()

const loadGstState = () => {
  const currentPeriod = getPeriodKey(new Date())
  let stored = null
  try {
    stored = JSON.parse(localStorage.getItem(GST_STORAGE_KEY))
  } catch {
    stored = null
  }
  if (!stored || stored.period !== currentPeriod) {
    const fresh = { period: currentPeriod, gstr1: false, gstr3b: false }
    localStorage.setItem(GST_STORAGE_KEY, JSON.stringify(fresh))
    return fresh
  }
  return stored
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

function App() {
  const [query, setQuery] = useState('')
  const [gstState, setGstState] = useState(loadGstState)
  const monthYearLabel = getMonthYearLabel(new Date())

  const handleGstToggle = (key) => {
    setGstState((prev) => {
      if (prev[key]) return prev
      const next = { ...prev, [key]: true }
      localStorage.setItem(GST_STORAGE_KEY, JSON.stringify(next))
      return next
    })
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

  // style={{ backgroundImage: `url(${BACKGROUND_IMAGE_URL})` }}
  return (
    <div
      className="page"
    >
      <div className="overlay" />

      <main className="content">
        <form className="search-bar" onSubmit={handleSubmit} role="search">
          <input
            type="text"
            className="search-input"
            placeholder="Search the web"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
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
          <button
            type="submit"
            className="icon-btn search-icon-btn"
            aria-label="Search"
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              aria-hidden="true"
              focusable="false"
            >
              <path
                fill="currentColor"
                d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z"
              />
            </svg>
          </button>
        </form>

        <div className="link-panel">
          <a
            href={FIGMA_TEAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Figma team"
          >
            <img
              src={`${BASE_URL}figma-logo.png`}
              alt="Figma logo"
              className="figma-logo"
            />
          </a>
          <div className="link-grid">
            {LINKS.map((link) => {
              const className = `link-btn${link.signature ? ' signature-btn' : ''}`
              return link.href ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  {link.label}
                </a>
              ) : (
                <button key={link.label} type="button" className={className}>
                  {link.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="sheet-panel">
          <a
            href={SHEETS_LOGO_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Google Sheets"
          >
            <img
              src={`${BASE_URL}spreadsheet.png`}
              alt="Google Sheets"
              className="spreadsheet-logo"
            />
          </a>
          <div className="sheet-grid">
            {SHEETS.map((sheet) => (
              <a
                key={sheet.label}
                href={sheet.href}
                target="_blank"
                rel="noopener noreferrer"
                className="sheet-btn"
              >
                <img
                  src={`${BASE_URL}excel-document.png`}
                  alt=""
                  className="sheet-icon"
                />
                <span className="sheet-label">{sheet.label}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="apps-panel">
          <div className="notion-card">
            <a
              href={NOTION_LOGO_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Notion"
            >
              <img
                src={`${BASE_URL}notion-logo.png`}
                alt="Notion"
                className="notion-card-logo"
              />
            </a>
            <ul className="notion-list">
              {NOTION_LINKS.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="notion-list-link"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="apps-icon-row">
            <div className="button-container">
              <a
                href={OPENAI_URL}
                target="_blank"
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

            <a
              href={PINTEREST_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="app-icon-link"
              aria-label="Open Pinterest"
            >
              <img
                src={`${BASE_URL}pinterest.png`}
                alt="Pinterest"
                className="app-icon-img"
              />
            </a>

            <a
              href={TRELLO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="app-icon-link"
              aria-label="Open Trello"
            >
              <img
                src={`${BASE_URL}trello.png`}
                alt="Trello"
                className="app-icon-img"
              />
            </a>

            <a
              href={AMAZON_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="app-icon-link"
              aria-label="Open Amazon Seller Central"
            >
              <img
                src={`${BASE_URL}amazon.png`}
                alt="Amazon"
                className="app-icon-img"
              />
            </a>

            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="app-icon-link"
              aria-label="Open GitHub"
            >
              <img
                src={`${BASE_URL}github.png`}
                alt="GitHub"
                className="app-icon-img"
              />
            </a>

            <a
              href={NOTION_CALENDAR_URL}
              target="_blank"
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
        </div>

        <div className="gst-widget">
          <a
            href={GST_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open GST portal"
          >
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
        </div>
      </main>
    </div>
  )
}

export default App
