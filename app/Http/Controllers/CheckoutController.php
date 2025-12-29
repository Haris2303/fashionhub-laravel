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

        // Ambil Keranjang + Relasi Varian & Produk
        $cartItems = Cart::with(['variant.product'])->where('user_id', $user->id)->get();

        if ($cartItems->isEmpty()) {
            return redirect()->route('cart.index');
        }

        // Ambil Alamat User (Default paling atas)
        $addresses = Address::where('user_id', $user->id)
            ->orderBy('is_default', 'desc')
            ->get();

        return Inertia::render('Checkout', [
            'cartItems' => $cartItems,
            'addresses' => $addresses, // Kirim list alamat ke Frontend
            'user' => $user
        ]);
    }

    public function store(Request $request)
    {
        // 1. Validasi: Cukup ID Alamat & Nama Kurir
        $request->validate([
            'address_id' => 'required|exists:addresses,id',
            'courier' => 'required|string',
        ]);

        $user = Auth::user();

        try {
            DB::beginTransaction();

            // 2. Cek Stok & Hitung Total
            $cartItems = Cart::with('variant.product')->where('user_id', $user->id)->get();
            if ($cartItems->isEmpty()) throw new \Exception('Keranjang kosong');

            $totalPrice = 0;
            foreach ($cartItems as $item) {
                if ($item->variant->stock < $item->quantity) {
                    throw new \Exception("Stok {$item->variant->product->name} kurang/habis.");
                }
                $totalPrice += $item->variant->price * $item->quantity;
            }

            // 3. Ambil Data Alamat dari ID yang dipilih user
            $selectedAddress = Address::where('user_id', $user->id)->find($request->address_id);

            // Buat SNAPSHOT Alamat (String Panjang)
            $addressSnapshot = "{$selectedAddress->recipient} ({$selectedAddress->phone}) | {$selectedAddress->complete_address}, {$selectedAddress->city}, {$selectedAddress->postal_code}";

            // 4. Buat Transaksi
            $transaction = Transaction::create([
                'user_id' => $user->id,
                'total_price' => $totalPrice,
                'status' => 'pending',
                'delivery_courier' => $request->courier, // Simpan Kurir
                'address' => $addressSnapshot, // Simpan Snapshot Alamat
            ]);

            // 5. Pindahkan Item & Kurangi Stok
            foreach ($cartItems as $item) {
                TransactionItem::create([
                    'transaction_id' => $transaction->id,
                    'product_variant_id' => $item->product_variant_id,
                    'quantity' => $item->quantity,
                    'price' => $item->variant->price,
                ]);

                // Kurangi Stok Real
                $item->variant->decrement('stock', $item->quantity);
            }

            // 6. Hapus Keranjang
            Cart::where('user_id', $user->id)->delete();

            DB::commit();

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
