<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Mail\EmployeeWelcomeMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class AdminUserController extends Controller
{
    /**
     * Create a new employee (Admin only)
     */
    public function store(Request $request)
    {
        // ✅ Admin authorization
        if (! $request->user() || ! $request->user()->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // ✅ Validate ALL employee fields (ONLY ONCE)
        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'email'         => 'required|email|unique:users,email',
            'phone'         => 'nullable|string|max:20',
            'role'          => 'nullable|string|max:100',
            'department'    => 'nullable|string|max:100',
            'status'        => 'required|in:active,inactive',
            'joining_date'  => 'nullable|date',
            'is_admin'      => 'nullable|boolean',
        ]);

        // ✅ Generate temporary password
        $temporaryPassword = Str::random(10);

        // ✅ Create employee
        $user = User::create([
            'name'                  => $validated['name'],
            'email'                 => $validated['email'],
            'phone'                 => $validated['phone'] ?? null,
            'role'                  => $validated['role'] ?? null,
            'department'            => $validated['department'] ?? null,
            'status'                => $validated['status'],
            'joining_date'          => $validated['joining_date'] ?? null,
            'password'              => Hash::make($temporaryPassword),
            'is_admin'              => $validated['is_admin'] ?? false,
            'force_password_change' => true,
        ]);

        // ✅ Send welcome email with temp password
        Mail::to($user->email)
            ->send(new EmployeeWelcomeMail($user, $temporaryPassword));

        // ✅ JSON response (secure)
        return response()->json([
            'message' => 'Employee created successfully and email sent',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
                'department' => $user->department,
                'status' => $user->status,
                'joining_date' => $user->joining_date,
                'is_admin' => $user->is_admin,
                'force_password_change' => $user->force_password_change,
                'created_at' => $user->created_at,
            ],
        ], 201);
    }
}
