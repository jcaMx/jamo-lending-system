@component('mail::layout')
    {{-- Header --}}
    @slot('header')
        @component('mail::header', ['url' => config('app.url')])
            <img src="{{ asset('images/jamo-logo-1.png') }}" height="48" alt="App Logo">
        @endcomponent
    @endslot

    {{-- Body --}}
    <div style="background:#FFEE93; padding:24px; border-radius:12px;">
        <h2>Hello 👋</h2>

        <p style="font-size:15px; color:#333;">
            {{ $message }}
        </p>
    </div>

    {{-- Footer --}}
    @slot('footer')
        @component('mail::footer')
            © {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
        @endcomponent
    @endslot
@endcomponent
