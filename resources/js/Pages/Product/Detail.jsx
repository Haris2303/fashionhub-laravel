import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";

export default function Detail({ product }) {
    // State untuk pilihan user
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [currentPrice, setCurrentPrice] = useState(0);
    const [currentStock, setCurrentStock] = useState(0);

    // Ambil daftar Size unik dari varian
    const uniqueSizes = [...new Set(product.variants.map((v) => v.size))];

    // Ambil daftar Color unik (opsional: bisa difilter berdasarkan size nanti)
    const uniqueColors = [...new Set(product.variants.map((v) => v.color))];

    // Format Rupiah
    const formatRupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
    };

    const addToCart = () => {
        const foundVariant = product.variants.find(
            (v) => v.size === selectedSize && v.color === selectedColor
        );

        if (!foundVariant) return;

        router.post(
            "/cart/add",
            {
                product_id: product.id,
                product_variant_id: foundVariant.id,
                quantity: 1,
            },
            {
                preserveScroll: true,
                onSuccess: () => alert("Berhasil masuk keranjang!"),
                onError: (errors) => {
                    if (errors.quantity) alert(errors.quantity);
                    else alert("Gagal menambahkan. Pastikan Anda sudah login.");
                },
            }
        );
    };

    // Efek saat user ganti Size atau Color
    useEffect(() => {
        // Cari varian yang cocok dengan pilihan user
        const foundVariant = product.variants.find(
            (v) => v.size === selectedSize && v.color === selectedColor
        );

        if (foundVariant) {
            setCurrentPrice(foundVariant.price);
            setCurrentStock(foundVariant.stock);
        } else {
            // Jika belum pilih lengkap, atau kombinasi tidak ada
            // Tampilkan harga terendah sebagai default
            if (product.variants.length > 0) {
                const minPrice = Math.min(
                    ...product.variants.map((v) => v.price)
                );
                setCurrentPrice(minPrice);
            }
            setCurrentStock(0);
        }
    }, [selectedSize, selectedColor, product.variants]);

    // Set default harga saat pertama kali load
    useEffect(() => {
        if (product.variants.length > 0) {
            // Default harga ambil dari varian pertama atau terendah
            setCurrentPrice(product.variants[0].price);
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <Head title={product.name} />

            {/* Navbar Simple */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <Link
                        href="/"
                        className="text-indigo-600 font-bold hover:underline"
                    >
                        &larr; Kembali ke Home
                    </Link>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                        {/* Kiri: Foto Produk */}
                        <div className="bg-gray-100 aspect-square md:aspect-auto relative">
                            <img
                                src={`/storage/${product.image}`}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Kanan: Info & Pilihan */}
                        <div className="p-8 md:p-12 flex flex-col justify-center">
                            <span className="text-sm text-indigo-600 font-semibold uppercase tracking-wider mb-2">
                                {product.category.name}
                            </span>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                {product.name}
                            </h1>

                            {/* Harga */}
                            <div className="text-3xl font-bold text-gray-900 mb-6">
                                {formatRupiah(currentPrice)}
                            </div>

                            {/* Deskripsi */}
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                {product.description ||
                                    "Tidak ada deskripsi produk."}
                            </p>

                            <div className="space-y-6">
                                {/* Pilihan Ukuran */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ukuran
                                    </label>
                                    <div className="flex flex-wrap gap-3">
                                        {uniqueSizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() =>
                                                    setSelectedSize(size)
                                                }
                                                className={`px-4 py-2 border rounded-md text-sm font-medium transition-all
                                                    ${
                                                        selectedSize === size
                                                            ? "border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600"
                                                            : "border-gray-300 text-gray-700 hover:border-gray-400"
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Pilihan Warna */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Warna
                                    </label>
                                    <div className="flex flex-wrap gap-3">
                                        {uniqueColors.map((color) => (
                                            <button
                                                key={color}
                                                onClick={() =>
                                                    setSelectedColor(color)
                                                }
                                                className={`px-4 py-2 border rounded-md text-sm font-medium transition-all
                                                    ${
                                                        selectedColor === color
                                                            ? "border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600"
                                                            : "border-gray-300 text-gray-700 hover:border-gray-400"
                                                    }`}
                                            >
                                                {color}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Tombol Beli */}
                            <div className="mt-10 border-t pt-8">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm text-gray-500">
                                        Status:
                                        {selectedSize && selectedColor ? (
                                            currentStock > 0 ? (
                                                <span className="text-green-600 font-bold ml-1">
                                                    Tersedia ({currentStock})
                                                </span>
                                            ) : (
                                                <span className="text-red-600 font-bold ml-1">
                                                    Habis
                                                </span>
                                            )
                                        ) : (
                                            <span className="text-gray-400 ml-1">
                                                Pilih varian dulu
                                            </span>
                                        )}
                                    </span>
                                </div>

                                <button
                                    onClick={addToCart}
                                    disabled={
                                        !selectedSize ||
                                        !selectedColor ||
                                        currentStock === 0
                                    }
                                    className={`w-full py-4 px-8 rounded-xl font-bold text-lg shadow-lg transform transition hover:-translate-y-1
                                        ${
                                            !selectedSize ||
                                            !selectedColor ||
                                            currentStock === 0
                                                ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                                                : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-500/30"
                                        }`}
                                >
                                    {currentStock === 0 &&
                                    selectedSize &&
                                    selectedColor
                                        ? "Stok Habis"
                                        : "Tambah ke Keranjang"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
