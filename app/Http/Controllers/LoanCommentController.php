<?php

namespace App\Http\Controllers;

use App\Models\LoanComment;
use App\Models\Loan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoanCommentController extends Controller
{
    public function store(Request $request, Loan $loan)
    {
        $validated = $request->validate([
            'comment_text' => 'required|string|max:2000',
        ]);

        $loan->loanComments()->create([
            'comment_text' => $validated['comment_text'],
            'commented_by' => Auth::id(),
            'comment_date' => now(),
        ]);

        return back()->with('success', 'Comment added successfully!');
    }

    public function destroy(LoanComment $comment)
    {
        $comment->delete();

        return back()->with('success', 'Comment deleted successfully!');
    }
}
