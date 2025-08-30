<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('admin-only');
        $perPage = (int) $request->query('per_page', 15);
        return response()->json(User::paginate($perPage));
    }

    public function updateRole(Request $request, User $user)
    {
        $this->authorize('admin-only');
        $data = $request->validate([
            'role' => 'required|in:applicant,employer,admin',
        ]);
        $user->role = $data['role'];
        $user->save();
        return response()->json($user);
    }
}
