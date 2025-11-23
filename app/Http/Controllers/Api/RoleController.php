<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\RoleService;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function __construct(private RoleService $service) {}

    public function index()
    {
        return response()->json($this->service->all());
    }

    public function store(Request $req)
    {
        $data = $req->only(['name','description','permissions']);
        $role = $this->service->createRole($data);
        return response()->json($role, 201);
    }
}
