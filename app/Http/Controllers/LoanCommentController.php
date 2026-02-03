<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use Illuminate\Http\Request;

class LoanCommentController extends Controller
{
    public function store(Request $request, Loan $loan)
    {
        // Validate the comment
        $validated = $request->validate([
            'comment_text' => 'required|string|max:2000',
        ]);

        // Create the comment via relationship; Eloquent automatically sets loan_id
        $loan->loanComments()->create([
            'comment_text' => $validated['comment_text'],
            'commented_by' => auth()->id(),
            'comment_date' => now(),
        ]);

        return back()->with('success', 'Comment added successfully!');
    }
}
