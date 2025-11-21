<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Services\UserService;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UserController extends Controller
{
    public function __construct(private UserService $service) {}

    public function index(Request $req)
    {
        $filters = $req->only(['role','per_page']);
        return response()->json($this->service->getAll($filters));
    }

    public function show($id)
    {
        $user = $this->service->getById((int)$id);
        return $user ? response()->json($user) : response()->json(['message'=>'Not Found'], Response::HTTP_NOT_FOUND);
    }

    public function store(UserStoreRequest $req)
    {
        $user = $this->service->createUser($req->validated());
        return response()->json($user, Response::HTTP_CREATED);
    }

    public function update(UserUpdateRequest $req, $id)
    {
        $user = $this->service->updateUser((int)$id, $req->validated());
        return $user ? response()->json($user) : response()->json(['message'=>'Not Found'], Response::HTTP_NOT_FOUND);
    }

    public function destroy($id)
    {
        $ok = $this->service->deleteUser((int)$id);
        return response()->json(['success' => $ok]);
    }
}
