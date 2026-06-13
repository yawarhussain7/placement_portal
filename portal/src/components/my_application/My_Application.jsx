import React, { useState } from 'react';
import { FileText, IdCard, GraduationCap, Award, FolderPlus, Upload, FileCheck, ArrowLeft, ArrowRight } from 'lucide-react';

const My_Application = ({ onBack, onNext }) => {
  // State to track uploaded file names for each document type
  const [uploadedFiles, setUploadedFiles] = useState({
    resume: null,
    photoId: null,
    studentId: null,
    transcript: null,
    certificates: null,
    additional: null,
  });

  // Mock handler for file selection
  const handleFileChange = (e, docType) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFiles((prev) => ({
        ...prev,
        [docType]: file.name,
      }));
    }
  };

  // Configuration for the document rows
  const documentRows = [
    {
      id: 'resume',
      title: 'Resume / CV',
      required: true,
      description: 'Upload your latest resume',
      icon: FileText,
    },
    {
      id: 'photoId',
      title: 'Photo ID',
      required: true,
      description: "Passport, Driver's License or Medicare Card",
      icon: IdCard,
    },
    {
      id: 'studentId',
      title: 'Student ID / Proof of Enrolment',
      required: true,
      description: 'Upload your student ID or enrolment letter',
      icon: GraduationCap,
    },
    {
      id: 'transcript',
      title: 'Academic Transcript',
      required: false,
      extraText: '(if available)',
      description: 'Upload your latest academic transcript',
      icon: FileText,
    },
    {
      id: 'certificates',
      title: 'Certificates',
      required: false,
      extraText: '(if any)',
      description: 'Upload relevant certificates',
      icon: Award,
    },
    {
      id: 'additional',
      title: 'Additional Documents',
      required: false,
      extraText: '(optional)',
      description: 'Any other supporting documents',
      icon: FolderPlus,
    },
  ];

  return (
    <div className=" p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="divide-y divide-gray-100">
        {documentRows.map((doc) => {
          const IconComponent = doc.icon;
          const isUploaded = !!uploadedFiles[doc.id];

          return (
            <div
              key={doc.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between py-5 first:pt-0 last:pb-0 gap-4"
            >
              {/* Left Side: Icon & Document Details */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-50 rounded-xl text-green-700 flex-shrink-0">
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-gray-900 font-semibold text-base flex items-center gap-1">
                    {doc.title}
                    {doc.extraText && (
                      <span className="text-gray-500 font-normal text-sm ml-1">
                        {doc.extraText}
                      </span>
                    )}
                    {doc.required && <span className="text-red-500 font-bold">*</span>}
                  </h3>
                  <p className="text-gray-500 text-sm mt-0.5">{doc.description}</p>
                  
                  {/* Shows file name if a file is uploaded */}
                  {isUploaded && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-md w-fit">
                      <FileCheck className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[200px] sm:max-w-sm">
                        {uploadedFiles[doc.id]}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side: Upload Button */}
              <div className="flex-shrink-0 self-end sm:self-center">
                <label className="cursor-pointer group flex items-center gap-2 px-4 py-2.5 border border-green-600 rounded-lg text-green-700 font-medium text-sm hover:bg-green-50 transition-colors duration-200">
                  <Upload className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
                  <span>Upload File</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, doc.id)}
                  />
                </label>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center pt-6 mt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs px-5 py-2.5 rounded-lg transition-colors"
        >
          <ArrowLeft size={14} /><span>Back</span>
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 bg-[#12692e] hover:bg-emerald-800 text-white font-semibold text-xs px-5 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          <span>Save & Continue</span><ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default My_Application;