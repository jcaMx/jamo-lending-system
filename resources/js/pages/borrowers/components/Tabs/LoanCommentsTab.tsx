import React, { useEffect, useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';

type LoanCommentType = {
  ID: number;
  comment_text: string;
  commented_by: string | number;
  comment_date: string;
};

type Props = {
  comments: LoanCommentType[];
  loanId: number;
  canDelete?: boolean;
};

export default function LoanCommentsTab({ comments, loanId, canDelete = false }: Props) {
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [localComments, setLocalComments] = useState<LoanCommentType[]>(comments ?? []);
  const authUserName =
    ((usePage().props as { auth?: { user?: { name?: string } } })?.auth?.user?.name) || 'You';

  useEffect(() => {
    setLocalComments(comments ?? []);
  }, [comments]);

  const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
    comment_text: '',
  });

  const deleteForm = useForm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = data.comment_text.trim();
    if (!trimmed) {
      return;
    }
    const tempId = Date.now() * -1;
    const tempComment: LoanCommentType = {
      ID: tempId,
      comment_text: trimmed,
      commented_by: authUserName,
      comment_date: new Date().toISOString(),
    };
    setLocalComments((prev) => [tempComment, ...prev]);
    setData('comment_text', trimmed);
    post(route('loans.comments.add', { loan: loanId }), {
      onSuccess: () => {
        reset();
        clearErrors();
        setSuccessMessage('Comment added successfully.');
      },
      onError: () => {
        setLocalComments((prev) => prev.filter((c) => c.ID !== tempId));
      },
    });
  };

  const handleDelete = (commentId: number) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      setDeleteError(null);
      setDeletingId(commentId);
      deleteForm.delete(route('loans.comments.delete', { comment: commentId }), {
        onSuccess: () => {
          setLocalComments((prev) => prev.filter((c) => c.ID !== commentId));
          setDeletingId(null);
        },
        onError: () => {
          setDeletingId(null);
          setDeleteError('Failed to delete comment. Please try again.');
        },
      });
    }
  };

  const isCommentEmpty = data.comment_text.trim().length === 0;

  return (
    <div className="p-4 space-y-4">
      {/* Comment Field */}
      <form onSubmit={handleSubmit} className="p-4 bg-gray-50 rounded-lg shadow">
        <div className="mb-3">
          <label htmlFor="comment_text" className="block text-sm font-medium text-gray-700 mb-1">
            Add a Comment
          </label>
          <textarea
            id="comment_text"
            value={data.comment_text}
            onChange={(e) => setData('comment_text', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Type your comment..."
            required
          />
          {errors.comment_text && (
            <p className="mt-1 text-sm text-red-600">{errors.comment_text}</p>
          )}
          {isCommentEmpty && data.comment_text.length > 0 && !errors.comment_text && (
            <p className="mt-1 text-sm text-red-600">Comment cannot be empty.</p>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              reset();
              clearErrors();
            }}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={processing || isCommentEmpty}
            className="px-4 py-2 bg-[#D97706] text-white rounded hover:bg-[#C26A00] transition disabled:opacity-50"
          >
            {processing ? 'Submitting...' : 'Post Comment'}
          </button>
        </div>
      </form>

      {successMessage && (
        <p className="p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded">
          {successMessage}
        </p>
      )}

      {deleteError && (
        <p className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded">
          {deleteError}
        </p>
      )}

      {/* Comments List */}
      {!localComments || localComments.length === 0 ? (
        <p className="p-4 text-gray-500 text-center">No comments found for this loan.</p>
      ) : (
        <div className="space-y-3">
          {localComments.map((c) => (
            <div key={c.ID} className="p-4 bg-white rounded-lg shadow border border-gray-200">
              <div className="text-gray-700 mb-2">{c.comment_text}</div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  <span className="font-medium text-gray-700">{c.commented_by}</span>
                  {' • '}
                  <span>{new Date(c.comment_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
                {canDelete && (
                  <button
                    onClick={() => handleDelete(c.ID)}
                    disabled={deletingId === c.ID}
                    className="text-sm text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
                  >
                    {deletingId === c.ID ? 'Deleting...' : 'Delete'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
