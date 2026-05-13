import React, { useMemo } from 'react';

type FileType = {
  ID?: number;
  id?: number;
  file_name?: string;
  file_type?: string;
  file_path?: string;
  uploaded_at?: string;
  description?: string | null;
  document_type_name?: string | null;
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

const formatSourceLabel = (source?: string) => {
  if (!source) return 'Application File';
  return source.replace(/_/g, ' ').trim();
};

const formatDateValue = (value?: string) => {
  if (!value) return 'Unknown date';

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString();
};

const normalizeDescription = (description?: string | null) => {
  if (!description) return null;

  const cleaned = description.replace(/\s*\(type_id\s*:\s*\d+\)\s*/gi, '').trim();
  return cleaned || null;
};

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
    /(borrower_identity|borrower_address|borrower_employment|loan_product_requirement|collateral)/i,
  );

  if (descriptionMatch?.[1]) {
    return descriptionMatch[1].toLowerCase();
  }

  const pathMatch = file.file_path?.match(
    /(borrower_identity|borrower_address|borrower_employment|loan-product|collateral)/i,
  );

  if (pathMatch?.[1]) {
    return pathMatch[1].toLowerCase().replace('loan-product', 'loan_product_requirement');
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
  const badgeMap: Record<string, { label: string; className: string }> = {
    pdf: { label: 'PDF', className: 'bg-red-100 text-red-700' },
    doc: { label: 'DOC', className: 'bg-blue-100 text-blue-700' },
    docx: { label: 'DOC', className: 'bg-blue-100 text-blue-700' },
    jpg: { label: 'IMG', className: 'bg-emerald-100 text-emerald-700' },
    jpeg: { label: 'IMG', className: 'bg-emerald-100 text-emerald-700' },
    png: { label: 'IMG', className: 'bg-emerald-100 text-emerald-700' },
    gif: { label: 'IMG', className: 'bg-emerald-100 text-emerald-700' },
    webp: { label: 'IMG', className: 'bg-emerald-100 text-emerald-700' },
  };

  const badge = badgeMap[extension] ?? { label: 'FILE', className: 'bg-slate-100 text-slate-700' };

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${badge.className}`}>
      {badge.label}
    </span>
  );
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

    return Array.from(groups.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([groupName, groupFiles]) => ({
        groupName,
        sectionId: `file-group-${groupName}`,
        files: groupFiles.sort((a, b) => (a.file_name || '').localeCompare(b.file_name || '')),
      }));
  }, [files]);

  if (!files || files.length === 0) {
    return (
      <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-6 text-sm text-amber-900 shadow-sm">
        No files uploaded.
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-3xl border border-amber-100 bg-gradient-to-b from-amber-50 via-white to-amber-50/70 p-5 text-gray-700 shadow-sm md:p-6">
      <div className="rounded-2xl border border-amber-200 bg-white/90 p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-amber-950">Loan Documents</h2>
            <p className="mt-1 text-sm text-amber-800/80">
              Browse files by section and open the exact document you need faster.
            </p>
          </div>
          <div className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
            {files.length} total file{files.length === 1 ? '' : 's'}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {groupedFiles.map((group) => (
            <a
              key={group.sectionId}
              href={`#${group.sectionId}`}
              className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-900 transition hover:bg-amber-100"
            >
              {formatGroupLabel(group.groupName)} ({group.files.length})
            </a>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {groupedFiles.map((group) => (
          <section key={group.sectionId} id={group.sectionId} className="scroll-mt-24">
            <div className="mb-3 rounded-2xl border border-amber-200 bg-amber-100/80 px-4 py-3 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-amber-950">
                  {formatGroupLabel(group.groupName)}
                </h3>
                <span className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-semibold text-amber-800">
                  {group.files.length} file{group.files.length === 1 ? '' : 's'}
                </span>
              </div>
            </div>

            <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {group.files.map((file, index) => {
                const extension = getFileExtension(file);
                const notes = normalizeDescription(file.description);
                const fileKey = file.ID ?? file.id ?? `${file.file_path}-${index}`;

                return (
                  <li
                    key={fileKey}
                    className="rounded-2xl border border-amber-100 bg-white p-4 shadow-sm transition hover:border-amber-200 hover:shadow-md"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-50">
                        <FileBadge extension={extension} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-700">
                          Document Type
                        </p>
                        <p className="mt-1 text-sm font-semibold text-gray-900">
                          {file.document_type_name || 'Unspecified document'}
                        </p>

                        <a
                          href={toStorageUrl(file.file_path)}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 block break-all text-sm font-medium text-blue-600 hover:underline"
                        >
                          {file.file_name || `File ${index + 1}`}
                        </a>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-900">
                            {formatSourceLabel(file.source)}
                          </span>
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                            Uploaded: {formatDateValue(file.uploaded_at)}
                          </span>
                        </div>

                        {notes ? (
                          <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-600">
                            Notes: {notes}
                          </p>
                        ) : null}
                      </div>
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
