import React from "react";
import { Head, Link } from "@inertiajs/react";

export default function Success({ id }) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Head title="Order Berhasil" />
            <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                        className="w-8 h-8 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                        ></path>
                    </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Pesanan Berhasil!</h2>
                <p className="text-gray-600 mb-6">
                    Nomor Order: <b>#{id}</b>
                </p>
                <Link
                    href="/"
                    className="block w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700"
                >
                    Kembali Belanja
                </Link>
            </div>
        </div>
    );
}
