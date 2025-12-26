import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post("/register");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <Head title="Register" />

            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md border border-gray-100">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-indigo-600">
                        FashionHub
                    </h2>
                    <p className="text-gray-500 mt-2">Buat akun baru</p>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Nama Lengkap
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                        {errors.name && (
                            <div className="text-red-500 text-sm mt-1">
                                {errors.name}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                        {errors.email && (
                            <div className="text-red-500 text-sm mt-1">
                                {errors.email}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                        {errors.password && (
                            <div className="text-red-500 text-sm mt-1">
                                {errors.password}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Konfirmasi Password
                        </label>
                        <input
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                        {processing ? "Daftar Sekarang" : "Daftar"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Sudah punya akun?{" "}
                    <Link
                        href="/login"
                        className="text-indigo-600 font-bold hover:underline"
                    >
                        Login di sini
                    </Link>
                </div>
            </div>
        </div>
    );
}
