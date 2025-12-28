<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Transaction::with(['items.productVariant.product', 'payment'])
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        return Inertia::render('Order/History', [
            'orders' => $orders
        ]);
    }
}
