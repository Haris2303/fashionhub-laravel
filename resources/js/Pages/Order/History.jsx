import React from "react";
import { Head, Link } from "@inertiajs/react";

export default function History({ orders }) {
    // Helper Format Rupiah
    const formatRupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
    };

    // Helper Format Tanggal
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Helper Badge Status
    const renderStatusBadge = (status) => {
        switch (status) {
            case "pending":
                return (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full font-bold">
                        Menunggu Pembayaran
                    </span>
                );
            case "paid":
                return (
                    <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-bold">
                        Lunas (Diproses)
                    </span>
                );
            case "processing":
                return (
                    <span className="bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full font-bold">
                        Sedang Dikemas
                    </span>
                );
            case "shipped":
                return (
                    <span className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full font-bold">
                        Sedang Dikirim
                    </span>
                );
            case "completed":
                return (
                    <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-bold">
                        Selesai
                    </span>
                );
            case "failed":
                return (
                    <span className="bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full font-bold">
                        Dibatalkan
                    </span>
                );
            default:
                return (
                    <span className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full font-bold">
                        {status}
                    </span>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
            <Head title="Riwayat Pesanan" />

            {/* Navbar Sederhana */}
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <Link
                        href="/"
                        className="font-bold text-xl text-indigo-600"
                    >
                        FashionHub
                    </Link>
                    <Link
                        href="/"
                        className="text-sm text-gray-500 hover:text-indigo-600"
                    >
                        Kembali ke Home
                    </Link>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 mt-8">
                <h1 className="text-2xl font-bold mb-6">Pesanan Saya</h1>

                {orders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 mb-4">
                            Kamu belum pernah belanja nih.
                        </p>
                        <Link
                            href="/"
                            className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700"
                        >
                            Mulai Belanja
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                            >
                                {/* Header Card: ID, Tanggal, Status */}
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="font-bold text-gray-900">
                                                Order #{order.id}
                                            </span>
                                            {renderStatusBadge(order.status)}
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            {formatDate(order.created_at)}
                                        </p>
                                    </div>

                                    {/* Tombol Action jika Pending */}
                                    {order.status === "pending" && (
                                        <Link
                                            href={`/payment/${order.id}`}
                                            className="bg-indigo-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-indigo-700 text-center"
                                        >
                                            Upload Bukti Bayar
                                        </Link>
                                    )}
                                </div>

                                {/* Body Card: Info Pengiriman & Item */}
                                <div className="p-6">
                                    {/* INFO RESI (Hanya muncul jika sudah dikirim) */}
                                    {(order.status === "shipped" ||
                                        order.status === "completed") && (
                                        <div className="mb-6 bg-blue-50 border border-blue-100 p-4 rounded-lg">
                                            <h3 className="text-sm font-bold text-blue-800 mb-2 flex items-center">
                                                <svg
                                                    className="w-4 h-4 mr-2"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                                                    ></path>
                                                </svg>
                                                Info Pengiriman
                                            </h3>
                                            <div className="flex gap-8 text-sm">
                                                <div>
                                                    <span className="block text-gray-500 text-xs">
                                                        Kurir
                                                    </span>
                                                    <span className="font-bold text-gray-900">
                                                        {order.delivery_courier ||
                                                            "-"}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="block text-gray-500 text-xs">
                                                        No. Resi
                                                    </span>
                                                    <span className="font-bold text-gray-900 font-mono select-all bg-white px-2 py-0.5 rounded border border-blue-200">
                                                        {order.tracking_number ||
                                                            "-"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* List Item */}
                                    <ul className="divide-y divide-gray-100">
                                        {order.items.map((item) => (
                                            <li
                                                key={item.id}
                                                className="py-4 flex gap-4"
                                            >
                                                {/* Foto Produk */}
                                                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                                    <img
                                                        src={`/storage/${item.product_variant.product.image}`}
                                                        alt={
                                                            item.product_variant
                                                                .product.name
                                                        }
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>

                                                {/* Detail Produk */}
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900 line-clamp-1">
                                                        {
                                                            item.product_variant
                                                                .product.name
                                                        }
                                                    </h4>
                                                    <p className="text-sm text-gray-500 mb-1">
                                                        Size:{" "}
                                                        {
                                                            item.product_variant
                                                                .size
                                                        }{" "}
                                                        x {item.quantity}
                                                    </p>
                                                    <p className="text-sm font-bold text-indigo-600">
                                                        {formatRupiah(
                                                            item.price
                                                        )}
                                                    </p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Total Harga */}
                                    <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-center">
                                        <span className="text-gray-600 font-medium">
                                            Total Belanja
                                        </span>
                                        <span className="text-xl font-bold text-gray-900">
                                            {formatRupiah(order.total_price)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
