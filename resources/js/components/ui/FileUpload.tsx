// import React from "react";

// export default function FileUpload({ label, name, value, onChange, accept }) {
//   return (
//     <div className="flex flex-col mb-4">
//       <label htmlFor={name} className="font-medium mb-1">
//         {label}
//       </label>
//       <input
//         type="file"
//         id={name}
//         name={name}
//         accept={accept}
//         onChange={(e) => onChange(e.target.files[0] || null)}
//         className="border rounded px-2 py-1"
//       />
//       {value && (
//         <p className="text-sm text-gray-500 mt-1">Selected file: {value.name}</p>
//       )}
//     </div>
//   );
// }
