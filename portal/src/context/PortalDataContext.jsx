/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { getDashboardData, toggleTask as toggleTaskApi, createTicket as createTicketApi } from '../Api/dashboardApi.js'
import { getDocuments as getDocumentsApi, uploadDocument as uploadDocumentApi, replaceDocument as replaceDocumentApi, deleteDocument as deleteDocumentApi } from '../Api/documentApi.js'
import { getConversations as getConversationsApi, createOrGetConversation as createConversationApi, sendMessage as sendConversationMessageApi } from '../Api/conversationApi.js'

const PortalDataContext = createContext(null)

const today = new Date().toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' })

const defaultData = {
  account: {
    fullName: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    phone: '+61 412 345 678',
    region: 'Australia Placement Team',
  },
  preferences: {
    applicationUpdates: true,
    advisorMessages: true,
    documentReviews: true,
    marketing: false,
  },
  applications: [
    {
      id: 'WM-PL-1042',
      role: 'Frontend Developer Internship',
      company: 'Northbridge Digital',
      status: 'Interview Scheduled',
      stage: 'Interview',
      date: '18 Jun 2026',
      advisor: 'Sarah Mitchell',
      progress: 72,
      notes: 'Prepare portfolio examples and a short intro.',
    },
    {
      id: 'WM-PL-1031',
      role: 'Junior QA Analyst',
      company: 'BrightLabs Studio',
      status: 'Documents Under Review',
      stage: 'Screening',
      date: '14 Jun 2026',
      advisor: 'Hamza Khan',
      progress: 46,
      notes: 'Waiting for transcript verification.',
    },
    {
      id: 'WM-PL-1018',
      role: 'UI/UX Design Assistant',
      company: 'Crafton Systems',
      status: 'Submitted',
      stage: 'Application',
      date: '11 Jun 2026',
      advisor: 'Ava Collins',
      progress: 28,
      notes: 'Initial application submitted.',
    },
  ],
  documents: [
    { id: 'resume', title: 'Resume / CV', type: 'PDF', status: 'Verified', updated: '09 Jun 2026', fileName: 'Alex_Morgan_Resume.pdf' },
    { id: 'id', title: 'Photo ID', type: 'PNG', status: 'Verified', updated: '08 Jun 2026', fileName: 'Photo_ID.png' },
    { id: 'transcript', title: 'Academic Transcript', type: 'PDF', status: 'Needs Update', updated: '03 Jun 2026', fileName: 'Transcript_2025.pdf' },
    { id: 'cover', title: 'Cover Letter', type: 'DOCX', status: 'Optional', updated: 'Not uploaded', fileName: '' },
  ],
  threads: [
    {
      id: 1,
      name: 'Sarah Mitchell',
      role: 'Placement Advisor',
      subject: 'Interview preparation',
      time: '10:42 AM',
      unread: true,
      messages: [
        { from: 'Sarah Mitchell', body: 'Your Northbridge interview is confirmed. Please review the role brief and prepare two project examples.', own: false, time: '10:42 AM' },
        { from: 'You', body: 'Thanks Sarah. I will upload the updated resume and confirm my availability today.', own: true, time: '10:49 AM' },
        { from: 'Sarah Mitchell', body: 'Perfect. I will send the employer your final document pack after the update.', own: false, time: '10:53 AM' },
      ],
    },
    {
      id: 2,
      name: 'Documents Team',
      role: 'Verification',
      subject: 'Transcript update required',
      time: 'Yesterday',
      unread: true,
      messages: [
        { from: 'Documents Team', body: 'Your transcript file is readable, but it looks older than the latest semester. Please replace it when ready.', own: false, time: 'Yesterday' },
      ],
    },
  ],
  tasks: [
    { id: 1, title: 'Upload updated academic transcript', due: 'Due today', urgent: true, done: false },
    { id: 2, title: 'Confirm Northbridge interview time', due: 'Due 12 Jun', urgent: false, done: false },
  ],
  tickets: [
    { id: 'WM-HLP-221', subject: 'Need help with document verification', status: 'Open', date: '09 Jun 2026' },
  ],
  activity: [
    { id: 1, type: 'document', title: 'Resume verified', detail: 'Documents team approved your latest resume.' },
    { id: 2, type: 'message', title: 'Advisor message received', detail: 'Sarah shared interview preparation notes.' },
    { id: 3, type: 'application', title: 'Application submitted', detail: 'Frontend Developer Internship sent to Northbridge Digital.' },
  ],
}

