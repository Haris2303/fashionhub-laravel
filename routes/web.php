<?php

use App\Http\Controllers\AddressController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductReviewController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/product/{id}', [ProductController::class, 'show'])->name('product.detail');

Route::middleware('guest')->group(function () {
    Route::get('/login', function () {
        return redirect()->route('filament.admin.auth.login');
    })->name('login');
    Route::get('/register', function () {
        return redirect()->route('filament.admin.auth.register');
    })->name('register');
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');
});

Route::middleware(['auth', 'role:customer'])->group(function () {

    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart/add', [CartController::class, 'store'])->name('cart.store');
    Route::patch('/cart/{id}', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/{id}', [CartController::class, 'destroy'])->name('cart.destroy');

    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');

    // Route Sukses
    Route::get('/transaction/success/{id}', [CheckoutController::class, 'success'])->name('transaction.success');

    Route::get('/payment/{id}', [PaymentController::class, 'show'])->name('payment.show');
    Route::post('/payment/{id}', [PaymentController::class, 'store'])->name('payment.store');

    Route::get('/my-orders', [OrderController::class, 'index'])->name('orders.index');

    Route::get('/addresses', [AddressController::class, 'index'])->name('address.index');
    Route::post('/addresses', [AddressController::class, 'store']);
    Route::put('/addresses/{id}', [AddressController::class, 'update']);
    Route::delete('/addresses/{id}', [AddressController::class, 'destroy']);
    Route::post('/addresses/{id}/default', [AddressController::class, 'setDefault']);

    Route::post('/products/{id}/review', [ProductReviewController::class, 'store'])->name('product.review.store');
});
