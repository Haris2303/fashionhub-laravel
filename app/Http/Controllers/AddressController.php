<?php

namespace App\Http\Controllers;

use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AddressController extends Controller
{
    public function index()
    {
        $addresses = Address::where('user_id', Auth::id())
            ->orderBy('is_default', 'desc') // Yang default tampil paling atas
            ->latest()
            ->get();

        return Inertia::render('Profile/Address', [
            'addresses' => $addresses
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'recipient' => 'required',
            'phone' => 'required', // Pastikan kolom phone sudah ada di DB
            'complete_address' => 'required',
            'city' => 'required',
            'postal_code' => 'required',
        ]);

        // Cek apakah ini alamat pertama kali user? Kalau ya, paksa jadi default.
        $isFirstAddress = Address::where('user_id', Auth::id())->doesntExist();

        // Apakah user mencentang "Jadikan Utama" ATAU ini alamat pertama?
        $shouldBeDefault = $request->is_default || $isFirstAddress;

        // LOGIC PENJAGA: Jika mau jadi default, matikan default yang lain dulu
        if ($shouldBeDefault) {
            Address::where('user_id', Auth::id())->update(['is_default' => false]);
        }

        Address::create([
            'user_id' => Auth::id(),
            'title' => $request->title ?? 'Alamat',
            'recipient' => $request->recipient,
            'phone' => $request->phone,
            'complete_address' => $request->complete_address,
            'city' => $request->city,
            'postal_code' => $request->postal_code,
            'is_default' => $shouldBeDefault,
        ]);

        return redirect()->back()->with('success', 'Alamat berhasil ditambahkan!');
    }

    public function update(Request $request, $id)
    {
        $address = Address::where('user_id', Auth::id())->findOrFail($id);

        // LOGIC PENJAGA: Jika user mengubah alamat ini jadi Default
        if ($request->is_default) {
            // Reset semua alamat lain jadi false
            Address::where('user_id', Auth::id())->update(['is_default' => false]);
        }

        $address->update([
            'title' => $request->title,
            'recipient' => $request->recipient,
            'phone' => $request->phone,
            'complete_address' => $request->complete_address,
            'city' => $request->city,
            'postal_code' => $request->postal_code,
            // Jika request->is_default true, dia jadi true.
            // Jika false, dia jadi false (aman, karena yang lain tidak berubah).
            'is_default' => $request->is_default,
        ]);

        return redirect()->back()->with('success', 'Alamat berhasil diperbarui!');
    }

    public function destroy($id)
    {
        $address = Address::where('user_id', Auth::id())->findOrFail($id);

        // Opsional: Cegah hapus jika ini adalah alamat default satu-satunya
        // if ($address->is_default) {
        //     return redirect()->back()->withErrors(['error' => 'Ganti alamat utama lain sebelum menghapus ini.']);
        // }

        $address->delete();
        return redirect()->back()->with('success', 'Alamat berhasil dihapus!');
    }

    // Fungsi Cepat "Jadikan Utama"
    public function setDefault($id)
    {
        // 1. Reset SEMUA jadi false
        Address::where('user_id', Auth::id())->update(['is_default' => false]);

        // 2. Set HANYA YANG INI jadi true
        Address::where('user_id', Auth::id())
            ->where('id', $id)
            ->update(['is_default' => true]);

        return redirect()->back()->with('success', 'Alamat utama berhasil diubah!');
    }
}
