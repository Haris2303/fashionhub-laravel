import React from "react";
import { Head, useForm, usePage } from "@inertiajs/react";

export default function Checkout({ cartItems, user }) {
    // Helper Rupiah
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

    // Setup Form (Hapus payment_method)
    const { data, setData, post, processing, errors } = useForm({
        recipient: user.name,
        phone: user.telp || "",
        complete_address: "",
        city: "",
        postal_code: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post("/checkout");
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 py-10">
            <Head title="Checkout" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold mb-8 text-center">
                    Checkout Pengiriman
                </h1>

                <form
                    onSubmit={submit}
                    className="lg:grid lg:grid-cols-12 lg:gap-8"
                >
                    {/* KIRI: Form Alamat */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">
                                Alamat Pengiriman
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Nama Penerima
                                    </label>
                                    <input
                                        type="text"
                                        value={data.recipient}
                                        onChange={(e) =>
                                            setData("recipient", e.target.value)
                                        }
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
                                        required
                                    />
                                    {errors.recipient && (
                                        <div className="text-red-500 text-xs mt-1">
                                            {errors.recipient}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        No. WhatsApp
                                    </label>
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) =>
                                            setData("phone", e.target.value)
                                        }
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
                                        required
                                    />
                                    {errors.phone && (
                                        <div className="text-red-500 text-xs mt-1">
                                            {errors.phone}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Alamat Lengkap
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={data.complete_address}
                                        onChange={(e) =>
                                            setData(
                                                "complete_address",
                                                e.target.value
                                            )
                                        }
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
                                        required
                                    />
                                    {errors.complete_address && (
                                        <div className="text-red-500 text-xs mt-1">
                                            {errors.complete_address}
                                        </div>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Kota
                                        </label>
                                        <input
                                            type="text"
                                            value={data.city}
                                            onChange={(e) =>
                                                setData("city", e.target.value)
                                            }
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Kode Pos
                                        </label>
                                        <input
                                            type="text"
                                            value={data.postal_code}
                                            onChange={(e) =>
                                                setData(
                                                    "postal_code",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* KANAN: Ringkasan */}
                    <div className="lg:col-span-5 mt-8 lg:mt-0">
                        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 sticky top-10">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">
                                Ringkasan Pesanan
                            </h2>
                            <ul className="divide-y divide-gray-200 mb-4">
                                {cartItems.map((item) => (
                                    <li
                                        key={item.id}
                                        className="py-3 flex justify-between text-sm"
                                    >
                                        <div>
                                            <span className="font-bold">
                                                {item.quantity}x{" "}
                                            </span>
                                            {item.product.name} (
                                            {item.variant.size})
                                        </div>
                                        <div>
                                            {formatRupiah(
                                                item.variant.price *
                                                    item.quantity
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div className="border-t pt-4 flex justify-between font-bold text-lg">
                                <span>Total Bayar</span>
                                <span className="text-indigo-600">
                                    {formatRupiah(total)}
                                </span>
                            </div>

                            {errors.error && (
                                <div className="mt-4 bg-red-100 text-red-700 p-3 rounded text-sm">
                                    {errors.error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={processing}
                                className="mt-6 w-full bg-indigo-600 text-white font-bold py-3 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {processing
                                    ? "Memproses..."
                                    : "Lanjut Pembayaran"}
                            </button>
                            <p className="text-xs text-gray-500 text-center mt-2">
                                Anda akan diarahkan ke halaman upload bukti
                                transfer.
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
