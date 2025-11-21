<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Monthly Report</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #666; padding: 6px; text-align: left; }
        th { background: #f3f3f3; }
        tfoot td { font-weight: bold; background: #f9f9f9; }
        .header { text-align: center; margin-bottom: 20px; }
        .logo { height: 60px; }
    </style>
</head>
<body>
    <div class="header">
        <img src="{{ public_path('images/jamo-logo-2.png') }}" class="logo" />
        <h2>Monthly Report</h2>
        <p>Municipality / Office · Address · Contact</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Month</th>
                <th>Loan Released</th>
                <th>6% Deduction</th>
                <th>Advance 10% Interest</th>
                <th>Loan Principal Payment</th>
                <th>Loan Interest Payment</th>
            </tr>
        </thead>
        <tbody>
            @php
                $totals = ['loanReleased' => 0, 'sixPercentDeduction' => 0, 'advanceTenPercentDeduction' => 0, 'LPP' => 0, 'LIP' => 0];
            @endphp
            @foreach($rows as $row)
                <tr>
                    <td>{{ $row['month'] }}</td>
                    <td>₱{{ number_format($row['loanReleased']) }}</td>
                    <td>₱{{ number_format($row['sixPercentDeduction']) }}</td>
                    <td>₱{{ number_format($row['advanceTenPercentDeduction']) }}</td>
                    <td>₱{{ number_format($row['LPP']) }}</td>
                    <td>₱{{ number_format($row['LIP']) }}</td>
                </tr>
                @php
                    $totals['loanReleased'] += $row['loanReleased'];
                    $totals['sixPercentDeduction'] += $row['sixPercentDeduction'];
                    $totals['advanceTenPercentDeduction'] += $row['advanceTenPercentDeduction'];
                    $totals['LPP'] += $row['LPP'];
                    $totals['LIP'] += $row['LIP'];
                @endphp
            @endforeach
        </tbody>
        <tfoot>
            <tr>
                <td style="text-align:right;">Totals:</td>
                <td>₱{{ number_format($totals['loanReleased']) }}</td>
                <td>₱{{ number_format($totals['sixPercentDeduction']) }}</td>
                <td>₱{{ number_format($totals['advanceTenPercentDeduction']) }}</td>
                <td>₱{{ number_format($totals['LPP']) }}</td>
                <td>₱{{ number_format($totals['LIP']) }}</td>
            </tr>
        </tfoot>
    </table>
</body>
</html>
