<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        // $products = Product::with(['category', 'variants'])->latest()->take(8)->get();

        // return Inertia::render('Home', [
        //     'categories' => Category::all(),
        //     'products' => $products
        // ]);

        $categories = Category::all();

        // Hitung Keranjang (Jika Login)
        $cartCount = 0;
        if (Auth::check()) {
            // Menjumlahkan kolom 'quantity' (misal: beli 2 baju + 1 celana = 3)
            $cartCount = Cart::where('user_id', Auth::id())->sum('quantity');
        }

        $products = Product::with(['variants', 'category'])
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', '%' . $search . '%')
                    ->orWhere('description', 'like', '%' . $search . '%');
            })
            ->when($request->category_id, function ($query, $id) {
                $query->where('category_id', $id);
            })
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Home', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category_id']),
            'cartCount' => $cartCount, // <--- Kirim variable ini ke Frontend
        ]);
    }
}
