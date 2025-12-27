import React from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";

export default function Cart({ cartItems }) {
    const { auth } = usePage().props;

    // Helper Format Rupiah
    const formatRupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
    };

    // Hitung Total Belanja
    const total = cartItems.reduce(
        (acc, item) => acc + item.variant.price * item.quantity,
        0
    );

    // Handle Ubah Qty
    const updateQuantity = (id, quantity) => {
        if (quantity < 1) return;
        router.patch(`/cart/${id}`, { quantity }, { preserveScroll: true });
    };

    // Handle Hapus Item
    const removeItem = (id) => {
        if (confirm("Yakin ingin menghapus barang ini?")) {
            router.delete(`/cart/${id}`, { preserveScroll: true });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <Head title="Keranjang Belanja" />

            {/* Navbar Simple */}
            <nav className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <Link
                        href="/"
                        className="text-xl font-bold text-indigo-600"
                    >
                        FashionHub
                    </Link>
                    <div className="text-sm text-gray-600">
                        Halo, {auth.user.name}
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <h1 className="text-3xl font-bold mb-8">Keranjang Belanja</h1>

                {cartItems.length > 0 ? (
                    <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                        {/* Kolom KIRI: Daftar Barang */}
                        <div className="lg:col-span-8">
                            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                                <ul className="divide-y divide-gray-200">
                                    {cartItems.map((item) => (
                                        <li
                                            key={item.id}
                                            className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6"
                                        >
                                            {/* Gambar */}
                                            <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                                                <img
                                                    src={`/storage/${item.product.image}`}
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            {/* Info Produk */}
                                            <div className="flex-1 flex flex-col justify-between h-full w-full">
                                                <div>
                                                    <div className="flex justify-between">
                                                        <h3 className="text-lg font-medium text-gray-900">
                                                            <Link
                                                                href={`/product/${item.product.id}`}
                                                            >
                                                                {
                                                                    item.product
                                                                        .name
                                                                }
                                                            </Link>
                                                        </h3>
                                                        <p className="text-lg font-bold text-gray-900">
                                                            {formatRupiah(
                                                                item.variant
                                                                    .price *
                                                                    item.quantity
                                                            )}
                                                        </p>
                                                    </div>
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        Varian:{" "}
                                                        {item.variant.size} /{" "}
                                                        {item.variant.color}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Harga Satuan:{" "}
                                                        {formatRupiah(
                                                            item.variant.price
                                                        )}
                                                    </p>
                                                </div>

                                                <div className="mt-4 flex items-center justify-between">
                                                    {/* Kontrol Quantity */}
                                                    <div className="flex items-center border border-gray-300 rounded-md">
                                                        <button
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.id,
                                                                    item.quantity -
                                                                        1
                                                                )
                                                            }
                                                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                                            disabled={
                                                                item.quantity <=
                                                                1
                                                            }
                                                        >
                                                            -
                                                        </button>
                                                        <span className="px-3 py-1 text-gray-900 font-medium border-l border-r border-gray-300 min-w-[3rem] text-center">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.id,
                                                                    item.quantity +
                                                                        1
                                                                )
                                                            }
                                                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    {/* Tombol Hapus */}
                                                    <button
                                                        onClick={() =>
                                                            removeItem(item.id)
                                                        }
                                                        className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth={1.5}
                                                            stroke="currentColor"
                                                            className="w-4 h-4"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                                            />
                                                        </svg>
                                                        Hapus
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Kolom KANAN: Ringkasan Belanja */}
                        <div className="lg:col-span-4 mt-8 lg:mt-0">
                            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                                <h2 className="text-lg font-medium text-gray-900 mb-4">
                                    Ringkasan Pesanan
                                </h2>

                                <div className="flow-root">
                                    <dl className="-my-4 divide-y divide-gray-200 text-sm">
                                        <div className="py-4 flex items-center justify-between">
                                            <dt className="text-gray-600">
                                                Subtotal
                                            </dt>
                                            <dd className="font-medium text-gray-900">
                                                {formatRupiah(total)}
                                            </dd>
                                        </div>
                                        <div className="py-4 flex items-center justify-between">
                                            <dt className="text-gray-600">
                                                Pajak (PPN 11%)
                                            </dt>
                                            <dd className="font-medium text-gray-900">
                                                {formatRupiah(total * 0.11)}
                                            </dd>
                                        </div>
                                        <div className="py-4 flex items-center justify-between border-t border-gray-200">
                                            <dt className="text-base font-bold text-gray-900">
                                                Total Tagihan
                                            </dt>
                                            <dd className="text-base font-bold text-indigo-600">
                                                {formatRupiah(total * 1.11)}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>

                                <div className="mt-6">
                                    <button
                                        type="button"
                                        className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        onClick={() =>
                                            alert(
                                                "Fitur Checkout akan kita buat di langkah selanjutnya!"
                                            )
                                        }
                                    >
                                        Checkout Sekarang
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Tampilan Jika Keranjang Kosong
                    <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-gray-200">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-20 h-20 mx-auto text-gray-400 mb-4"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                            />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900">
                            Keranjang Anda kosong
                        </h3>
                        <p className="mt-1 text-gray-500">
                            Ayo mulai belanja dan temukan barang impianmu.
                        </p>
                        <div className="mt-6">
                            <Link
                                href="/"
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                Mulai Belanja
                            </Link>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
