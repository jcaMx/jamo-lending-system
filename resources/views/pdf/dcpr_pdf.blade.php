<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Daily Cash Position Report </title>
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
        <h2>Daily Cash Position Report</h2>
        <p>Cotabato / Office · Address · Contact</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Date</th>
                <th>OR</th>
                <th>Account</th>
                <th>Amount</th>
                <th>PAYOR</th>
                <th>Paid Amount</th>
            </tr>
        </thead>
        <tbody>
            @php
                $totalAmount = 0;
                $totalPaid = 0;
            @endphp

            @foreach ($rows as $row)
                <tr>
                    <td>{{ $row['Date'] }}</td>
                    <td>{{ $row['OR'] }}</td>
                    <td>{{ $row['Account'] }}</td>
                    <td>₱{{ number_format($row['Amount']) }}</td>
                    <td>{{ $row['PAYOR'] }}</td>
                    <td>₱{{ number_format($row['PaidAmount']) }}</td>
                </tr>

                @php
                    $totalAmount += $row['Amount'];
                    $totalPaid += $row['PaidAmount'];
                @endphp
            @endforeach
        </tbody>
        <tfoot>
            <tr>
                <td colspan="3" style="text-align: right;">Totals:</td>
                <td>₱{{ number_format($totalAmount) }}</td>
                <td></td>
                <td>₱{{ number_format($totalPaid) }}</td>
            </tr>
        </tfoot>
    </table>
</body>
</html>
