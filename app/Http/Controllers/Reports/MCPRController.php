<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use PDF; // barryvdh/laravel-dompdf

class MCPRController extends Controller
{
    public function exportPdf(Request $request)
    {
        $rows = $request->input('rows', []);

        return PDF::loadView('pdf.mcpr_pdf', compact('rows'))
            ->download('Monthly_Report.pdf');

        // Download PDF
        return $pdf->download('Monthly_Report.pdf');
    }

    public function printPreview(Request $request): View
    {
        $rows = $request->input('rows', []);

        return view('pdf.mcpr_pdf', compact('rows'));
    }
}
