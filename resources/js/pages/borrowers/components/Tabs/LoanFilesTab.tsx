import React from 'react';

type FileType = {
  ID: number;
  file_name: string;
  file_type: string;
  file_path: string;
  uploaded_at: string;
  description?: string;
  source?: string;
};

const toStorageUrl = (filePath?: string) => {
  if (!filePath) return '#';
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) return filePath;
  return `/storage/${filePath.replace(/^\/+/, '').replace(/^public\//, '')}`;
};

export default function LoanFilesTab({ files }: { files: FileType[] }) {
  if (!files || files.length === 0) {
    return <p className="p-4 text-sm text-gray-500">No files uploaded.</p>;
  }

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
              <a
                href={toStorageUrl(file.file_path)}
                target="_blank"
                rel="noreferrer"
                className="font-medium truncate text-blue-600 hover:underline"
              >
                {file.file_name || 'View file'}
              </a>
              <span className="text-xs text-gray-400 truncate">
                {file.uploaded_at ? file.uploaded_at.split('T')[0] : 'Unknown date'}
                {file.source ? ` · ${file.source}` : ''}
              </span>
              {file.description && (
                <span className="text-xs text-gray-500 truncate">{file.description}</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
