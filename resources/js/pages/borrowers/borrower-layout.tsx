// import { useEffect, useState } from "react";
// import { useParams, NavLink, Outlet } from "react-router-dom";

// import BorrowerHeader from "../components/BorrowerHeader.tsx";

// export default function BorrowerLayout() {
//   const { id } = useParams();
//   const [borrower, setBorrower] = useState(null);

//   useEffect(() => {
//     fetch(`/api/borrowers/${id}`)
//       .then((res) => res.json())
//       .then((data) => setBorrower(data));
//   }, [id]);

//   if (!borrower)
//     return <div className="text-center text-gray-500 mt-10">Loading...</div>;

//   const tabs = [
//     { name: "Repayments", path: "repayments" },
//     { name: "Loan Terms", path: "terms" },
//     { name: "Loan Schedule", path: "schedule" },
//     { name: "Loan Collateral", path: "collateral" },
//     { name: "Loan Comments", path: "comments" },
//   ];

//   return (
//     <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg mt-8 p-6">
//       <BorrowerHeader borrower={borrower} />

//       <div className="border-b border-gray-200 mt-6">
//         <nav className="flex space-x-4" aria-label="Tabs">
//           {tabs.map((tab) => (
//             <NavLink
//               key={tab.path}
//               to={tab.path}
//               className={({ isActive }) =>
//                 isActive
//                   ? "px-4 py-2 text-sm font-medium text-primary border-b-2 border-primary"
//                   : "px-4 py-2 text-sm font-medium text-gray-500 hover:text-primary"
//               }
//             >
//               {tab.name}
//             </NavLink>
//           ))}
//         </nav>
//       </div>

//       <div className="mt-6">
//         <Outlet />
//       </div>
//     </div>
//   );
// }
