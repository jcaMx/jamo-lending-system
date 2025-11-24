export default function LoanFilesTab({ borrower }) {
    return (
      <div className="p-4 bg-gray-50 text-gray-600 rounded">
        <ul>
          {(borrower.files || []).map(f => (
            <li key={f.id}>{f.name}</li>
          ))}
        </ul>
      </div>
    );
  }
  