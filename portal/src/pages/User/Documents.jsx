import Template from '../../components/common/Template'
import { CheckCircle2, Download, FileCheck2, FileText, GraduationCap, IdCard, Upload, Trash2 } from 'lucide-react'
import { usePortalData } from '../../context/PortalDataContext'
import { downloadDocument as downloadDocumentApi } from '../../Api/documentApi'

const iconForTitle = (title) => {
  if (title.toLowerCase().includes('id')) return IdCard
  if (title.toLowerCase().includes('transcript')) return GraduationCap
  return FileText
}

export default function Documents() {
  const { data, uploadDocument, addDocument, verifyDocument, removeDocument } = usePortalData()

  const handleDownload = async (doc) => {
    try {
      const response = await downloadDocumentApi(doc.id)
      // Create a blob URL and trigger download
      const blob = new Blob([response.data])
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', doc.fileName || 'document')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
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

  return (
    <Template title="Documents" description="Manage documents used across placement applications">
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            ['Total files', data.documents.length],
            ['Verified', data.documents.filter((doc) => doc.status === 'Verified').length],
            ['Needs action', data.documents.filter((doc) => doc.status === 'Needs Update').length],
          ].map(([label, value]) => (
            <div key={label} className="card border rounded-lg p-5">
              <p className="text-xs font-semibold text-muted">{label}</p>
              <p className="text-2xl font-bold text-primary mt-1">{value}</p>
            </div>
          ))}
        </div>

        <div className="card border rounded-lg overflow-hidden">
          <div className="p-5 border-b border-base flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 className="font-bold text-primary">Document Library</h2>
              <p className="text-xs text-muted mt-1">Upload, replace, and verify reusable placement files.</p>
            </div>
            <label className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-accent hover-accent rounded-lg text-white text-sm font-semibold cursor-pointer">
              <Upload size={16} />
              Upload New
              <input type="file" className="hidden" onChange={(event) => addDocument(event.target.files?.[0])} />
            </label>
          </div>

          <div className="divide-y divide-base">
            {data.documents.map((doc) => {
              const Icon = iconForTitle(doc.title)
              const hasFile = doc.fileName && doc.fileName !== 'No file selected' && doc.fileName !== ''
              return (
                <div key={doc.id} className="p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-lg bg-accent-subtle text-accent flex items-center justify-center flex-shrink-0">
                      <Icon size={21} />
                    </div>
                    <div>
                      <h3 className="font-bold text-primary">{doc.title}</h3>
                      <p className="text-xs text-muted mt-1">{doc.type} - {doc.fileName || 'No file selected'} - Last updated: {doc.updated}</p>
                      <span className={`inline-flex items-center gap-1 mt-2 text-[11px] font-bold px-2 py-1 rounded-full ${
                        doc.status === 'Verified' ? 'bg-accent-subtle text-accent' : doc.status === 'Needs Update' ? 'bg-amber-50 text-amber-700' : 'bg-subtle text-secondary'
                      }`}>
                        <FileCheck2 size={12} />
                        {doc.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 self-end lg:self-center">
                    {hasFile && (
                      <button onClick={() => handleDownload(doc)} className="p-2 border border-base rounded-lg text-secondary hover:bg-subtle" title="Download">
                        <Download size={16} />
                      </button>
                    )}
                    {doc.status !== 'Verified' && (
                      <button onClick={() => verifyDocument(doc.id)} className="inline-flex items-center gap-2 px-3 py-2 border border-base text-secondary rounded-lg text-xs font-bold hover:bg-subtle">
                        <CheckCircle2 size={14} />
                        Mark Verified
                      </button>
                    )}
                    <label className="inline-flex items-center gap-2 px-3 py-2 border border-accent text-accent rounded-lg text-xs font-bold cursor-pointer hover:bg-accent-subtle">
                      <Upload size={14} />
                      Replace
                      <input type="file" className="hidden" onChange={(event) => uploadDocument(doc.id, event.target.files?.[0])} />
                    </label>
                    {hasFile && (
                      <button onClick={() => handleDelete(doc.id)} className="p-2 border border-red-200 rounded-lg text-red-500 hover:bg-red-50" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Template>
  )
}
