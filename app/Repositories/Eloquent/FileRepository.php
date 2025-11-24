<?php

namespace App\Repositories;

use App\Models\File;

class FileRepository
{
    public function all()
    {
        return File::with(['borrower', 'collateral'])->get();
    }

    public function find($id)
    {
        return File::with(['borrower', 'collateral'])->findOrFail($id);
    }

    public function create(array $data)
    {
        return File::create($data);
    }

    public function update($id, array $data)
    {
        $file = File::findOrFail($id);
        $file->update($data);

        return $file;
    }

    public function delete($id)
    {
        $file = File::findOrFail($id);
        return $file->delete();
    }
}
