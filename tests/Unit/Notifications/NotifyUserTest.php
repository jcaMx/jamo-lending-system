<?php

use App\Models\User;
use App\Notifications\NotifyUser;

test('notify user uses the mail channel when an email is provided', function () {
    $user = new User([
        'email' => 'jane.notify@example.com',
    ]);

    $notification = new NotifyUser(
        message: 'Your customer account has been created.',
        subject: 'Welcome to JAMO Lending System',
        email: $user->email,
    );

    expect($notification->via($user))->toBe(['mail']);
});

test('notify user builds the expected mail message', function () {
    $user = new User([
        'email' => 'jane.notify@example.com',
    ]);

    $notification = new NotifyUser(
        message: 'Your customer account has been created.',
        subject: 'Welcome to JAMO Lending System',
        email: $user->email,
    );

    $mail = $notification->toMail($user);

    expect($mail->subject)->toBe('Welcome to JAMO Lending System');
    expect($mail->introLines)->toContain('Your customer account has been created.');
});
