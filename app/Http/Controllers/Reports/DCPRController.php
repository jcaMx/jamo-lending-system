<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use PDF; // barryvdh/laravel-dompdf

class DCPRController extends Controller
{
    public function exportPdf(Request $request)
    {
        $rows = $request->input('rows', []);

        return PDF::loadView('pdf.dcpr_pdf', compact('rows'))
            ->download('Daily_Cash_Position_Report.pdf');

        // Download PDF
        return $pdf->download('Daily_Cash_Position_Report.pdf');
    }

    public function printPreview(Request $request): View
    {
        $rows = $request->input('rows', []);

        return view('pdf.dcpr_pdf', compact('rows'));
    }
}