export function PortalDataProvider({ children }) {
  const [data, setData] = useState(defaultData)
  const [loading, setLoading] = useState(true)
  const [apiAvailable, setApiAvailable] = useState(false)

  // Read auth token from localStorage to detect login/logout changes
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('auth_token'))

  // Listen for auth token changes (login/logout in other tabs/windows too)
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'auth_token') {
        setAuthToken(e.newValue)
      }
    }

    // Custom event fired directly by SignInForm/SignUpForm for immediate refresh
    const handleCustomEvent = () => {
      const current = localStorage.getItem('auth_token')
      setAuthToken(current)
    }

    // Poll for auth token changes (backup for non-reactive scenarios)
    const interval = setInterval(() => {
      const current = localStorage.getItem('auth_token')
      setAuthToken((prev) => (prev !== current ? current : prev))
    }, 1000)

    window.addEventListener('storage', handleStorage)
    window.addEventListener('auth-token-changed', handleCustomEvent)
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('auth-token-changed', handleCustomEvent)
      clearInterval(interval)
    }
  }, [])

  // Fetch all data from backend whenever auth token changes
  // This ensures fresh data loads when logging in as a different user
  useEffect(() => {
    const fetchAllData = async () => {
      if (!authToken) {
        // No auth token → reset to defaults (logged out state)
        setData(defaultData)
        setLoading(false)
        setApiAvailable(false)
        return
      }

      setLoading(true)
      setData(defaultData) // Reset to defaults first to clear stale data
      try {
        const [dashboardRes, conversationsRes] = await Promise.allSettled([
          getDashboardData(),
          getConversationsApi(),
        ])

        // Dashboard data
        if (dashboardRes.status === 'fulfilled' && dashboardRes.value?.data?.success && dashboardRes.value?.data?.data) {
          const apiData = dashboardRes.value.data.data
          setData((prev) => ({
            ...prev,
            account: { ...prev.account, ...apiData.account },
            applications: apiData.applications?.length ? apiData.applications : prev.applications,
            documents: apiData.documents?.length ? apiData.documents : prev.documents,
            tasks: apiData.tasks?.length ? apiData.tasks : prev.tasks,
            tickets: apiData.tickets?.length ? apiData.tickets : prev.tickets,
            activity: apiData.activity?.length ? apiData.activity : prev.activity,
          }))
          setApiAvailable(true)
        }

        // Conversations (shared two-way messaging)
        if (conversationsRes.status === 'fulfilled' && conversationsRes.value?.data?.success && Array.isArray(conversationsRes.value.data.data)) {
          setData((prev) => ({
            ...prev,
            threads: conversationsRes.value.data.data,
          }))
        }
      } catch {
        console.warn('API unavailable, using default data')
      } finally {
        setLoading(false)
      }
    }

    fetchAllData()
  }, [authToken])

  const addActivity = (title, detail, type = 'application') => {
    setData((current) => ({
      ...current,
      activity: [{ id: Date.now(), title, detail, type }, ...current.activity].slice(0, 8),
    }))
  }

  const actions = useMemo(() => ({
    updateAccount: (account) => setData((current) => ({ ...current, account })),
    updatePreferences: (preferences) => setData((current) => ({ ...current, preferences })),
    updateApplication: (id, changes) => {
      setData((current) => ({
        ...current,
        applications: current.applications.map((app) => app.id === id ? { ...app, ...changes } : app),
      }))
      addActivity('Application updated', `${changes.role || 'Placement application'} details were changed.`, 'application')
    },
    addApplication: (application) => {
      const id = `WM-PL-${Math.floor(1100 + Math.random() * 800)}`
      setData((current) => ({
        ...current,
        applications: [{ ...application, id, date: today, status: 'Draft', stage: 'Draft', progress: 12 }, ...current.applications],
        activity: [{ id: Date.now(), type: 'application', title: 'Application draft created', detail: `${application.role} added for ${application.company}.` }, ...current.activity],
      }))
    },
    uploadDocument: async (id, file) => {
      if (!file) return
      try {
        // Try backend API first
        if (apiAvailable) {
          await replaceDocumentApi(id, file)
        }
      } catch {
        // Fall back to local
      }
      const type = file.name.split('.').pop()?.toUpperCase() || 'FILE'
      setData((current) => ({
        ...current,
        documents: current.documents.map((doc) => doc.id === id ? { ...doc, type, fileName: file.name, status: 'Uploaded', updated: today } : doc),
        activity: [{ id: Date.now(), type: 'document', title: 'Document uploaded', detail: `${file.name} was added to the document library.` }, ...current.activity],
      }))
    },
    addDocument: async (file) => {
      if (!file) return
      try {
        // Try backend API first
        if (apiAvailable) {
          const response = await uploadDocumentApi(file)
          if (response?.data?.success && response?.data?.data) {
            const newDoc = response.data.data
            setData((current) => ({
              ...current,
              documents: [newDoc, ...current.documents],
              activity: [{ id: Date.now(), type: 'document', title: 'Document uploaded', detail: `${file.name} was added to the document library.` }, ...current.activity],
            }))
            return
          }
        }
      } catch {
        // Fall back to local
      }
      const type = file.name.split('.').pop()?.toUpperCase() || 'FILE'
      setData((current) => ({
        ...current,
        documents: [{ id: `doc-${Date.now()}`, title: file.name.replace(/\.[^.]+$/, ''), type, status: 'Uploaded', updated: today, fileName: file.name }, ...current.documents],
      }))
    },
    verifyDocument: (id) => setData((current) => ({
      ...current,
      documents: current.documents.map((doc) => doc.id === id ? { ...doc, status: 'Verified', updated: today } : doc),
    })),
    removeDocument: async (id) => {
      try {
        // Try backend API first
        if (apiAvailable) {
          await deleteDocumentApi(id)
        }
      } catch {
        // Fall back to local
      }
      setData((current) => ({
        ...current,
        documents: current.documents.filter((doc) => doc.id !== id),
        activity: [{ id: Date.now(), type: 'document', title: 'Document deleted', detail: `Document was removed.` }, ...current.activity],
      }))
    },
    refreshDocuments: async () => {
      try {
        const response = await getDocumentsApi()
        if (response?.data?.success && response?.data?.data) {
          setData((current) => ({
            ...current,
            documents: response.data.data,
          }))
          setApiAvailable(true)
        }
      } catch {
        // Backend not available
      }
    },
    createThread: async (name, role, subject, message, participantId) => {
      // Use the shared conversation API if available
      if (apiAvailable && participantId) {
        try {
          const response = await createConversationApi(participantId, subject)
          if (response?.data?.success && response?.data?.data) {
            const conv = response.data.data
            const convId = conv._id?.toString() || conv.id
            // If it already existed, we need to refresh conversations
            if (response.data.existing) {
              // Refresh conversations to get the latest
              const refreshRes = await getConversationsApi()
              if (refreshRes?.data?.success && Array.isArray(refreshRes.data.data)) {
                setData((current) => ({
                  ...current,
                  threads: refreshRes.data.data,
                }))
              }
              return convId
            }
            // New conversation — add to local state
            const otherParticipantId = conv.participants?.find(
              (p) => p.toString() !== participantId.toString()
            )
            const otherName = conv.participantNames?.[otherParticipantId?.toString()] || name
            const newThread = {
              id: convId,
              name: otherName,
              role: role || 'Registered User',
              subject: conv.subject || subject || 'New conversation',
              time: 'Just now',
              unread: false,
              messages: [],
            }
            setData((current) => ({
              ...current,
              threads: [newThread, ...current.threads],
              activity: [{ id: Date.now(), type: 'message', title: 'New conversation', detail: `Started conversation with ${otherName}` }, ...current.activity],
            }))
            return convId
          }
        } catch {
          // fall through to local
        }
      }

      // Fallback: local-only thread
      const newId = Date.now()
      const newThread = {
        id: newId,
        name,
        role: role || 'Registered User',
        subject: subject || 'New conversation',
        time: 'Just now',
        unread: false,
        messages: message
          ? [{ from: 'You', body: message, own: true, time: 'Just now' }]
          : [{ from: name, body: `Conversation started with ${name}`, own: false, time: 'Just now' }],
      }
      setData((current) => ({
        ...current,
        threads: [newThread, ...current.threads],
        activity: [{ id: Date.now(), type: 'message', title: 'New conversation', detail: `Started conversation with ${name}` }, ...current.activity],
      }))
      return newId
    },
    markThreadRead: (id) => setData((current) => ({
      ...current,
      threads: current.threads.map((thread) => thread.id === id ? { ...thread, unread: false } : thread),
    })),
    sendMessage: async (threadId, body) => {
      if (!body.trim()) return

      // Try shared conversation API first
      if (apiAvailable) {
        try {
          await sendConversationMessageApi(threadId, body)
        } catch {
          // fall through to local
        }
      }

      setData((current) => ({
        ...current,
        threads: current.threads.map((thread) => thread.id === threadId ? {
          ...thread,
          time: 'Just now',
          unread: false,
          messages: [...thread.messages, { from: 'You', body: body.trim(), own: true, time: 'Just now' }],
        } : thread),
        activity: [{ id: Date.now(), type: 'message', title: 'Message sent', detail: body.trim().slice(0, 80) }, ...current.activity],
      }))
    },
    receiveMessage: (conversationId, message) => {
      if (!conversationId || !message) return
      setData((current) => {
        const threadExists = current.threads.some((t) => t.id?.toString() === conversationId?.toString())
        if (!threadExists) {
          // If the thread doesn't exist locally, trigger dashboard data fetch to retrieve the thread
          getDashboardData()
            .then(res => {
              if (res?.data?.success && res?.data?.data) {
                const apiData = res.data.data
                setData(prev => ({
                  ...prev,
                  account: { ...prev.account, ...apiData.account },
                  applications: apiData.applications?.length ? apiData.applications : prev.applications,
                  documents: apiData.documents?.length ? apiData.documents : prev.documents,
                  threads: apiData.threads?.length ? apiData.threads : prev.threads,
                  tasks: apiData.tasks?.length ? apiData.tasks : prev.tasks,
                  tickets: apiData.tickets?.length ? apiData.tickets : prev.tickets,
                  activity: apiData.activity?.length ? apiData.activity : prev.activity,
                }))
              }
            })
            .catch(() => {})
          return current
        }

        return {
          ...current,
          threads: current.threads.map((thread) => {
            if (thread.id?.toString() === conversationId?.toString()) {
              // Avoid duplicates
              const msgExists = thread.messages.some((m) => 
                (m._id && m._id === message._id) || 
                (m.body === message.body && m.from === message.from)
              )
              if (msgExists) return thread
              
              return {
                ...thread,
                time: message.time || 'Just now',
                unread: true,
                messages: [...thread.messages, {
                  _id: message._id,
                  from: message.from,
                  body: message.body,
                  own: message.own || false,
                  time: message.time || 'Just now'
                }]
              }
            }
            return thread
          })
        }
      })
    },
    receiveConversation: (conversation) => {
      if (!conversation) return
      setData((current) => {
        const threadId = conversation.id?.toString() || conversation._id?.toString()
        const threadExists = current.threads.some((t) => t.id?.toString() === threadId)
        if (threadExists) return current

        const newThread = {
          id: threadId,
          name: conversation.name,
          role: conversation.role || 'Registered User',
          subject: conversation.subject || 'New conversation',
          time: conversation.time || 'Just now',
          unread: conversation.unread ?? true,
          messages: conversation.messages || []
        }

        return {
          ...current,
          threads: [newThread, ...current.threads],
          activity: [
            { id: Date.now(), type: 'message', title: 'New conversation', detail: `Started conversation with ${conversation.name}` },
            ...current.activity
          ]
        }
      })
    },
    completeTask: async (id) => {
      // Try API toggle, fall back to local
      if (apiAvailable) {
        try {
          await toggleTaskApi(id)
        } catch {
          // fall through to local
        }
      }

      setData((current) => ({
        ...current,
        tasks: current.tasks.map((task) => task.id === id ? { ...task, done: !task.done } : task),
      }))
    },
    createTicket: async (subject) => {
      if (!subject.trim()) return

      // Try API, fall back to local
      if (apiAvailable) {
        try {
          await createTicketApi(subject)
        } catch {
          // fall through to local
        }
      }

      setData((current) => ({
        ...current,
        tickets: [{ id: `WM-HLP-${Math.floor(300 + Math.random() * 600)}`, subject: subject.trim(), status: 'Open', date: today }, ...current.tickets],
      }))
    },
    resetPortalData: () => setData(defaultData),
    refreshDashboard: async () => {
      try {
        const response = await getDashboardData()
        if (response?.data?.success && response?.data?.data) {
          const apiData = response.data.data
          setData((prev) => ({
            ...prev,
            account: { ...prev.account, ...apiData.account },
            applications: apiData.applications?.length ? apiData.applications : prev.applications,
            documents: apiData.documents?.length ? apiData.documents : prev.documents,
            threads: apiData.threads?.length ? apiData.threads : prev.threads,
            tasks: apiData.tasks?.length ? apiData.tasks : prev.tasks,
            tickets: apiData.tickets?.length ? apiData.tickets : prev.tickets,
            activity: apiData.activity?.length ? apiData.activity : prev.activity,
          }))
          setApiAvailable(true)
        }
      } catch {
        // Backend not available
      }
    },
  }), [apiAvailable])

  const value = useMemo(() => ({ data, loading, ...actions }), [data, loading, actions])

  return (
    <PortalDataContext.Provider value={value}>
      {children}
    </PortalDataContext.Provider>
  )
}

export const usePortalData = () => useContext(PortalDataContext)