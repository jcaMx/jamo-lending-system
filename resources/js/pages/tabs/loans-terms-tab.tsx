// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';

// export default function LoanTermsTab() {
//   const { id } = useParams();
//   const [terms, setTerms] = useState(null);

//   useEffect(() => {
//     fetch(`/api/borrowers/${id}/terms`)
//       .then(res => res.json())
//       .then(setTerms);
//   }, [id]);

//   if (!terms) return <div>Loading...</div>;

//   return (
//     <div>
//       <h3>Loan Terms</h3>
//       <p><b>Status:</b> {terms.loan_status}</p>
//       <p><b>Type:</b> {terms.loan_type}</p>
//       <p><b>Principal:</b> {terms.principal}</p>
//       <p><b>Frequency:</b> {terms.frequency}</p>

//       <h4>Fees</h4>
//       <ul>
//         <li>Processing: {terms.fees.processing_fee}</li>
//         <li>Insurance: {terms.fees.insurance}</li>
//         <li>Notary: {terms.fees.notary}</li>
//         <li>Savings: {terms.fees.savings}</li>
//         <li>Total: {terms.fees.total}</li>
//       </ul>

//       <h4>Penalties</h4>
//       <p>Late Penalty: {terms.penalties.late_penalty_percent}%</p>
//       <p>Grace Period: {terms.penalties.grace_period_days} days</p>
//     </div>
//   );
// }
