import React from 'react';

type LoanCommentType = {
  ID: number;
  comment_text: string;
  commented_by: string;
  comment_date: string;
};

export default function LoanCommentsTab({ comments }: { comments: LoanCommentType[] }) {
  if (!comments || comments.length === 0) {
    return <p className="p-4 text-gray-500">No comments found for this loan.</p>;
  }

  return (
    <div className="p-4 space-y-4">
      {comments.map((c) => (
        <div key={c.ID} className="p-4 bg-white rounded shadow">
          <div className="text-gray-700">{c.comment_text}</div>
          <div className="text-sm text-gray-500 mt-1">
            <span className="font-medium">{c.commented_by}</span> &bull; {new Date(c.comment_date).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}
