<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use App\Mail\EmployeeWelcomeMail;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $users = User::select(
                'id',
                'name',
                'email',
                'is_admin',
                'force_password_change',
                'created_at'
            )
            ->orderBy('name')
            ->get();

        return response()->json($users);
    }
}
