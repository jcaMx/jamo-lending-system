import React from 'react';

type FileType = {
  ID: number;
  file_name: string;
  file_type: string;
  file_path: string;
  uploaded_at: string;
  description?: string;
};

export default function LoanFilesTab({ files }: { files: FileType[] }) {
  return (
    <div className="p-4 bg-gray-50 text-gray-700 rounded-lg">
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {(files || []).map((file) => (
          <li key={file.ID} className="flex items-center gap-3 p-2 bg-white rounded shadow hover:bg-gray-100 transition">
            {/* Thumbnail */}
            <div className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded">
              {file.file_type === 'pdf' && (
                <span className="text-red-600 font-bold">PDF</span>
              )}
              {file.file_type === 'doc' && (
                <span className="text-blue-600 font-bold">DOC</span>
              )}
              {!file.file_type && <span className="text-gray-500">FILE</span>}
            </div>

            {/* File info */}
            <div className="flex flex-col overflow-hidden">
              <span className="font-medium truncate">{file.file_name}</span>
              <span className="text-xs text-gray-400 truncate">{file.uploaded_at.split('T')[0]}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
