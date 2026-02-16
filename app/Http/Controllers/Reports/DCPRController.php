<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use PDF;

class DCPRController extends Controller
{
    public function index(Request $request)
    {
        $date = $request->input('date')
            ? Carbon::parse($request->input('date'))->toDateString()
            : Carbon::today()->toDateString();

        $rows = Payment::with(['loan.borrower'])
            ->whereDate('payment_date', $date)
            ->orderBy('payment_date')
            ->get()
            ->map(function ($payment) {
                $borrower = $payment->loan?->borrower;

                return [
                    'Date' => optional($payment->payment_date)->toDateString(),
                    'OR' => $payment->receipt_number ?: (string) $payment->ID,
                    'Account' => $payment->loan?->loan_type ?? 'Loan Payment',
                    'Amount' => (float) $payment->amount,
                    'PAYOR' => $borrower
                        ? trim($borrower->first_name.' '.$borrower->last_name)
                        : 'N/A',
                    'PaidAmount' => (float) $payment->amount,
                ];
            })
            ->values()
            ->all();

        return Inertia::render('Reports/DCPR', [
            'rows' => $rows,
            'reportDate' => $date,
        ]);
    }

    public function exportPdf(Request $request)
    {
        $rows = $request->input('rows', []);

        return PDF::loadView('pdf.dcpr_pdf', compact('rows'))
            ->download('Daily_Cash_Position_Report.pdf');
    }

    public function printPreview(Request $request)
    {
        $rows = $request->input('rows', []);

        return view('pdf.dcpr_pdf', compact('rows'));
    }
}
