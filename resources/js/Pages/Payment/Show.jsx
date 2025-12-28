import React from "react";
import { Head, useForm } from "@inertiajs/react";

export default function Show({ transaction }) {
    const { data, setData, post, processing, errors } = useForm({
        proof_of_payment: null,
    });

    const formatRupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
    };

    const submit = (e) => {
        e.preventDefault();
        post(`/payment/${transaction.id}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Head title="Pembayaran" />

            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Selesaikan Pembayaran
                    </h2>
                    <p className="text-gray-500">Order ID: #{transaction.id}</p>
                </div>

                {/* Info Rekening */}
                <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg mb-6">
                    <p className="text-sm text-indigo-800 mb-1">
                        Total Tagihan:
                    </p>
                    <p className="text-2xl font-bold text-indigo-600 mb-4">
                        {formatRupiah(transaction.total_price)}
                    </p>

                    <div className="border-t border-indigo-200 pt-3">
                        <p className="text-sm text-gray-600">
                            Silakan transfer ke:
                        </p>
                        <div className="flex justify-between items-center mt-2">
                            <span className="font-bold">BCA</span>
                            <span className="font-mono bg-white px-2 py-1 rounded border">
                                123-456-7890
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            a.n. FashionHub Official
                        </p>
                    </div>
                </div>

                {/* Form Upload */}
                <form onSubmit={submit}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload Bukti Transfer
                        </label>
                        <input
                            type="file"
                            onChange={(e) =>
                                setData("payment_proof", e.target.files[0])
                            } // payment_proof
                            className="..." // class sama
                            accept="image/*"
                        />
                        {errors.proof_of_payment && (
                            <div className="text-red-500 text-xs mt-1">
                                {errors.proof_of_payment}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {processing ? "Mengupload..." : "Konfirmasi Pembayaran"}
                    </button>
                </form>
            </div>
        </div>
    );
}
