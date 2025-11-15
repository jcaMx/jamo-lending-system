// export default function BorrowerHeader({ borrower }) {
//   const { name, occupation, age, gender, email, mobile, landline, address, loan } =
//     borrower;

//   return (
//     <div className="border border-gray-200 p-4 rounded-md bg-gray-50">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
//         <div>
//           <h2 className="text-2xl font-semibold text-gray-800">{name}</h2>
//           <p className="text-gray-600">
//             {occupation} — {gender}, {age} years old
//           </p>
//         </div>

//         <div className="mt-4 md:mt-0">
//           <p className="text-sm text-gray-600">
//             <b>Email:</b> {email}
//           </p>
//           <p className="text-sm text-gray-600">
//             <b>Mobile:</b> {mobile}
//           </p>
//           <p className="text-sm text-gray-600">
//             <b>Landline:</b> {landline}
//           </p>
//         </div>
//       </div>

//       <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//         <p>
//           <b>Address:</b> {address.street}, {address.city}, {address.zipcode}
//         </p>
//         <div>
//           <b>Loan No:</b> {loan.loan_no} <br />
//           <b>Principal:</b> {loan.principal} <br />
//           <b>Interest:</b> {loan.interest} <br />
//           <b>Status:</b>{" "}
//           <span
//             className={`${
//               loan.status === "Active"
//                 ? "text-green-600"
//                 : "text-gray-500"
//             } font-semibold`}
//           >
//             {loan.status}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }
