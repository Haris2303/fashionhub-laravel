<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Ambil cart milik user, beserta data produk & varian
        $cartItems = Cart::with(['product', 'variant'])
            ->where('user_id', $user->id)
            ->get();

        return Inertia::render('Cart', [
            'cartItems' => $cartItems,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'product_variant_id' => 'required|exists:product_variants,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $user = Auth::user();

        // Cek stok dulu biar aman
        $variant = ProductVariant::find($request->product_variant_id);
        if ($variant->stock < $request->quantity) {
            return back()->withErrors(['quantity' => 'Stok tidak mencukupi.']);
        }

        // Cek apakah barang ini sudah ada di keranjang user?
        $existingCart = Cart::where('user_id', $user->id)
            ->where('product_variant_id', $request->product_variant_id)
            ->first();

        if ($existingCart) {
            // Kalau sudah ada, tambahkan jumlahnya saja
            $existingCart->increment('quantity', $request->quantity);
        } else {
            // Kalau belum, buat baru
            Cart::create([
                'user_id' => $user->id,
                'product_id' => $request->product_id,
                'product_variant_id' => $request->product_variant_id,
                'quantity' => $request->quantity,
            ]);
        }

        return redirect()->back()->with('success', 'Berhasil masuk keranjang!');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = Cart::where('user_id', Auth::id())->findOrFail($id);

        // Cek stok lagi biar gak bablas
        if ($cart->variant->stock < $request->quantity) {
            return back()->withErrors(['quantity' => 'Stok maksimal hanya ' . $cart->variant->stock]);
        }

        $cart->update([
            'quantity' => $request->quantity
        ]);

        return redirect()->back();
    }

    public function destroy($id)
    {
        $cart = Cart::where('user_id', Auth::id())->findOrFail($id);
        $cart->delete();

        return redirect()->back();
    }
}
