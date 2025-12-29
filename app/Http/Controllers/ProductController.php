<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function show($id)
    {
        $product = Product::with(['category', 'variants'])
            // Load Reviews urutkan terbaru, dan ambil data User-nya
            ->with(['reviews' => function ($q) {
                $q->with('user')->latest();
            }])
            // Hitung rata-rata rating
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->where('id', $id)
            ->firstOrFail();

        // Ambil Produk Serupa (Opsional)
        $relatedProducts = Product::where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->take(4)
            ->get();

        return Inertia::render('Product/Detail', [ // Sesuaikan nama file JSX Anda
            'product' => $product,
            'relatedProducts' => $relatedProducts,
        ]);
    }
}
