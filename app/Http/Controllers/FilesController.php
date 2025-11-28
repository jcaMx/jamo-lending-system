<?php
  namespace App\Http\Controllers;

  use App\Models\Files;
  use Illuminate\Http\Request;

  class FilesController extends Controller
  {
    public function store(Request $request)
    {
      if ($request->hasFile('ownership_proof')) {
        $file = $request->file('ownership_proof');
        $path = $file->store('ownership_proofs', 'public');

        Files::create([
            'file_type' => $file->getClientOriginalExtension(),
            'file_name' => $file->getClientOriginalName(),
            'file_path' => $path,
            'uploaded_at' => now(),
            'borrower_id' => $request->borrower_id,
            'collateral_id' => $request->collateral_id,
        ]);
      }

    // Save the rest of the loan application...
    }
}
