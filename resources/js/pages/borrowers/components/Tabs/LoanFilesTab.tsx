import React, { useMemo } from 'react';

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

const formatGroupLabel = (value: string) =>
  value
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const getFileExtension = (file: FileType) => {
  if (file.file_type) {
    return file.file_type.toLowerCase();
  }

  const source = file.file_name || file.file_path || '';
  const parts = source.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
};

const getFileGroup = (file: FileType) => {
  const descriptionMatch = file.description?.match(
    /(borrower_identity|borrower_address|borrower_employment|collateral)/i,
  );

  if (descriptionMatch?.[1]) {
    return descriptionMatch[1].toLowerCase();
  }

  const pathMatch = file.file_path?.match(
    /(borrower_identity|borrower_address|borrower_employment|collateral)/i,
  );

  if (pathMatch?.[1]) {
    return pathMatch[1].toLowerCase();
  }

  if (file.source?.toLowerCase() === 'collateral') {
    return 'collateral';
  }

  if (file.source?.toLowerCase() === 'borrower') {
    return 'borrower_files';
  }

  return 'other_files';
};

function FileBadge({ extension }: { extension: string }) {
  if (extension === 'pdf') {
    return <span className="font-bold text-red-600">PDF</span>;
  }

  if (extension === 'doc' || extension === 'docx') {
    return <span className="font-bold text-blue-600">DOC</span>;
  }

  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
    return <span className="font-bold text-green-600">IMG</span>;
  }

  return <span className="text-gray-500">FILE</span>;
}

export default function LoanFilesTab({ files }: { files: FileType[] }) {
  const groupedFiles = useMemo(() => {
    const groups = new Map<string, FileType[]>();

    for (const file of files || []) {
      const groupKey = getFileGroup(file);
      const existing = groups.get(groupKey) ?? [];
      existing.push(file);
      groups.set(groupKey, existing);
    }

    return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [files]);

  if (!files || files.length === 0) {
    return <p className="p-4 text-sm text-gray-500">No files uploaded.</p>;
  }

  return (
    <div className="rounded-lg bg-gray-50 p-4 text-gray-700">
      <div className="space-y-6">
        {groupedFiles.map(([groupName, groupFiles]) => (
          <section key={groupName}>
            <div className="mb-3 rounded-sm border-l-4 border-yellow-300 bg-amber-100 px-4 py-2">
              <h3 className="font-medium text-yellow-800">
                {formatGroupLabel(groupName)}
                <span className="ml-2 text-sm text-yellow-700">({groupFiles.length})</span>
              </h3>
            </div>

            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {groupFiles.map((file) => {
                const extension = getFileExtension(file);

                return (
                  <li
                    key={file.ID}
                    className="flex items-center gap-3 rounded bg-white p-2 shadow transition hover:bg-gray-100"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded bg-gray-200">
                      <FileBadge extension={extension} />
                    </div>

                    <div className="flex flex-col overflow-hidden">
                      <a
                        href={toStorageUrl(file.file_path)}
                        target="_blank"
                        rel="noreferrer"
                        className="truncate font-medium text-blue-600 hover:underline"
                      >
                        {file.file_name || 'View file'}
                      </a>
                      <span className="truncate text-xs text-gray-400">
                        {file.uploaded_at ? file.uploaded_at.split('T')[0] : 'Unknown date'}
                        {file.source ? ` · ${file.source}` : ''}
                      </span>
                      {file.description && (
                        <span className="truncate text-xs text-gray-500">{file.description}</span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
