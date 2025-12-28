import React, { useState, useEffect } from "react"; // <--- Import useEffect
import { Head, Link, useForm, usePage } from "@inertiajs/react"; // <--- Import usePage
import toast, { Toaster } from "react-hot-toast"; // <--- Import Toast

export default function Address({ addresses }) {
    // Ambil props flash dari Inertia
    const { flash } = usePage().props;

    // USE EFFECT: Memantau pesan sukses
    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success, {
                duration: 3000,
                position: "top-center",
            });
        }
        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);

    const {
        data,
        setData,
        post,
        put,
        processing,
        reset,
        delete: destroy,
    } = useForm({
        title: "",
        recipient: "",
        phone: "",
        complete_address: "",
        city: "",
        postal_code: "",
        is_default: false,
    });

    const openAddModal = () => {
        setEditingAddress(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (addr) => {
        setEditingAddress(addr);
        setData({
            title: addr.title || "",
            recipient: addr.recipient,
            phone: addr.phone,
            complete_address: addr.complete_address,
            city: addr.city,
            postal_code: addr.postal_code,
            is_default: addr.is_default == 1,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingAddress) {
            put(`/addresses/${editingAddress.id}`, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    // Tidak perlu reset manual alert, useEffect akan menanganinya
                },
            });
        } else {
            post("/addresses", {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
            <Head title="Kelola Alamat" />

            {/* KOMPONEN TOASTER WAJIB ADA DISINI AGAR MUNCUL */}
            <Toaster />

            {/* Navbar Simple */}
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
                    <Link
                        href="/"
                        className="font-bold text-xl text-indigo-600"
                    >
                        FashionHub
                    </Link>
                    <div className="flex gap-4 text-sm text-gray-500">
                        <Link
                            href="/my-orders"
                            className="hover:text-indigo-600"
                        >
                            Pesanan Saya
                        </Link>{" "}
                        |
                        <Link href="/" className="hover:text-indigo-600">
                            Home
                        </Link>
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 mt-8">
                {/* ... Kode Sisa Tampilan List Alamat SAMA SEPERTI SEBELUMNYA ... */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Daftar Alamat</h1>
                    <button
                        onClick={openAddModal}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700"
                    >
                        + Tambah Alamat
                    </button>
                </div>

                {addresses.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                        <p className="text-gray-500">
                            Belum ada alamat tersimpan.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {addresses.map((addr) => (
                            <div
                                key={addr.id}
                                className={`p-6 bg-white rounded-xl shadow-sm border ${
                                    addr.is_default
                                        ? "border-indigo-500 ring-1 ring-indigo-500"
                                        : "border-gray-200"
                                }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold uppercase bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                                                {addr.title || "Alamat"}
                                            </span>
                                            {addr.is_default == 1 && (
                                                <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded">
                                                    UTAMA
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="font-bold text-gray-900">
                                            {addr.recipient}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            {addr.phone}
                                        </p>
                                        <p className="text-gray-600 text-sm mt-1">
                                            {addr.complete_address}
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            {addr.city}, {addr.postal_code}
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-2 text-right">
                                        <button
                                            onClick={() => openEditModal(addr)}
                                            className="text-sm text-gray-500 hover:text-indigo-600 font-medium"
                                        >
                                            Ubah
                                        </button>
                                        {!addr.is_default && (
                                            <Link
                                                href={`/addresses/${addr.id}/default`}
                                                method="post"
                                                as="button"
                                                className="text-sm text-indigo-600 hover:underline"
                                            >
                                                Jadikan Utama
                                            </Link>
                                        )}
                                        <Link
                                            href={`/addresses/${addr.id}`}
                                            method="delete"
                                            as="button"
                                            className="text-sm text-red-500 hover:text-red-700"
                                        >
                                            Hapus
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* MODAL FORM (Isinya Sama Persis Seperti Sebelumnya) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
                    <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-4">
                            {editingAddress
                                ? "Ubah Alamat"
                                : "Tambah Alamat Baru"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* ... FORM INPUTS SAMA SEPERTI SEBELUMNYA ... */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Label Alamat
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData("title", e.target.value)
                                    }
                                    className="w-full border-gray-300 rounded-lg"
                                    placeholder="Contoh: Rumah, Kantor"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nama Penerima
                                    </label>
                                    <input
                                        type="text"
                                        value={data.recipient}
                                        onChange={(e) =>
                                            setData("recipient", e.target.value)
                                        }
                                        className="w-full border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        No. HP
                                    </label>
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) =>
                                            setData("phone", e.target.value)
                                        }
                                        className="w-full border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Alamat Lengkap
                                </label>
                                <textarea
                                    rows="3"
                                    value={data.complete_address}
                                    onChange={(e) =>
                                        setData(
                                            "complete_address",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border-gray-300 rounded-lg"
                                    required
                                ></textarea>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Kota
                                    </label>
                                    <input
                                        type="text"
                                        value={data.city}
                                        onChange={(e) =>
                                            setData("city", e.target.value)
                                        }
                                        className="w-full border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                                        className="w-full border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <input
                                    type="checkbox"
                                    id="is_default"
                                    checked={data.is_default}
                                    onChange={(e) =>
                                        setData("is_default", e.target.checked)
                                    }
                                    className="rounded text-indigo-600"
                                />
                                <label
                                    htmlFor="is_default"
                                    className="text-sm text-gray-700"
                                >
                                    Jadikan alamat utama
                                </label>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
