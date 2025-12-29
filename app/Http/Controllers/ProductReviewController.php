<?php

namespace App\Http\Controllers;

use App\Models\ProductReview;
use App\Models\TransactionItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductReviewController extends Controller
{
    public function store(Request $request, $id)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:500',
        ]);

        // Cek apakah user pernah beli produk ini dengan status 'completed'
        $hasPurchased = TransactionItem::whereHas('transaction', function ($q) {
            $q->where('user_id', Auth::id())->where('status', 'completed');
        })->whereHas('productVariant', function ($q) use ($id) {
            $q->where('product_id', $id);
        })->exists();

        if (!$hasPurchased) {
            return back()->withErrors(['error' => 'Anda harus membeli produk ini sebelum memberi review.']);
        }

        $existingReview = ProductReview::where('user_id', Auth::id())
            ->where('product_id', $id)
            ->first();

        if ($existingReview) {
            // Update review lama
            $existingReview->update([
                'rating' => $request->rating,
                'comment' => $request->comment,
            ]);
            return back()->with('success', 'Ulasan Anda berhasil diperbarui!');
        }

        // Buat review baru
        ProductReview::create([
            'user_id' => Auth::id(),
            'product_id' => $id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return back()->with('success', 'Terima kasih atas ulasan Anda!');
    }
}
