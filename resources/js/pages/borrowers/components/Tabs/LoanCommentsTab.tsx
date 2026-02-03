import React from 'react';
import { useForm } from '@inertiajs/react';
import {route} from 'ziggy-js';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

type LoanCommentType = {
  ID: number;
  comment_text: string;
  commented_by: string | number;
  comment_date: string;
};

interface LoanCommentsTabProps {
  comments: LoanCommentType[];
  loanId: number; // must be numeric
}

export default function LoanCommentsTab({ comments, loanId }: LoanCommentsTabProps) {
  const { data, setData, post, processing, reset, errors } = useForm({
    comment_text: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!loanId || loanId <= 0) {
      console.error('[ERROR] loanId is missing or invalid! Cannot post comment.');
      return;
    }

    if (!data.comment_text.trim()) return;

    const routePath = route('loans.comments.store', loanId);
    post(routePath, {
      preserveScroll: true,
      onSuccess: () => reset('comment_text'),
      onError: (err) => console.error('[ERROR] Failed to add comment:', err),
    });
  };

  return (
    <div className="p-4 space-y-6">
      {/* Add New Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-4 pb-6 border-b">
        <Textarea
          placeholder="Write your comment here..."
          value={data.comment_text}
          onChange={(e) => setData('comment_text', e.target.value)}
          rows={3}
          disabled={processing}
          className={`resize-y ${errors.comment_text ? 'border-red-500 focus:ring-red-500' : ''}`}
        />
        {errors.comment_text && (
          <p className="text-red-600 text-sm">{errors.comment_text}</p>
        )}

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={processing || !data.comment_text.trim()}
            className="min-w-[120px] bg-amber-600 hover:bg-amber-700"
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              'Add Comment'
            )}
          </Button>
        </div>
      </form>

      {/* Comments List */}
      {comments.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No comments yet. Add one above!
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <div key={c.ID} className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="text-gray-800 whitespace-pre-wrap">{c.comment_text}</div>
              <div className="mt-2 text-sm text-gray-500 flex items-center gap-2">
                <span className="font-medium text-gray-700">{c.commented_by}</span>
                <span>•</span>
                <span>
                  {new Date(c.comment_date).toLocaleString('en-PH', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
