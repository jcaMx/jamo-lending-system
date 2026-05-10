import React from 'react';
import { FileText } from 'lucide-react';

type SpouseType = {
  ID: number;
  first_name: string;
  last_name: string;
  contact_no?: string;
  occupation?: string;
  position?: string;
  agency_address?: string;
};

type FileType = {
  ID: number;
  file_name: string;
  file_path: string;
  description?: string;
};

interface Props {
  spouse: SpouseType | null;
  files: FileType[];
  maritalStatus: string;
}

const toStorageUrl = (filePath?: string) => {
  if (!filePath) return '#';
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) return filePath;
  return `/storage/${filePath.replace(/^\/+/, '').replace(/^public\//, '')}`;
};

export default function SpouseTab({ spouse, files, maritalStatus }: Props) {
  const marriageContract = files.find((f) => 
    f.description?.toLowerCase().includes('marriage_cert') || 
    f.file_name?.toLowerCase().includes('marriage') ||
    f.description?.toLowerCase().includes('type_id:31') // Assuming 31 is the ID for Marriage Cert based on seed order, but string match is safer
  );

  if (maritalStatus !== 'Married' && !spouse) {
    return (
      <div className="p-8 text-center text-gray-500 bg-white rounded-lg shadow-sm border border-gray-100">
        <p className="text-lg font-medium">Not Married</p>
        <p className="text-sm">This borrower's marital status is {maritalStatus || 'N/A'}.</p>
      </div>
    );
  }

  if (!spouse) {
      return (
        <div className="p-8 text-center text-gray-500 bg-white rounded-lg shadow-sm border border-gray-100">
          <p className="text-lg font-medium">No Spouse Details Found</p>
          <p className="text-sm">The borrower is marked as Married but no spouse information was provided.</p>
        </div>
      );
  }

  return (
    <div className="space-y-6">
      {/* Spouse Info Card */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Spouse Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Full Name</span>
            <span className="text-lg font-medium text-gray-900">{spouse.first_name} {spouse.last_name}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Contact Number</span>
            <span className="text-lg font-medium text-gray-900">{spouse.contact_no || 'N/A'}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Occupation</span>
            <span className="text-lg font-medium text-gray-900">{spouse.occupation || 'N/A'}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Position</span>
            <span className="text-lg font-medium text-gray-900">{spouse.position || 'N/A'}</span>
          </div>
          <div className="flex flex-col gap-1 md:col-span-2">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Agency Address</span>
            <span className="text-lg font-medium text-gray-900">{spouse.agency_address || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Marriage Contract Card */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Documents</h3>
        {marriageContract ? (
          <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-lg border border-amber-100">
            <div className="bg-amber-100 p-3 rounded-full">
              <FileText className="w-8 h-8 text-amber-600" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="font-semibold text-amber-900 truncate">{marriageContract.file_name}</p>
              <p className="text-xs text-amber-700 uppercase tracking-widest font-bold mt-1">Marriage Contract</p>
            </div>
            <a
              href={toStorageUrl(marriageContract.file_path)}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors shadow-sm text-sm font-medium"
            >
              View Document
            </a>
          </div>
        ) : (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-center text-gray-500 italic">
            No marriage contract document found.
          </div>
        )}
      </div>
    </div>
  );
}
