// Define the types
type Comment = {
  id: string | number;
  author: string;
  text: string;
  date: string;
};

type Borrower = {
  comments?: Comment[];
};

// Add type to the props
export default function LoanCommentsTab({ borrower }: { borrower: Borrower }) {
  const list = borrower.comments || [];

  return (
    <div className="p-4 bg-gray-50 text-gray-600 rounded">
      {list.length ? (
        <ul>
          {list.map((c: Comment) => (
            <li key={c.id}>
              <strong>{c.author}</strong>: {c.text}
              <span className="text-sm text-gray-400"> ({c.date})</span>
            </li>
          ))}
        </ul>
      ) : (
        <div>No comments yet.</div>
      )}
    </div>
  );
}