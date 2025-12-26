<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function show($id)
    {
        $product = Product::with(['category', 'variants'])->findOrFail($id);

        return Inertia::render('Product/Detail', [
            'product' => $product,
        ]);
    }
}
