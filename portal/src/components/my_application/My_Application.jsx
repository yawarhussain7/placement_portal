import React, { useState } from 'react';
import {
  FileText,
  IdCard,
  GraduationCap,
  Award,
  FolderPlus,
  Upload,
  FileCheck,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

import { usePlacementForm } from '../../context/PlacementFormContext.jsx';

const My_Application = ({ onBack, onNext }) => {
  const { placementForm, updateDocuments } = usePlacementForm()

  // store full file object + name safely
  const [uploadedFiles, setUploadedFiles] = useState({
    resume: placementForm.documents.resume || null,
    photoId: placementForm.documents.photoId || null,
    studentId: placementForm.documents.studentId || null,
    transcript: placementForm.documents.transcript || null,
    certificates: placementForm.documents.certificates || null,
    additional: placementForm.documents.additional || null
  });

  // handle file selection
  const handleFileChange = (e, docType) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedFiles((prev) => ({
      ...prev,
      [docType]: file
    }));
  };

  // save files to context and proceed
  const handleUpload = () => {
    updateDocuments(uploadedFiles);
    onNext?.();
  };

  const documentRows = [
    {
      id: 'resume',
      title: 'Resume / CV',
      required: true,
      description: 'Upload your latest resume',
      icon: FileText
    },
    {
      id: 'photoId',
      title: 'Photo ID',
      required: true,
      description: "Passport, Driver's License or Medicare Card",
      icon: IdCard
    },
    {
      id: 'studentId',
      title: 'Student ID / Proof of Enrolment',
      required: true,
      description: 'Upload your student ID or enrolment letter',
      icon: GraduationCap
    },
    {
      id: 'transcript',
      title: 'Academic Transcript',
      required: false,
      extraText: '(if available)',
      description: 'Upload your latest academic transcript',
      icon: FileText
    },
    {
      id: 'certificates',
      title: 'Certificates',
      required: false,
      extraText: '(if any)',
      description: 'Upload relevant certificates',
      icon: Award
    },
    {
      id: 'additional',
      title: 'Additional Documents',
      required: false,
      extraText: '(optional)',
      description: 'Any other supporting documents',
      icon: FolderPlus
    }
  ];

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <div className="divide-y divide-gray-100">

        {documentRows.map((doc) => {
          const Icon = doc.icon;
          const file = uploadedFiles[doc.id];

          return (
            <div
              key={doc.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between py-5 gap-4"
            >
              {/* LEFT SIDE */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-50 rounded-xl text-green-700">
                  <Icon className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="text-gray-900 font-semibold text-base flex items-center gap-1">
                    {doc.title}
                    {doc.extraText && (
                      <span className="text-gray-500 text-sm ml-1">
                        {doc.extraText}
                      </span>
                    )}
                    {doc.required && (
                      <span className="text-red-500 font-bold">*</span>
                    )}
                  </h3>

                  <p className="text-gray-500 text-sm">
                    {doc.description}
                  </p>

                  {/* FILE NAME DISPLAY (FIXED) */}
                  {file && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-green-700 bg-green-50 px-2 py-1 rounded-md w-fit">
                      <FileCheck className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[200px]">
                        {file.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="flex-shrink-0">
                <label className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-green-600 rounded-lg text-green-700 text-sm hover:bg-green-50">
                  <Upload className="w-4 h-4" />
                  Upload File
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

      {/* BUTTONS */}
      <div className="flex justify-between pt-6 mt-4 border-t">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <ArrowLeft size={14} />
          Back
        </button>

        <button
          onClick={handleUpload}
          className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          Save & Upload
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default My_Application;