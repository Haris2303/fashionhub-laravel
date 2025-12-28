<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function show($id)
    {
        // Cek transaksi milik user
        $transaction = Transaction::where('user_id', Auth::id())
            ->where('status', 'pending')
            ->findOrFail($id);

        return Inertia::render('Payment/Show', [
            'transaction' => $transaction
        ]);
    }

    // Kita namakan 'store' karena membuat record baru di tabel payments
    public function store(Request $request, $id)
    {
        $request->validate([
            'payment_proof' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $transaction = Transaction::where('user_id', Auth::id())->findOrFail($id);

        // Upload File
        if ($request->hasFile('payment_proof')) {
            $path = $request->file('payment_proof')->store('payments', 'public');

            // 1. Simpan ke tabel 'payments' (SESUAI STRUKTUR ANDA)
            Payment::create([
                'transaction_id' => $transaction->id,
                'payment_method' => 'bank_transfer', // Default sesuai migrasi Anda
                'payment_proof' => $path,
                'status' => 'pending', // Verifikasi admin nanti
            ]);

            $transaction = Transaction::where('user_id', Auth::id())->findOrFail($id);

            // Upload File
            if ($request->hasFile('proof_of_payment')) {
                $path = $request->file('proof_of_payment')->store('payments', 'public');

                $transaction->update([
                    'proof_of_payment' => $path,
                    'status' => 'pending',
                ]);
            }
        }

        return redirect()->route('transaction.success', $transaction->id);
    }
}
