<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Models\Cart;
use App\Models\Transaction;
use App\Models\TransactionItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $cartItems = Cart::with(['product', 'variant'])->where('user_id', $user->id)->get();

        if ($cartItems->isEmpty()) {
            return redirect()->route('cart.index');
        }

        return Inertia::render('Checkout', [
            'cartItems' => $cartItems,
            'user' => $user
        ]);
    }

    public function store(Request $request)
    {
        // Validasi (HAPUS payment_method)
        $request->validate([
            'recipient' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'complete_address' => 'required|string',
            'city' => 'required|string',
            'postal_code' => 'required|string',
        ]);

        $user = Auth::user();

        try {
            DB::beginTransaction();

            // A. Cek Stok
            $cartItems = Cart::with('variant')->where('user_id', $user->id)->get();
            if ($cartItems->isEmpty()) throw new \Exception('Keranjang kosong');
            $totalPrice = 0;
            foreach ($cartItems as $item) {
                if ($item->variant->stock < $item->quantity) {
                    throw new \Exception("Stok {$item->product->name} kurang.");
                }
                $totalPrice += $item->variant->price * $item->quantity;
            }

            // B. Simpan Alamat
            $address = Address::create([
                'user_id' => $user->id,
                'recipient' => $request->recipient,
                'complete_address' => $request->complete_address,
                'city' => $request->city,
                'postal_code' => $request->postal_code,
                'is_default' => true,
            ]);

            if (empty($user->telp)) {
                $user->update(['telp' => $request->phone]);
            }

            // C. Buat Transaksi (Status: Pending)
            $transaction = Transaction::create([
                'user_id' => $user->id,
                'address_id' => $address->id,
                'total_price' => $totalPrice,
                'status' => 'pending',
            ]);

            // D. Pindah Item
            foreach ($cartItems as $item) {
                TransactionItem::create([
                    'transaction_id' => $transaction->id,
                    'product_variant_id' => $item->product_variant_id,
                    'quantity' => $item->quantity,
                    'price' => $item->variant->price,
                ]);
                $item->variant->decrement('stock', $item->quantity);
            }

            // E. Hapus Keranjang
            Cart::where('user_id', $user->id)->delete();

            DB::commit();

            // === PASTI KE SINI (UPLOAD BUKTI) ===
            return redirect()->route('payment.show', $transaction->id);
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function success($id)
    {
        return Inertia::render('Transaction/Success', ['id' => $id]);
    }
}
