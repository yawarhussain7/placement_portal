/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { getProfile } from '../Api/profileApi.js'
import { getMyApplications, getApplicationStats } from '../Api/application.js'
import { 
  getMyDocuments, 
  uploadDocument as uploadDocumentApi, 
  deleteDocument as deleteDocumentApi,
  verifyDocument as verifyDocumentApi,
  updateDocument 
} from '../Api/document.js'

const PortalDataContext = createContext(null)

const defaultData = {
  account: {
    fullName: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    phone: '+61 412 345 678',
    region: 'Australia Placement Team',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
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
  const [profileLoaded, setProfileLoaded] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Fetch profile data from backend (uses cookie-based auth)
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getProfile()
        if (response?.data?.success && response?.data?.data) {
          const userData = response.data.data
          
          // Update account data with real user profile
          setData((current) => ({
            ...current,
            account: {
              ...current.account,
              fullName: userData.fullName || current.account.fullName,
              email: userData.email || current.account.email,
              avatar: userData.avatar || current.account.avatar,
              bio: userData.bio || current.account.bio,
              username: userData.username,
              phone: userData.phone,
              website: userData.website,
            },
          }))
          setProfileLoaded(true)
          setIsAuthenticated(true)
        } else {
          // No profile data returned - user is not logged in
          console.log('No profile data received from backend - user not authenticated')
          setProfileLoaded(false)
          setIsAuthenticated(false)
          // Reset to default data when not authenticated
          setData(defaultData)
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error)
        // User is not authenticated or profile fetch failed
        setProfileLoaded(false)
        setIsAuthenticated(false)
        // Reset to default data when not authenticated
        setData(defaultData)
      }
    }

    // Always try to fetch profile - backend will return 401 if not authenticated
    // The cookie is automatically sent with requests
    fetchUserProfile()

    // Listen for auth token changes
    const handleAuthChange = () => {
      fetchUserProfile()
    }

    window.addEventListener('auth-token-changed', handleAuthChange)
    
    return () => {
      window.removeEventListener('auth-token-changed', handleAuthChange)
    }
  }, [])

  // Helper functions to format backend data for frontend
  const formatStatus = (backendStatus) => {
    const statusMap = {
      'draft': 'Draft',
      'submitted': 'Submitted',
      'under_review': 'Documents Under Review',
      'shortlisted': 'Shortlisted',
      'interview_scheduled': 'Interview Scheduled',
      'accepted': 'Offer Received',
      'rejected': 'Not Selected',
      'withdrawn': 'Withdrawn'
    }
    return statusMap[backendStatus] || backendStatus
  }

  const formatStage = (backendStatus) => {
    const stageMap = {
      'draft': 'Draft',
      'submitted': 'Application',
      'under_review': 'Screening',
      'shortlisted': 'Shortlisted',
      'interview_scheduled': 'Interview',
      'accepted': 'Offer',
      'rejected': 'Closed',
      'withdrawn': 'Withdrawn'
    }
    return stageMap[backendStatus] || 'Application'
  }
  
  // Convert frontend status to backend status
  const toBackendStatus = (frontendStatus) => {
    const statusMap = {
      'Draft': 'draft',
      'Submitted': 'submitted',
      'Documents Under Review': 'under_review',
      'Shortlisted': 'shortlisted',
      'Interview Scheduled': 'interview_scheduled',
      'Offer Received': 'accepted',
      'Not Selected': 'rejected',
      'Withdrawn': 'withdrawn'
    }
    return statusMap[frontendStatus] || frontendStatus
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  // Map frontend document IDs to backend document types
  const mapDocumentType = (frontendId) => {
    const typeMap = {
      'resume': 'resume',
      'cv': 'cv',
      'id': 'photo_id',
      'transcript': 'transcript',
      'cover': 'cover_letter',
      'certificates': 'certificate',
      'additional': 'additional'
    }
    return typeMap[frontendId] || 'additional'
  }

  const calculateProgress = (status) => {
    const progressMap = {
      'draft': 12,
      'submitted': 28,
      'under_review': 46,
      'shortlisted': 65,
      'interview_scheduled': 72,
      'accepted': 95,
      'rejected': 100,
      'withdrawn': 100
    }
    return progressMap[status] || 0
  }

  // Fetch applications from backend
  useEffect(() => {
    const fetchApplications = async () => {
      if (!profileLoaded) return
      
      try {
        console.log('Fetching applications from backend...')
        const response = await getMyApplications()
        console.log('Applications API response:', response)
        
        if (response?.data?.success && response?.data?.data && response.data.data.length > 0) {
          console.log('Found applications:', response.data.data.length)
          const backendApplications = response.data.data.map(app => ({
            id: app._id,
            role: app.placementId?.course?.course || 'Placement Application',
            company: app.placementId?.personal?.fullName || 'Unknown Company',
            status: formatStatus(app.status),
            stage: formatStage(app.status),
            date: formatDate(app.createdAt),
            advisor: app.placementId?.personal?.fullName || 'Not assigned',
            progress: calculateProgress(app.status),
            notes: app.coverLetter || '',
            applicationId: app._id,
            placementId: app.placementId?._id,
            coverLetter: app.coverLetter,
            additionalInfo: app.additionalInfo,
            documents: app.documents,
            statusHistory: {
              submittedAt: app.submittedAt,
              reviewedAt: app.reviewedAt,
              respondedAt: app.respondedAt,
              interviewDate: app.interviewDate
            }
          }))
          
          setData((current) => ({
            ...current,
            applications: backendApplications
          }))
          console.log('Applications set in context:', backendApplications.length)
        } else {
          console.log('No applications found from backend, clearing default data')
          // Clear default data if backend returns no applications
          setData((current) => ({
            ...current,
            applications: []
          }))
        }
      } catch (error) {
        console.error('Failed to fetch applications:', error)
        // Clear applications on error to show empty state instead of demo data
        setData((current) => ({
          ...current,
          applications: []
        }))
      }
    }

    fetchApplications()
  }, [profileLoaded])

  // Fetch application statistics
  useEffect(() => {
    const fetchStats = async () => {
      if (!profileLoaded) return
      
      try {
        const response = await getApplicationStats()
        if (response?.data?.success && response?.data?.data) {
          // Stats can be used for dashboard if needed
          console.log('Application stats:', response.data.data)
        }
      } catch (error) {
        console.error('Failed to fetch application stats:', error)
      }
    }

    fetchStats()
  }, [profileLoaded])

  // Fetch documents from backend
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!profileLoaded) return
      
      try {
        console.log('Fetching documents from backend...')
        const response = await getMyDocuments()
        console.log('Documents API response:', response)
        
        if (response?.data?.success && response?.data?.data) {
          console.log('Found documents:', response.data.data.length)
          const backendDocuments = response.data.data.map((doc) => ({
            id: doc._id,
            title: doc.documentType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            type: doc.fileType.split('/')[1]?.toUpperCase() || 'FILE',
            status: doc.isVerified ? 'Verified' : 'Uploaded',
            updated: formatDate(doc.createdAt),
            fileName: doc.fileName,
            fileUrl: doc.fileUrl,
            documentType: doc.documentType,
            description: doc.description,
            tags: doc.tags,
            version: doc.version,
            isLatest: doc.isLatest
          }))
          
          setData((current) => ({
            ...current,
            documents: backendDocuments
          }))
          console.log('Documents set in context:', backendDocuments.length)
        } else {
          console.log('No documents found from backend, clearing default data')
          // Clear default data if backend returns no documents
          setData((current) => ({
            ...current,
            documents: []
          }))
        }
      } catch (error) {
        console.error('Failed to fetch documents:', error)
        // Clear documents on error to show empty state instead of demo data
        setData((current) => ({
          ...current,
          documents: []
        }))
      }
    }

    fetchDocuments()
  }, [profileLoaded])

  const addActivity = (title, detail, type = 'application') => {
    setData((current) => ({
      ...current,
      activity: [{ id: Date.now(), title, detail, type }, ...current.activity].slice(0, 8),
    }))
  }

  const actions = useMemo(() => ({
    updateAccount: (account) => setData((current) => ({ ...current, account })),
    updatePreferences: (preferences) => setData((current) => ({ ...current, preferences })),
    updateApplication: async (id, changes) => {
      try {
        const { updateApplication: updateApplicationApi } = await import('../Api/application.js')
        
        // Convert frontend status to backend status if status is being updated
        const backendChanges = { ...changes }
        if (backendChanges.status) {
          backendChanges.status = toBackendStatus(backendChanges.status)
        }
        
        const response = await updateApplicationApi(id, backendChanges)
        
        if (response?.data?.success && response?.data?.data) {
          const updatedApp = response.data.data
          setData((current) => ({
            ...current,
            applications: current.applications.map((app) => app.id === id ? { 
              ...app, 
              ...changes,
              // Update notes/coverLetter from backend response
              notes: updatedApp.coverLetter !== undefined ? updatedApp.coverLetter : app.notes,
              coverLetter: updatedApp.coverLetter !== undefined ? updatedApp.coverLetter : app.coverLetter,
              status: formatStatus(updatedApp.status) || app.status,
              stage: formatStage(updatedApp.status) || app.stage,
              progress: calculateProgress(updatedApp.status) || app.progress
            } : app),
          }))
          addActivity('Application updated', `${changes.role || 'Placement application'} details were changed.`, 'application')
        }
      } catch (error) {
        console.error('Failed to update application:', error)
        throw error
      }
    },
    addApplication: async (applicationData) => {
      try {
        const { createApplication } = await import('../Api/application.js')
        const response = await createApplication(applicationData)
        
        if (response?.data?.success && response?.data?.data) {
          const newApp = response.data.data
          const formattedApp = {
            id: newApp._id,
            role: newApp.placementId?.course?.course || applicationData.role || 'Placement Application',
            company: newApp.placementId?.personal?.fullName || applicationData.company || 'Unknown Company',
            status: 'Draft',
            stage: 'Draft',
            date: 'Today',
            advisor: newApp.placementId?.personal?.fullName || 'Not assigned',
            progress: 12,
            notes: newApp.coverLetter || '',
            applicationId: newApp._id,
            placementId: newApp.placementId,
            coverLetter: newApp.coverLetter,
            additionalInfo: newApp.additionalInfo,
            documents: newApp.documents
          }
          
          setData((current) => ({
            ...current,
            applications: [formattedApp, ...current.applications],
            activity: [{ id: Date.now(), type: 'application', title: 'Application draft created', detail: `${formattedApp.role} added for ${formattedApp.company}.` }, ...current.activity],
          }))
          
          return formattedApp
        }
      } catch (error) {
        console.error('Failed to create application:', error)
        throw error
      }
    },
    uploadDocument: async (id, file) => {
      if (!file) return
      try {
        const formData = new FormData()
        formData.append('document', file)
        // Map frontend ID to backend document type
        const documentType = mapDocumentType(id)
        formData.append('documentType', documentType)
        
        const response = await uploadDocumentApi(formData)
        
        if (response?.data?.success && response?.data?.data) {
          const type = file.name.split('.').pop()?.toUpperCase() || 'FILE'
          const newDoc = response.data.data
          setData((current) => ({
            ...current,
            documents: current.documents.map((doc) => doc.id === id ? { 
              ...doc, 
              type, 
              fileName: file.name, 
              status: 'Uploaded', 
              updated: 'Today',
              id: newDoc._id,
              fileUrl: newDoc.fileUrl
            } : doc),
            activity: [{ id: Date.now(), type: 'document', title: 'Document uploaded', detail: `${file.name} was updated.` }, ...current.activity],
          }))
          toast.success(`${file.name} uploaded successfully!`)
        } else {
          const errorMsg = response?.data?.message || 'Upload failed'
          toast.error(errorMsg)
          throw new Error(errorMsg)
        }
      } catch (error) {
        console.error('Failed to upload document:', error)
        throw error
      }
    },
    addDocument: async (file) => {
      if (!file) return
      try {
        const formData = new FormData()
        formData.append('document', file)
        formData.append('documentType', 'additional')
        
        console.log('Uploading document:', file.name, 'Type:', file.type, 'Size:', file.size)
        
        const response = await uploadDocumentApi(formData)
        
        console.log('Upload response:', response)
        
        if (response?.data?.success && response?.data?.data) {
          const type = file.name.split('.').pop()?.toUpperCase() || 'FILE'
          const newDoc = response.data.data
          const title = file.name.replace(/\.[^.]+$/, '')
          
          setData((current) => ({
            ...current,
            documents: [{ 
              id: newDoc._id, 
              title: title,
              type, 
              status: 'Uploaded', 
              updated: 'Today', 
              fileName: file.name,
              fileUrl: newDoc.fileUrl,
              documentType: 'additional'
            }, ...current.documents],
            activity: [{ id: Date.now(), type: 'document', title: 'Document uploaded', detail: `${file.name} was added to the document library.` }, ...current.activity],
          }))
          toast.success(`${file.name} uploaded successfully!`)
        } else {
          const errorMsg = response?.data?.message || 'Upload failed'
          toast.error(errorMsg)
          throw new Error(errorMsg)
        }
      } catch (error) {
        console.error('Failed to add document:', error)
        const errorMsg = error.response?.data?.message || error.message || 'Failed to upload document'
        toast.error(errorMsg)
        throw error
      }
    },
    verifyDocument: async (id) => {
      try {
        const response = await verifyDocumentApi(id)
        
        if (response?.data?.success) {
          setData((current) => ({
            ...current,
            documents: current.documents.map((doc) => doc.id === id ? { ...doc, status: 'Verified', updated: 'Today' } : doc),
          }))
        }
      } catch (error) {
        console.error('Failed to verify document:', error)
        throw error
      }
    },
    removeDocument: async (id) => {
      try {
        await deleteDocumentApi(id)
        
        setData((current) => ({
          ...current,
          documents: current.documents.filter((doc) => doc.id !== id),
          activity: [{ id: Date.now(), type: 'document', title: 'Document deleted', detail: `Document was removed.` }, ...current.activity],
        }))
        toast.success('Document deleted successfully!')
      } catch (error) {
        console.error('Failed to delete document:', error)
        toast.error('Failed to delete document. Please try again.')
        throw error
      }
    },
    createThread: (name, role, subject, message) => {
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
    sendMessage: (threadId, body) => {
      if (!body.trim()) return
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
    completeTask: (id) => {
      setData((current) => ({
        ...current,
        tasks: current.tasks.map((task) => task.id === id ? { ...task, done: !task.done } : task),
      }))
    },
    createTicket: (subject) => {
      if (!subject.trim()) return
      setData((current) => ({
        ...current,
        tickets: [{ id: `WM-HLP-${Math.floor(300 + Math.random() * 600)}`, subject: subject.trim(), status: 'Open', date: 'Today' }, ...current.tickets],
      }))
    },
    submitApplication: async (id) => {
      try {
        const { updateApplicationStatus } = await import('../Api/application.js')
        const response = await updateApplicationStatus(id, 'submitted')
        
        if (response?.data?.success && response?.data?.data) {
          const updatedApp = response.data.data
          setData((current) => ({
            ...current,
            applications: current.applications.map((app) => app.id === id ? {
              ...app,
              status: 'Submitted',
              stage: 'Application',
              progress: 28,
              date: 'Today'
            } : app),
          }))
          addActivity('Application submitted', `${updatedApp.placementId?.course?.course || 'Application'} submitted for review.`, 'application')
        }
      } catch (error) {
        console.error('Failed to submit application:', error)
        throw error
      }
    },
    
    deleteApplication: async (id) => {
      try {
        const { deleteApplication: deleteApplicationApi } = await import('../Api/application.js')
        await deleteApplicationApi(id)
        
        setData((current) => ({
          ...current,
          applications: current.applications.filter((app) => app.id !== id),
          activity: [{ id: Date.now(), type: 'application', title: 'Application deleted', detail: 'Application was removed.' }, ...current.activity],
        }))
      } catch (error) {
        console.error('Failed to delete application:', error)
        throw error
      }
    },
    
    resetPortalData: () => setData(defaultData),
    logout: () => {
      setData(defaultData)
      setProfileLoaded(false)
      setIsAuthenticated(false)
    },
  }), [])

  const value = useMemo(() => ({ 
    data, 
    profileLoaded,
    isAuthenticated,
    ...actions 
  }), [data, profileLoaded, isAuthenticated, actions])

  return (
    <PortalDataContext.Provider value={value}>
      {children}
    </PortalDataContext.Provider>
  )
}

export const usePortalData = () => useContext(PortalDataContext)
