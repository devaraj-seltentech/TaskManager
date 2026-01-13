<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Welcome</title>
</head>
<body>
    <h2>Hello {{ $user->name }}</h2>

    <p>Your employee account has been created.</p>

    <p><strong>Email:</strong> {{ $user->email }}</p>
    <p><strong>Temporary Password:</strong> {{ $tempPassword }}</p>

    <p>Please log in and change your password immediately.</p>

    <p>
        <a href="{{ config('app.frontend_url') }}/change-password">
            Change Password
        </a>
    </p>

    <p>— Team</p>
</body>
</html>
