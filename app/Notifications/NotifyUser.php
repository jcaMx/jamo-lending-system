<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\VonageMessage;

class NotifyUser extends Notification
{
    use Queueable;

    private string $message;
    private ?string $email;
    private ?string $sms;
    private ?string $subject;

    public function __construct(string $message,?string $subject = null,?string $email = null, ?string $sms = null)
    {
        $this->message = $message;
        $this->subject = $subject;
        $this->email = $email;
        // $this->sms = $sms;
    }

    /**
     * Choose channels dynamically.
     */
    public function via(object $notifiable): array
    {
        $channels = [];

        if ($this->email) {
            $channels[] = 'mail';
        }

        // if ($this->sms) {
        //     $channels[] = 'vonage';
        // }

        return $channels;
    }

    /**
     * Email Notification
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject($this->subject ?? 'Notification from JAMO Lending System')
            ->line($this->message);
    }


    /**
     * SMS Notification
     */
    // public function toVonage(object $notifiable): VonageMessage
    // {
    //     return (new VonageMessage)
    //         ->content($this->sms);
    // }

    public function toArray(object $notifiable): array
    {
        return [
            'message' => $this->message
        ];
    }
}
