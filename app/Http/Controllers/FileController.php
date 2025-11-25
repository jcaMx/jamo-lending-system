<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\FileService;

class FileController extends Controller
{
    public function __construct(
        protected FileService $service
    ) {}

    public function index()
    {
        $files = $this->service->getAll();
        return response()->json($files);
    }

    public function show($id)
    {
        $file = $this->service->getById($id);
        return response()->json($file);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'file_type'     => 'nullable|in:id_document,photo,contract,collateral_document',
            'file_name'     => 'required|string|max:20',
            'file_path'     => 'required|string|max:100',
            'description'   => 'nullable|string|max:100',
            'borrower_id'   => 'required|exists:borrower,id',
            'collateral_id' => 'nullable|exists:collateral,id',
        ]);

        $file = $this->service->create($validated);
        return response()->json($file, 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'file_type'     => 'nullable|in:id_document,photo,contract,collateral_document',
            'file_name'     => 'nullable|string|max:20',
            'file_path'     => 'nullable|string|max:100',
            'description'   => 'nullable|string|max:100',
            'borrower_id'   => 'nullable|exists:borrower,id',
            'collateral_id' => 'nullable|exists:collateral,id',
        ]);

        $file = $this->service->update($id, $validated);
        return response()->json($file);
    }

    public function destroy($id)
    {
        $this->service->delete($id);
        return response()->json(['message' => 'File deleted successfully']);
    }
}
