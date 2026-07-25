import { useState } from 'react'
import Template from '../../components/common/Template'
import { Bell, FileText, LockKeyhole, Monitor, Moon, RotateCcw, Save, Sun, UserRound, Mail, Phone, Globe } from 'lucide-react'
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
        <aside className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 sm:p-4 h-fit">
          <div className="flex lg:flex-col gap-1">
            {nav.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => setActive(label)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
                  active === label 
                    ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-500' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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
            <section className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-200">
                <h2 className="text-base font-bold text-gray-900">Account Details</h2>
                <p className="text-xs text-gray-500 mt-1">Primary contact details used by WebMantis advisors.</p>
              </div>
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 block">Full Name</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <UserRound size={18} />
                    </div>
                    <input 
                      className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" 
                      value={account.fullName} 
                      onChange={(event) => setAccount((current) => ({ ...current, fullName: event.target.value }))} 
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 block">Email Address</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Mail size={18} />
                    </div>
                    <input 
                      className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" 
                      value={account.email} 
                      onChange={(event) => setAccount((current) => ({ ...current, email: event.target.value }))} 
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 block">Phone Number</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Phone size={18} />
                    </div>
                    <input 
                      className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" 
                      value={account.phone} 
                      onChange={(event) => setAccount((current) => ({ ...current, phone: event.target.value }))} 
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 block">Preferred Advisor Region</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Globe size={18} />
                    </div>
                    <select 
                      className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 appearance-none bg-white"
                      value={account.region} 
                      onChange={(event) => setAccount((current) => ({ ...current, region: event.target.value }))}
                    >
                      <option>Australia Placement Team</option>
                      <option>Remote Placement Team</option>
                      <option>International Student Support</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>
          )}

          {active === 'Notifications' && (
            <section className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-200">
                <h2 className="text-base font-bold text-gray-900">Notification Preferences</h2>
                <p className="text-xs text-gray-500 mt-1">Choose what WebMantis should send to your inbox.</p>
              </div>
              <div className="divide-y divide-gray-100">
                {[
                  ['applicationUpdates', 'Application status updates', 'Submitted, reviewed, shortlisted, and interview changes.'],
                  ['advisorMessages', 'Advisor messages', 'New replies from placement advisors and support staff.'],
                  ['documentReviews', 'Document review results', 'Verification approvals and required document fixes.'],
                  ['marketing', 'Company news', 'Product updates and WebMantis announcements.'],
                ].map(([key, title, desc]) => (
                  <div key={key} className="p-5 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{title}</p>
                      <p className="text-xs text-gray-500 mt-1">{desc}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggle(key)}
                      className={`relative inline-flex h-6 w-11 rounded-full transition-colors flex-shrink-0 ${preferences[key] ? 'bg-emerald-600' : 'bg-gray-200'}`}
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
            <section className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
              <h2 className="text-base font-bold text-gray-900">Document Rules</h2>
              <p className="text-sm text-gray-600 mt-2">The portal currently stores {data.documents.length} document records. Uploaded documents are immediately available in the Documents page and reflected on the dashboard.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
                {['Resume / CV', 'Photo ID', 'Academic Transcript'].map((item) => (
                  <div key={item} className="border border-gray-200 rounded-lg p-4">
                    <p className="text-sm font-bold text-gray-900">{item}</p>
                    <p className="text-xs text-gray-500 mt-1">Required for final employer submission.</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {active === 'Security' && (
            <section className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 space-y-5">
              <div>
                <h2 className="text-base font-bold text-gray-900">Security</h2>
                <p className="text-sm text-gray-600 mt-2">Demo controls for a real portal security section.</p>
              </div>
              <label className="space-y-1.5 block max-w-md">
                <span className="text-xs font-bold text-gray-700">New Password</span>
                <input type="password" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" placeholder="Minimum 8 characters" />
              </label>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">Send Verification Email</button>
            </section>
          )}

          {/* Appearance */}
          <section className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-200">
              <h2 className="text-base font-bold text-gray-900">Appearance</h2>
              <p className="text-xs text-gray-500 mt-1">Set the portal theme for the browser.</p>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { value: 'light', label: 'Light', icon: Sun },
                { value: 'dark', label: 'Dark', icon: Moon },
                { value: 'system', label: 'System', icon: Monitor },
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setAppearance((current) => ({ ...current, theme: value }))}
                  className={`flex flex-col items-center justify-center gap-3 p-6 rounded-lg border-2 transition-all ${
                    appearance.theme === value 
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="relative">
                    <Icon size={28} />
                    {appearance.theme === value && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-600 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-semibold">{label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <button onClick={resetPortalData} className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
              <RotateCcw size={16} />
              Reset Demo Data
            </button>
            <div className="flex items-center justify-end gap-3">
              {saved && <span className="text-sm font-semibold text-emerald-700">Saved</span>}
              <button onClick={save} className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm">
                <Save size={16} />
                Save Settings
              </button>
            </div>
          </div>
        </main>
      </div>
    </Template>
  )
}
