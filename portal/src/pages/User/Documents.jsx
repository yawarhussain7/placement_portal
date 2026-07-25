import Template from '../../components/common/Template'
import { CheckCircle2, Download, FileCheck2, FileText, GraduationCap, IdCard, Upload, Trash2, Shield } from 'lucide-react'
import { usePortalData } from '../../context/PortalDataContext'
import { downloadDocument as downloadDocumentApi } from '../../Api/document.js'

const iconForTitle = (title) => {
  if (title.toLowerCase().includes('id')) return IdCard
  if (title.toLowerCase().includes('transcript')) return GraduationCap
  return FileText
}

export default function Documents() {
  const { data, uploadDocument, addDocument, verifyDocument, removeDocument } = usePortalData()

  const handleDownload = (doc) => {
    if (!doc.fileUrl) {
      alert('No file available for download')
      return
    }
    try {
      // Open the file URL directly since files are served statically
      const link = document.createElement('a')
      link.href = doc.fileUrl
      link.setAttribute('download', doc.fileName || 'document')
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Download failed:', error)
      alert('Failed to download document. Please try again.')
    }
  }

  const handleDelete = async (docId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return
    try {
      await removeDocument(docId)
    } catch (error) {
      console.error('Delete failed:', error)
      alert('Failed to delete document. Please try again.')
    }
  }

  const totalFiles = data.documents.length
  const verified = data.documents.filter((doc) => doc.status === 'Verified').length
  const needsAction = data.documents.filter((doc) => doc.status === 'Needs Update').length

  return (
    <Template title="Documents" description="Manage documents used across placement applications">
      <div className="space-y-4 sm:space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {[
            { 
              label: 'Total files', 
              value: totalFiles, 
              subtext: 'All uploaded documents',
              icon: FileText,
              color: 'emerald',
              borderColor: 'border-l-emerald-500'
            },
            { 
              label: 'Verified', 
              value: verified, 
              subtext: 'Documents verified',
              icon: Shield,
              color: 'blue',
              borderColor: 'border-l-blue-500'
            },
            { 
              label: 'Needs action', 
              value: needsAction, 
              subtext: 'Documents need attention',
              icon: FileCheck2,
              color: 'amber',
              borderColor: 'border-l-amber-500'
            },
          ].map(({ label, value, subtext, icon: Icon, color, borderColor }) => (
            <div key={label} className={`bg-white border border-gray-200 rounded-lg p-5 ${borderColor} border-l-4 shadow-sm`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-600">{label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
                  <p className="text-xs text-gray-500 mt-1">{subtext}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg bg-${color}-50 flex items-center justify-center`}>
                  <Icon size={24} className={`text-${color}-600`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Document library */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-gray-900">Document Library</h2>
              <p className="text-xs text-gray-500 mt-1">Upload, replace, and verify reusable placement files.</p>
            </div>
            <label className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white text-sm font-semibold cursor-pointer transition-colors shadow-sm">
              <Upload size={16} />
              Upload New
              <input type="file" className="hidden" onChange={(event) => addDocument(event.target.files?.[0])} />
            </label>
          </div>

          <div className="divide-y divide-gray-100">
            {data.documents.map((doc) => {
              const Icon = iconForTitle(doc.title)
              const hasFile = doc.fileName && doc.fileName !== 'No file selected' && doc.fileName !== ''
              
              // Determine file type for icon
              const getFileTypeIcon = (type) => {
                if (type === 'PDF') {
                  return (
                    <div className="w-12 h-12 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-red-700">PDF</span>
                    </div>
                  )
                } else if (type === 'PNG' || type === 'JPG' || type === 'JPEG') {
                  return (
                    <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-blue-700">PNG</span>
                    </div>
                  )
                } else if (type === 'DOCX') {
                  return (
                    <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-blue-700">DOC</span>
                    </div>
                  )
                }
                return (
                  <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center flex-shrink-0">
                    <FileText size={20} className="text-gray-600" />
                  </div>
                )
              }

              return (
                <div key={doc.id} className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    {getFileTypeIcon(doc.type)}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-gray-900">{doc.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {doc.type} • <span className="text-gray-600">{doc.fileName || 'No file selected'}</span> • Updated: {doc.updated}
                      </p>
                      <span className={`inline-flex items-center gap-1 mt-2 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                        doc.status === 'Verified' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : doc.status === 'Needs Update' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-gray-50 text-gray-600 border border-gray-200'
                      }`}>
                        <CheckCircle2 size={12} />
                        {doc.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
                    {hasFile && (
                      <button onClick={() => handleDownload(doc)} className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors" title="Download">
                        <Download size={16} />
                      </button>
                    )}
                    <label className="inline-flex items-center gap-1.5 px-3 py-2 border border-emerald-600 text-emerald-700 rounded-lg text-xs font-semibold cursor-pointer hover:bg-emerald-50 transition-colors">
                      <Upload size={14} />
                      Replace
                      <input type="file" className="hidden" onChange={(event) => uploadDocument(doc.id, event.target.files?.[0])} />
                    </label>
                    {hasFile && (
                      <button onClick={() => handleDelete(doc.id)} className="p-2 border border-red-200 rounded-lg text-red-500 hover:bg-red-50 transition-colors" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Info banner */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-start gap-3">
          <Shield size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-emerald-800">
            Verified documents are ready to use in your applications.
          </p>
        </div>
      </div>
    </Template>
  )
}
