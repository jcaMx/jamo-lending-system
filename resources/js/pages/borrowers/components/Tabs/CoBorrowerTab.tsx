export default function CoBorrowerTab({ borrower }) {
    const list = borrower.coBorrowers || [];
  
    return (
      <div className="p-4 bg-gray-50 text-gray-600 rounded">
        {list.length ? (
          <ul>
            {list.map((c, i) => (
              <li key={i}>{c.name} — {c.relation}</li>
            ))}
          </ul>
        ) : (
          <div>No co-borrowers.</div>
        )}
      </div>
    );
  }
  