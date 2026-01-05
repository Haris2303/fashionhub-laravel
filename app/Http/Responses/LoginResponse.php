<?php

namespace App\Http\Responses;

use Filament\Auth\Http\Responses\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request)
    {
        if (auth()->user()->role === 'admin') {
            return redirect()->intended('/admin');
        }

        return redirect('/');
    }
}
