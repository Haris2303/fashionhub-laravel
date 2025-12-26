import React from "react";
import { Head, Link } from "@inertiajs/react";

export default function Home({ categories, products }) {
    // Fungsi untuk format angka ke Rupiah
    const formatRupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <Head title="Welcome to FashionHub" />

            {/* Navbar */}
            <nav className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <Link
                            href="/"
                            className="text-2xl font-bold tracking-tight text-indigo-600"
                        >
                            FashionHub
                        </Link>
                        <div className="flex items-center space-x-6">
                            <Link
                                href="#"
                                className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition"
                            >
                                Login
                            </Link>
                            <Link href="#" className="relative group">
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                    0
                                </span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6 text-gray-700 group-hover:text-indigo-600"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                                    />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative bg-indigo-900 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <img
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"
                        className="w-full h-full object-cover"
                        alt="Hero Background"
                    />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 flex flex-col items-center text-center">
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
                        Gaya Terbaik, Harga Terbaik
                    </h2>
                    <p className="text-lg text-indigo-100 max-w-2xl mb-8">
                        Temukan koleksi fashion terbaru untuk melengkapi
                        penampilanmu sehari-hari dengan kualitas premium.
                    </p>
                    <Link
                        href="#products"
                        className="bg-white text-indigo-900 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition shadow-lg"
                    >
                        Belanja Sekarang
                    </Link>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
                {/* Kategori */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-gray-900">
                            Kategori Pilihan
                        </h3>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href="#"
                                className="flex-shrink-0 group"
                            >
                                <div className="px-6 py-3 bg-white border border-gray-200 rounded-full shadow-sm text-gray-700 font-medium group-hover:border-indigo-600 group-hover:text-indigo-600 transition whitespace-nowrap">
                                    {category.name}
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Produk Grid */}
                <section id="products">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-gray-900">
                            Produk Terbaru
                        </h3>
                        <Link
                            href="#"
                            className="text-indigo-600 font-medium hover:text-indigo-700"
                        >
                            Lihat Semua &rarr;
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                        {products.map((product) => {
                            // Logika Ambil Harga: Ambil harga varian pertama (biasanya termurah/default)
                            const firstVariant =
                                product.variants && product.variants.length > 0
                                    ? product.variants[0]
                                    : null;
                            const price = firstVariant
                                ? formatRupiah(firstVariant.price)
                                : "Stok Habis";

                            return (
                                <Link
                                    key={product.id}
                                    href={`/product/${product.id}`}
                                    className="group bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                                >
                                    {/* Gambar dengan Aspect Ratio Kotak */}
                                    <div className="relative aspect-square bg-gray-100 overflow-hidden">
                                        <img
                                            src={`/storage/${product.image}`}
                                            alt={product.name}
                                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                        />
                                        {/* Label Kategori */}
                                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-gray-600">
                                            {product.category.name}
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <h4
                                            className="font-semibold text-gray-900 truncate mb-1"
                                            title={product.name}
                                        >
                                            {product.name}
                                        </h4>
                                        <div className="flex items-end justify-between mt-2">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-500">
                                                    Mulai dari
                                                </span>
                                                <span className="text-lg font-bold text-indigo-600">
                                                    {price}
                                                </span>
                                            </div>
                                            <button className="bg-gray-900 text-white p-2 rounded-lg hover:bg-indigo-600 transition shadow-md translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={2}
                                                    stroke="currentColor"
                                                    className="w-5 h-5"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M12 4.5v15m7.5-7.5h-15"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                    {products.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            Belum ada produk yang tersedia.
                        </div>
                    )}
                </section>
            </main>

            <footer className="bg-white border-t border-gray-200 mt-20 py-10">
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
                    &copy; 2025 FashionHub. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
