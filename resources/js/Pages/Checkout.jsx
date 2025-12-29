import React, { useState, useEffect } from "react";
import { Head, useForm, Link } from "@inertiajs/react";

export default function Checkout({ cartItems, addresses }) {
    // 1. Logika Pilih Alamat Awal (Default atau yg pertama)
    const defaultAddress =
        addresses.find((a) => a.is_default) || addresses[0] || null;

    const [selectedAddress, setSelectedAddress] = useState(defaultAddress);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form Inertia hanya kirim ID & Kurir
    const { data, setData, post, processing, errors } = useForm({
        address_id: selectedAddress ? selectedAddress.id : "",
        courier: "",
    });

    // Update form jika user ganti alamat lewat modal
    useEffect(() => {
        if (selectedAddress) {
            setData("address_id", selectedAddress.id);
        }
    }, [selectedAddress]);

    const formatRupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
    };

    const total = cartItems.reduce(
        (acc, item) => acc + item.variant.price * item.quantity,
        0
    );

    const submit = (e) => {
        e.preventDefault();
        post("/checkout");
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
            <Head title="Checkout" />

            {/* Navbar */}
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <Link
                        href="/"
                        className="font-bold text-xl text-indigo-600"
                    >
                        FashionHub
                    </Link>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 mt-8">
                <h1 className="text-2xl font-bold mb-6">Pengiriman</h1>

                {/* Tampilkan Error Backend jika ada */}
                {errors.error && (
                    <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        <strong className="font-bold">Gagal: </strong>
                        <span className="block sm:inline">{errors.error}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* KOLOM KIRI: ALAMAT & KURIR */}
                    <div className="md:col-span-2 space-y-6">
                        {/* 1. BAGIAN ALAMAT */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-gray-800">
                                    Alamat Pengiriman
                                </h3>
                                {addresses.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(true)}
                                        className="text-sm text-indigo-600 font-bold hover:underline"
                                    >
                                        Pilih Alamat Lain
                                    </button>
                                )}
                            </div>

                            {selectedAddress ? (
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-gray-900">
                                            {selectedAddress.recipient}
                                        </span>
                                        <span className="text-gray-500 text-sm">
                                            ({selectedAddress.title || "Alamat"}
                                            )
                                        </span>
                                        {selectedAddress.is_default == 1 && (
                                            <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 rounded font-bold">
                                                UTAMA
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-600 text-sm">
                                        {selectedAddress.phone}
                                    </p>
                                    <p className="text-gray-600 text-sm mt-1">
                                        {selectedAddress.complete_address}
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                        {selectedAddress.city},{" "}
                                        {selectedAddress.postal_code}
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center py-6 bg-red-50 border border-red-100 rounded-lg">
                                    <p className="text-red-600 mb-3 text-sm">
                                        Anda belum memiliki alamat.
                                    </p>
                                    <Link
                                        href="/addresses"
                                        className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold"
                                    >
                                        + Buat Alamat Baru
                                    </Link>
                                </div>
                            )}
                            {errors.address_id && (
                                <p className="text-red-500 text-sm mt-2">
                                    Mohon pilih alamat pengiriman.
                                </p>
                            )}
                        </div>

                        {/* 2. BAGIAN KURIR */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="font-bold text-gray-800 mb-4">
                                Pilih Kurir
                            </h3>
                            <div className="space-y-3">
                                {[
                                    "JNE Regular",
                                    "J&T Express",
                                    "SiCepat Halu",
                                    "Pos Indonesia",
                                ].map((courier) => (
                                    <label
                                        key={courier}
                                        className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                                            data.courier === courier
                                                ? "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600"
                                                : "hover:bg-gray-50"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="courier"
                                            value={courier}
                                            checked={data.courier === courier}
                                            onChange={(e) =>
                                                setData(
                                                    "courier",
                                                    e.target.value
                                                )
                                            }
                                            className="text-indigo-600 focus:ring-indigo-500 mr-3"
                                        />
                                        <span className="font-medium text-gray-700">
                                            {courier}
                                        </span>
                                    </label>
                                ))}
                            </div>
                            {errors.courier && (
                                <p className="text-red-500 text-sm mt-2">
                                    {errors.courier}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* KOLOM KANAN: RINGKASAN */}
                    <div className="md:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-24">
                            <h3 className="font-bold text-lg mb-4">
                                Ringkasan Belanja
                            </h3>
                            <ul className="space-y-4 mb-4">
                                {cartItems.map((item) => (
                                    <li
                                        key={item.id}
                                        className="flex gap-3 text-sm"
                                    >
                                        <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                            <img
                                                src={`/storage/${item.variant.product.image}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium line-clamp-1">
                                                {item.variant.product.name}
                                            </p>
                                            <p className="text-gray-500 text-xs">
                                                Size: {item.variant.size}
                                            </p>
                                            <p className="text-gray-500 text-xs">
                                                {item.quantity} x{" "}
                                                {formatRupiah(
                                                    item.variant.price
                                                )}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between font-bold text-lg text-gray-900 pt-2">
                                    <span>Total Bayar</span>
                                    <span>{formatRupiah(total)}</span>
                                </div>
                            </div>

                            <button
                                onClick={submit}
                                disabled={processing || !selectedAddress}
                                className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                {processing ? "Memproses..." : "Buat Pesanan"}
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* MODAL PILIH ALAMAT */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
                    <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Pilih Alamat</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-3">
                            {addresses.map((addr) => (
                                <div
                                    key={addr.id}
                                    onClick={() => {
                                        setSelectedAddress(addr);
                                        setIsModalOpen(false);
                                    }}
                                    className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition ${
                                        selectedAddress?.id === addr.id
                                            ? "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600"
                                            : "border-gray-200"
                                    }`}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-gray-900">
                                            {addr.recipient}
                                        </span>
                                        <span className="text-xs bg-gray-200 px-2 rounded text-gray-600">
                                            {addr.title || "Alamat"}
                                        </span>
                                        {addr.is_default == 1 && (
                                            <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 rounded font-bold">
                                                UTAMA
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        {addr.phone}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                                        {addr.complete_address}, {addr.city}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 pt-4 border-t text-center">
                            <Link
                                href="/addresses"
                                className="text-indigo-600 font-bold text-sm hover:underline"
                            >
                                + Kelola / Tambah Alamat Baru
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
