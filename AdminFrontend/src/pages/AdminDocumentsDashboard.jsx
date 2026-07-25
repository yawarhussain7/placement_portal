import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Sidebar from '../components/common/Sidebar'; 
import Header from '../components/common/Header';   
import AdminDocStatCard from '../components/document/AdminDocStatCard';
import DocumentFilters from '../components/document/DocumentFilters';
import DocumentTable from '../components/document/DocumentTable';
import DocumentDetailsPanel from '../components/document/DocumentDetailsPanel';
import { getDocuments, getDocumentById, verifyDocument, rejectDocument, downloadDocument } from '../api/documents';

const AdminDocumentsDashboard = () => {
  const [activeTab, setActiveTab] = useState('documents');
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [documentTypeFilter, setDocumentTypeFilter] = useState('all');
  const [dateRange, setDateRange] = useState('');
  const [notes, setNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const [stats, setStats] = useState({
    totalDocuments: 0,
    totalVerified: 0,
    totalPending: 0,
    totalRejected: 0
  })

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await getDocuments();
        console.log('Full API response:', response);
        const resData = response.data;
        console.log('Response data:', resData);
        
        if (resData.success && resData.data) {
          const totalDocs = resData.data.totalDocuments || 0
          const totalVerified = resData.data.totalVerified || 0
          const totalPending = resData.data.totalPending || 0
          const totalRejected = resData.data.totalRejected || 0
          
          setStats({
            totalDocuments: totalDocs,
            totalVerified: totalVerified,
            totalPending: totalPending,
            totalRejected: totalRejected
          })

          const docs = resData.data.documents || []
          console.log('Documents found:', docs.length);
          
          // Log first document to see its structure
          if (docs.length > 0) {
            console.log('First document structure:', docs[0])
            console.log('First document _id:', docs[0]._id, 'type:', typeof docs[0]._id)
          }
          
          setDocuments(docs)
        } else {
          console.log('Response not successful or no data:', resData);
        }
      } catch (err) {
        console.error('Failed to fetch admin documents:', err);
        console.error('Error details:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleViewDocument = (doc) => {
    if (doc.fileUrl) {
      window.open(doc.fileUrl, '_blank');
    }
  };

  const handleDownloadDocument = async (doc) => {
    try {
      const docId = doc._id || doc.id
      console.log('Downloading document:', docId, 'from doc:', doc)
      if (!docId) {
        toast.error('Invalid document selected', {
          duration: 3000,
          position: 'top-right'
        })
        return
      }
      await downloadDocument(docId)
    } catch (err) {
      console.error('Failed to download document:', err.message)
      // Fallback to direct URL if API fails
      if (doc.fileUrl) {
        const link = document.createElement('a')
        link.href = doc.fileUrl
        link.download = doc.fileName
        link.click()
      }
    }
  };

  const handleDocumentClick = async (doc) => {
    try {
      const docId = doc._id || doc.id
      console.log('Fetching document details for ID:', docId, 'from doc:', doc)
      console.log('Document keys:', Object.keys(doc))
      console.log('Document _id:', doc._id, 'id:', doc.id)
      
      const response = await getDocumentById(docId);
      console.log('Document details response:', response.data)
      
      if (response.data.success) {
        const selectedDoc = response.data.data
        console.log('Selected document set:', selectedDoc)
        console.log('Selected doc _id:', selectedDoc._id, 'id:', selectedDoc.id)
        setSelectedDocument(selectedDoc);
        setNotes('');
      }
    } catch (err) {
      console.error('Failed to fetch document details:', err);
    }
  };

  const handleVerify = async (doc = null) => {
    console.log('Verify button clicked', doc ? 'with doc param' : 'using selectedDocument');
    console.log('selectedDocument state:', selectedDocument)
    
    const documentToVerify = doc || selectedDocument;
    
    console.log('documentToVerify:', documentToVerify)
    console.log('documentToVerify type:', typeof documentToVerify)
    
    if (!documentToVerify) {
      console.log('No document selected');
      toast.error('Please select a document first', {
        duration: 3000,
        position: 'top-right'
      });
      return;
    }
    
    if (actionLoading) {
      console.log('Action already in progress');
      return;
    }
    
    // Validate document ID - check for both undefined and string "undefined"
    const documentId = documentToVerify._id || documentToVerify.id
    console.log('Verifying document ID:', documentId, 'type:', typeof documentId);
    console.log('documentToVerify._id:', documentToVerify._id, 'type:', typeof documentToVerify._id)
    console.log('documentToVerify.id:', documentToVerify.id, 'type:', typeof documentToVerify.id)
    
    if (!documentId || documentId === 'undefined' || documentId === 'null') {
      console.error('Document ID is invalid:', documentId, 'Full document:', JSON.stringify(documentToVerify))
      toast.error('Invalid document selected - missing ID', {
        duration: 3000,
        position: 'top-right'
      });
      return;
    }
    
    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to verify "${documentToVerify.fileName}"? This will mark the document as approved.`
    );
    
    if (!confirmed) {
      console.log('User cancelled verification');
      return;
    }
    
    setActionLoading(true);
    try {
      console.log('Calling verify API with ID:', documentId);
      const response = await verifyDocument(documentId);
      console.log('Verify response:', response);
      
      // Show success toast
      toast.success('Document verified successfully!', {
        duration: 3000,
        position: 'top-right'
      });
      
      // Refresh documents list
      console.log('Refreshing documents list...');
      const docsResponse = await getDocuments();
      console.log('Documents response:', docsResponse.data);
      
      if (docsResponse.data.success && docsResponse.data.data) {
        setDocuments(docsResponse.data.data.documents || [])
        setStats({
          totalDocuments: docsResponse.data.data.totalDocuments || 0,
          totalVerified: docsResponse.data.data.totalVerified || 0,
          totalPending: docsResponse.data.data.totalPending || 0,
          totalRejected: docsResponse.data.data.totalRejected || 0
        })
      }
      setSelectedDocument(null);
    } catch (err) {
      console.error('Failed to verify document:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error message:', err.message);
      toast.error(`Failed to verify: ${err.response?.data?.message || err.message}`, {
        duration: 3000,
        position: 'top-right'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (doc = null) => {
    console.log('Reject button clicked', doc ? 'with doc param' : 'using selectedDocument');
    console.log('selectedDocument state:', selectedDocument)
    
    const documentToReject = doc || selectedDocument;
    
    console.log('documentToReject:', documentToReject)
    console.log('documentToReject type:', typeof documentToReject)
    
    if (!documentToReject) {
      console.log('No document selected');
      toast.error('Please select a document first', {
        duration: 3000,
        position: 'top-right'
      });
      return;
    }
    
    if (actionLoading) {
      console.log('Action already in progress');
      return;
    }
    
    // Validate document ID - check for both undefined and string "undefined"
    const documentId = documentToReject._id || documentToReject.id
    console.log('Rejecting document ID:', documentId, 'type:', typeof documentId);
    console.log('documentToReject._id:', documentToReject._id, 'type:', typeof documentToReject._id)
    console.log('documentToReject.id:', documentToReject.id, 'type:', typeof documentToReject.id)
    
    if (!documentId || documentId === 'undefined' || documentId === 'null') {
      console.error('Document ID is invalid:', documentId, 'Full document:', JSON.stringify(documentToReject))
      toast.error('Invalid document selected - missing ID', {
        duration: 3000,
        position: 'top-right'
      });
      return;
    }
    
    // Show confirmation dialog
    const reason = window.prompt(
      `Are you sure you want to reject "${documentToReject.fileName}"?\n\nPlease provide a reason for rejection (optional):`
    );
    
    if (reason === null) {
      console.log('User cancelled rejection');
      return;
    }
    
    setActionLoading(true);
    try {
      console.log('Calling reject API with ID:', documentId);
      const response = await rejectDocument(documentId);
      console.log('Reject response:', response);
      
      // Show success toast
      toast.success('Document rejected successfully!', {
        duration: 3000,
        position: 'top-right'
      });
      
      // Refresh documents list
      console.log('Refreshing documents list...');
      const docsResponse = await getDocuments();
      console.log('Documents response:', docsResponse.data);
      
      if (docsResponse.data.success && docsResponse.data.data) {
        setDocuments(docsResponse.data.data.documents || [])
        setStats({
          totalDocuments: docsResponse.data.data.totalDocuments || 0,
          totalVerified: docsResponse.data.data.totalVerified || 0,
          totalPending: docsResponse.data.data.totalPending || 0,
          totalRejected: docsResponse.data.data.totalRejected || 0
        })
      }
      setSelectedDocument(null);
    } catch (err) {
      console.error('Failed to reject document:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error message:', err.message);
      toast.error(`Failed to reject: ${err.response?.data?.message || err.message}`, {
        duration: 3000,
        position: 'top-right'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (isVerified) => {
    if (isVerified === true) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
          Verified
        </span>
      );
    } else if (isVerified === false) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
          Pending
        </span>
      );
    }
    return null;
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Filter documents based on search and filters
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = (doc.userId?.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (doc.fileName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (doc.documentType || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'verified' && doc.isVerified === true) ||
                          (statusFilter === 'pending' && doc.isVerified === false);
    
    const matchesType = documentTypeFilter === 'all' || doc.documentType === documentTypeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });


  return (
    <div className="flex bg-slate-50 min-h-screen font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Global Navigation Sidebar component injection */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Global Structural Layout Top Header */}
        <Header />

        <main className="flex-1 p-8 space-y-6 overflow-y-auto max-w-[1600px] w-full mx-auto custom-scrollbar">
          
          {/* Document Section Page Title Header */}
          <div className="pb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Document Review</h1>
              <p className="text-sm font-medium text-gray-400 mt-1">Review, verify or reject user submitted documents.</p>
            </div>
          </div>

          {/* Analytical Stat Metrics Layer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <AdminDocStatCard 
              title="Total Documents" 
              metric={loading ? "..." : stats.totalDocuments} 
              subtitle="All time"
              colorClass="text-blue-600 bg-blue-50"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            />
            <AdminDocStatCard 
              title="Pending Review" 
              metric={loading ? "..." : stats.totalPending} 
              subtitle="Needs your action"
              colorClass="text-amber-600 bg-amber-50"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <AdminDocStatCard 
              title="Verified" 
              metric={loading ? "..." : stats.totalVerified} 
              subtitle="Approved documents"
              colorClass="text-emerald-600 bg-emerald-50"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <AdminDocStatCard 
              title="Rejected" 
              metric={loading ? "..." : stats.totalRejected} 
              subtitle="Rejected documents"
              colorClass="text-rose-600 bg-rose-50"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          </div>

          {/* Document List Section */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            
            {/* Filters */}
            <DocumentFilters 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              documentTypeFilter={documentTypeFilter}
              setDocumentTypeFilter={setDocumentTypeFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              dateRange={dateRange}
              setDateRange={setDateRange}
            />

            {/* Main Content Area - Table and Details Panel */}
            <div className="flex">
              {/* Document Table */}
              <div className="flex-1">
                <DocumentTable 
                  documents={filteredDocuments}
                  loading={loading}
                  selectedDocument={selectedDocument}
                  onDocumentClick={handleDocumentClick}
                  onDownload={handleDownloadDocument}
                  onVerify={handleVerify}
                  onReject={handleReject}
                  getStatusBadge={getStatusBadge}
                  getInitials={getInitials}
                />
              </div>

              {/* Document Details Panel */}
              <DocumentDetailsPanel 
                selectedDocument={selectedDocument}
                onClose={() => setSelectedDocument(null)}
                onDownload={handleDownloadDocument}
                onVerify={handleVerify}
                onReject={handleReject}
                getInitials={getInitials}
                actionLoading={actionLoading}
              />
            </div>

            {/* Pagination */}
            {!loading && filteredDocuments.length > 0 && (
              <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-50 text-xs font-semibold text-gray-400">
                <span>Showing 1 to 7 of {filteredDocuments.length} entries</span>
                
                <div className="flex items-center gap-1">
                  <button className="p-1.5 border border-gray-150 rounded-md hover:bg-gray-50 transition-colors text-gray-400 disabled:opacity-50">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button className="w-7 h-7 bg-emerald-600 text-white rounded-md text-xs font-bold shadow-sm shadow-emerald-500/10">1</button>
                  <button className="w-7 h-7 hover:bg-gray-50 text-gray-600 border border-transparent hover:border-gray-150 rounded-md transition-colors">2</button>
                  <button className="w-7 h-7 hover:bg-gray-50 text-gray-600 border border-transparent hover:border-gray-150 rounded-md transition-colors">3</button>
                  <button className="w-7 h-7 hover:bg-gray-50 text-gray-600 border border-transparent hover:border-gray-150 rounded-md transition-colors">4</button>
                  <button className="w-7 h-7 hover:bg-gray-50 text-gray-600 border border-transparent hover:border-gray-150 rounded-md transition-colors">5</button>
                  <button className="p-1.5 border border-gray-150 rounded-md hover:bg-gray-50 transition-colors text-gray-400">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
};

export default AdminDocumentsDashboard;