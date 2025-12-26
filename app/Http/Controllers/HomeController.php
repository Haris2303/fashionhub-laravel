<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $products = Product::with(['category', 'variants'])->latest()->take(8)->get();

        return Inertia::render('Home', [
            'categories' => Category::all(),
            'products' => $products
        ]);
    }
}
