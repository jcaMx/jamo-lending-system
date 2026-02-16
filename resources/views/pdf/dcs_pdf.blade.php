<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Daily Collection Sheet</title>
    <style>
        @page { margin: 22px; }
        body { font-family: DejaVu Sans, Arial, sans-serif; font-size: 11px; color: #111827; }
        .header { border-bottom: 2px solid #1f2937; padding-bottom: 10px; margin-bottom: 12px; }
        .header-row { width: 100%; }
        .title { font-size: 18px; font-weight: bold; margin: 0; text-transform: uppercase; }
        .subtitle { margin: 3px 0 0 0; color: #4b5563; }
        .meta { margin-top: 6px; font-size: 10px; color: #374151; }
        .summary { margin: 10px 0 12px 0; }
        .summary-box { display: inline-block; width: 31%; margin-right: 2%; border: 1px solid #d1d5db; padding: 8px; vertical-align: top; }
        .summary-box:last-child { margin-right: 0; }
        .summary-label { font-size: 9px; color: #6b7280; text-transform: uppercase; margin-bottom: 4px; }
        .summary-value { font-size: 12px; font-weight: bold; color: #111827; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; }
        th, td { border: 1px solid #d1d5db; padding: 6px; text-align: left; }
        th { background: #f3f4f6; font-size: 10px; text-transform: uppercase; }
        td { font-size: 10px; }
        .text-right { text-align: right; }
        .tfoot td { font-weight: bold; background: #f9fafb; }
        .signatures { margin-top: 20px; width: 100%; }
        .sign-col { width: 32%; display: inline-block; margin-right: 2%; vertical-align: top; }
        .sign-col:last-child { margin-right: 0; }
        .sign-line { margin-top: 30px; border-top: 1px solid #111827; padding-top: 4px; font-size: 9px; color: #374151; }
    </style>
</head>
<body>
    @php
        $isCollections = $tab === 'collections';
        $recordCount = $isCollections ? count($collections) : count($due_loans);
        $totalAmount = $isCollections
            ? collect($collections)->sum('amount')
            : collect($due_loans)->sum('total_due');
    @endphp

    <div class="header">
        <table class="header-row">
            <tr>
                <td style="border: 0; padding: 0; width: 70px;">
                    <img src="{{ public_path('images/jamo-logo-2.png') }}" style="height: 52px;" alt="Logo" />
                </td>
                <td style="border: 0; padding: 0;">
                    <h2 class="title">Daily Collection Sheet</h2>
                    <p class="subtitle">{{ $isCollections ? 'Collections Tab' : 'Due Loans Tab' }}</p>
                    <p class="meta">
                        Date: {{ $date }}
                        @if (!empty($collector))
                            | Collector: {{ $collector }}
                        @endif
                    </p>
                </td>
            </tr>
        </table>
    </div>

    <div class="summary">
        <div class="summary-box">
            <div class="summary-label">Report Type</div>
            <div class="summary-value">{{ $isCollections ? 'Collections' : 'Due Loans' }}</div>
        </div>
        <div class="summary-box">
            <div class="summary-label">Records</div>
            <div class="summary-value">{{ number_format($recordCount) }}</div>
        </div>
        <div class="summary-box">
            <div class="summary-label">{{ $isCollections ? 'Total Collected' : 'Total Due' }}</div>
            <div class="summary-value">PHP {{ number_format($totalAmount, 2) }}</div>
        </div>
    </div>

    @if ($isCollections)
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Borrower</th>
                    <th>Loan No</th>
                    <th>Schedule #</th>
                    <th>Due Date</th>
                    <th class="text-right">Amount</th>
                    <th>Method</th>
                    <th>Reference No</th>
                    <th>Collected By</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($collections as $index => $collection)
                    <tr>
                        <td>{{ $index + 1 }}</td>
                        <td>{{ $collection['name'] }}</td>
                        <td>{{ $collection['loanNo'] }}</td>
                        <td>{{ $collection['schedule_no'] }}</td>
                        <td>{{ $collection['due_date'] ?? 'N/A' }}</td>
                        <td class="text-right">PHP {{ number_format($collection['amount'], 2) }}</td>
                        <td>{{ $collection['method'] }}</td>
                        <td>{{ $collection['reference_no'] ?? 'N/A' }}</td>
                        <td>{{ $collection['collected_by'] }}</td>
                        <td>{{ $collection['collection_date'] }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="10" style="text-align: center;">No collections found for this date.</td>
                    </tr>
                @endforelse
            </tbody>
            <tfoot class="tfoot">
                <tr>
                    <td colspan="5" class="text-right">Total Collected</td>
                    <td class="text-right">PHP {{ number_format($totalAmount, 2) }}</td>
                    <td colspan="4"></td>
                </tr>
            </tfoot>
        </table>
    @else
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Borrower</th>
                    <th>Loan No</th>
                    <th class="text-right">Principal</th>
                    <th class="text-right">Interest</th>
                    <th class="text-right">Penalty</th>
                    <th class="text-right">Total Due</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($due_loans as $index => $loan)
                    <tr>
                        <td>{{ $index + 1 }}</td>
                        <td>{{ $loan['name'] }}</td>
                        <td>{{ $loan['loanNo'] }}</td>
                        <td class="text-right">PHP {{ number_format($loan['principal'], 2) }}</td>
                        <td class="text-right">PHP {{ number_format($loan['interest'], 2) }}</td>
                        <td class="text-right">PHP {{ number_format($loan['penalty'], 2) }}</td>
                        <td class="text-right">PHP {{ number_format($loan['total_due'], 2) }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="7" style="text-align: center;">No due loans found for this date.</td>
                    </tr>
                @endforelse
            </tbody>
            <tfoot class="tfoot">
                <tr>
                    <td colspan="6" class="text-right">Total Due</td>
                    <td class="text-right">PHP {{ number_format($totalAmount, 2) }}</td>
                </tr>
            </tfoot>
        </table>
    @endif

    <div class="signatures">
        <div class="sign-col">
            <div class="sign-line">Prepared By</div>
        </div>
        <div class="sign-col">
            <div class="sign-line">Checked By</div>
        </div>
        <div class="sign-col">
            <div class="sign-line">Approved By</div>
        </div>
    </div>
</body>
</html>
