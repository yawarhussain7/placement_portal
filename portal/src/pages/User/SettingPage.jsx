import { useState } from 'react'
import Template from '../../components/common/Template'
import { Bell, FileText, LockKeyhole, Monitor, Moon, RotateCcw, Save, Sun, UserRound } from 'lucide-react'
import { useAppearance } from '../../context/AppearanceContext'
import { usePortalData } from '../../context/PortalDataContext'

export const SettingPage = () => {
  const { appearance, setAppearance } = useAppearance()
  const { data, updateAccount, updatePreferences, resetPortalData } = usePortalData()
  const [active, setActive] = useState('Account')
  const [account, setAccount] = useState(data.account)
  const [preferences, setPreferences] = useState(data.preferences)
  const [saved, setSaved] = useState(false)

  const toggle = (key) => setPreferences((current) => ({ ...current, [key]: !current[key] }))
  const save = () => {
    updateAccount(account)
    updatePreferences(preferences)
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }

  const nav = [
    { label: 'Account', icon: UserRound },
    { label: 'Notifications', icon: Bell },
    { label: 'Documents', icon: FileText },
    { label: 'Security', icon: LockKeyhole },
  ]

  return (
    <Template title="Settings" description="Manage your WebMantis portal preferences">
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4 sm:gap-5">
        {/* Side nav */}
        <aside className="card border rounded-lg p-3 sm:p-4 h-fit overflow-x-auto">
          <div className="flex lg:flex-col gap-1">
            {nav.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => setActive(label)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
                  active === label ? 'bg-accent-subtle text-accent' : 'text-secondary hover:bg-subtle hover:text-primary'
                }`}
              >
                <Icon size={16} className="sm:size-[17px] flex-shrink-0" />
                {label}
              </button>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main className="space-y-4 sm:space-y-5">
          {active === 'Account' && (
            <section className="card border rounded-lg overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-base">
                <h2 className="text-sm sm:text-base font-bold text-primary">Account Details</h2>
                <p className="text-xs text-muted mt-1">Primary contact details used by WebMantis advisors.</p>
              </div>
              <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {[
                  ['fullName', 'Full Name'],
                  ['email', 'Email Address'],
                  ['phone', 'Phone Number'],
                ].map(([key, label]) => (
                  <label key={key} className="space-y-1.5">
                    <span className="text-xs font-bold text-primary">{label}</span>
                    <input className="input-base w-full border rounded-lg px-3 py-2 text-xs sm:text-sm" value={account[key]} onChange={(event) => setAccount((current) => ({ ...current, [key]: event.target.value }))} />
                  </label>
                ))}
                <label className="space-y-1.5">
                  <span className="text-xs font-bold text-primary">Preferred Advisor Region</span>
                  <select className="input-base w-full border rounded-lg px-3 py-2 text-xs sm:text-sm" value={account.region} onChange={(event) => setAccount((current) => ({ ...current, region: event.target.value }))}>
                    <option>Australia Placement Team</option>
                    <option>Remote Placement Team</option>
                    <option>International Student Support</option>
                  </select>
                </label>
              </div>
            </section>
          )}

          {active === 'Notifications' && (
            <section className="card border rounded-lg overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-base">
                <h2 className="text-sm sm:text-base font-bold text-primary">Notification Preferences</h2>
                <p className="text-xs text-muted mt-1">Choose what WebMantis should send to your inbox.</p>
              </div>
              <div className="divide-y divide-base">
                {[
                  ['applicationUpdates', 'Application status updates', 'Submitted, reviewed, shortlisted, and interview changes.'],
                  ['advisorMessages', 'Advisor messages', 'New replies from placement advisors and support staff.'],
                  ['documentReviews', 'Document review results', 'Verification approvals and required document fixes.'],
                  ['marketing', 'Company news', 'Product updates and WebMantis announcements.'],
                ].map(([key, title, desc]) => (
                  <div key={key} className="p-4 sm:p-5 flex items-center justify-between gap-3 sm:gap-4">
                    <div className="min-w-0">
                      <p className="text-sm sm:text-base font-semibold text-primary">{title}</p>
                      <p className="text-xs sm:text-sm text-secondary mt-1">{desc}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggle(key)}
                      className={`relative inline-flex h-6 w-11 rounded-full transition-colors flex-shrink-0 ${preferences[key] ? 'bg-accent' : 'bg-muted'}`}
                      aria-label={`Toggle ${title}`}
                    >
                      <span className={`h-5 w-5 rounded-full bg-white shadow mt-0.5 transition-transform ${preferences[key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {active === 'Documents' && (
            <section className="card border rounded-lg p-4 sm:p-5">
              <h2 className="text-sm sm:text-base font-bold text-primary">Document Rules</h2>
              <p className="text-xs sm:text-sm text-secondary mt-2">The portal currently stores {data.documents.length} document records. Uploaded documents are immediately available in the Documents page and reflected on the dashboard.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 sm:mt-5">
                {['Resume / CV', 'Photo ID', 'Academic Transcript'].map((item) => (
                  <div key={item} className="border border-base rounded-lg p-3 sm:p-4">
                    <p className="text-xs sm:text-sm font-bold text-primary">{item}</p>
                    <p className="text-[11px] sm:text-xs text-muted mt-1">Required for final employer submission.</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {active === 'Security' && (
            <section className="card border rounded-lg p-4 sm:p-5 space-y-4 sm:space-y-5">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-primary">Security</h2>
                <p className="text-xs sm:text-sm text-secondary mt-2">Demo controls for a real portal security section.</p>
              </div>
              <label className="space-y-1.5 block max-w-md">
                <span className="text-xs font-bold text-primary">New Password</span>
                <input type="password" className="input-base w-full border rounded-lg px-3 py-2 text-xs sm:text-sm" placeholder="Minimum 8 characters" />
              </label>
              <button className="px-3 sm:px-4 py-2 border border-base rounded-lg text-xs sm:text-sm font-bold text-secondary hover:bg-subtle transition-colors">Send Verification Email</button>
            </section>
          )}

          {/* Appearance */}
          <section className="card border rounded-lg overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-base">
              <h2 className="text-sm sm:text-base font-bold text-primary">Appearance</h2>
              <p className="text-xs text-muted mt-1">Set the portal theme for this browser.</p>
            </div>
            <div className="p-4 sm:p-5 flex flex-wrap gap-2 sm:gap-3">
              {[
                { value: 'light', label: 'Light', icon: Sun },
                { value: 'dark', label: 'Dark', icon: Moon },
                { value: 'system', label: 'System', icon: Monitor },
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setAppearance((current) => ({ ...current, theme: value }))}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border text-xs sm:text-sm font-bold transition-colors ${
                    appearance.theme === value ? 'border-accent bg-accent-subtle text-accent' : 'border-base text-secondary hover:bg-subtle'
                  }`}
                >
                  <Icon size={15} className="sm:size-4" />
                  {label}
                </button>
              ))}
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <button onClick={resetPortalData} className="inline-flex items-center justify-center gap-2 border border-base text-secondary px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold hover:bg-subtle transition-colors">
              <RotateCcw size={15} className="sm:size-4" />
              Reset Demo Data
            </button>
            <div className="flex items-center justify-end gap-3">
              {saved && <span className="text-xs sm:text-sm font-semibold text-accent animate-in fade-in">Saved</span>}
              <button onClick={save} className="inline-flex items-center justify-center gap-2 bg-accent hover-accent text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors">
                <Save size={15} className="sm:size-4" />
                Save Settings
              </button>
            </div>
          </div>
        </main>
      </div>
    </Template>
  )
}