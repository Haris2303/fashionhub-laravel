import React, { useState, useEffect } from "react";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { Toaster, toast } from "react-hot-toast"; // Opsional: Kalau pakai toast

// --- KOMPONEN BINTANG (STAR RATING) ---
const StarRating = ({
    rating,
    setRating = null,
    editable = false,
    size = "w-5 h-5",
}) => {
    return (
        <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    onClick={() => editable && setRating && setRating(star)}
                    className={`${size} ${
                        editable
                            ? "cursor-pointer transform hover:scale-110 transition"
                            : ""
                    } ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
};

export default function Detail({ product }) {
    // Ambil Auth dari Global Props Inertia (Lebih Aman)
    const { auth } = usePage().props;

    // --- STATE LOGIC VARIAN ---
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);

    // State Harga & Stok
    const [currentPrice, setCurrentPrice] = useState(0);
    const [currentStock, setCurrentStock] = useState(0);

    // Ambil opsi unik
    const uniqueSizes = [...new Set(product.variants.map((v) => v.size))];
    const uniqueColors = [...new Set(product.variants.map((v) => v.color))];

    // --- FORM REVIEW ---
    const { data, setData, post, processing, reset, errors } = useForm({
        rating: 5,
        comment: "",
    });

    const submitReview = (e) => {
        e.preventDefault();

        post(`/products/${product.id}/review`, {
            preserveScroll: true,
            onSuccess: () => {
                reset("comment");
                alert("Ulasan berhasil dikirim!"); // Feedback User
            },
            onError: (err) => {
                console.error("Error Review:", err);
                // Tampilkan pesan error pertama yang ditemui
                const firstError = Object.values(err)[0];
                alert(
                    "Gagal kirim ulasan: " +
                        (firstError || "Terjadi kesalahan sistem")
                );
            },
        });
    };

    // Helper Rupiah
    const formatRupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
    };

    // Helper Tanggal
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // --- LOGIC HARGA DINAMIS (PENTING) ---
    useEffect(() => {
        // 1. Cari varian yang cocok dengan pilihan user
        const foundVariant = product.variants.find(
            (v) => v.size === selectedSize && v.color === selectedColor
        );

        if (foundVariant) {
            // Jika ketemu, update harga & stok sesuai varian itu
            setCurrentPrice(foundVariant.price);
            setCurrentStock(foundVariant.stock);
        } else {
            // Jika belum lengkap memilih (atau kombinasi ga ada)
            // Tampilkan harga terendah sebagai "Mulai dari..."
            if (product.variants.length > 0) {
                const minPrice = Math.min(
                    ...product.variants.map((v) => v.price)
                );
                setCurrentPrice(minPrice);
            }
            setCurrentStock(0); // Stok 0 karena belum spesifik
        }
    }, [selectedSize, selectedColor, product.variants]);

    // Inisialisasi Harga Awal
    useEffect(() => {
        if (product.variants.length > 0) {
            const minPrice = Math.min(...product.variants.map((v) => v.price));
            setCurrentPrice(minPrice);
        }
    }, []);

    // Logic Add to Cart
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

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
            <Head title={product.name} />

            {/* Navbar Simple */}
            <nav className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <Link
                        href="/"
                        className="text-indigo-600 font-bold hover:underline"
                    >
                        &larr; Kembali ke Home
                    </Link>
                    <Link
                        href="/cart"
                        className="text-gray-600 hover:text-indigo-600 relative"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                        </svg>
                    </Link>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* --- BAGIAN 1: DETAIL PRODUK --- */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 mb-10">
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

                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                {product.name}
                            </h1>

                            {/* TAMPILAN RATING RATA-RATA */}
                            <div className="flex items-center gap-2 mb-4">
                                <StarRating
                                    rating={Math.round(
                                        product.reviews_avg_rating || 0
                                    )}
                                />
                                <span className="text-sm text-gray-500">
                                    ({product.reviews_count || 0} Ulasan)
                                </span>
                            </div>

                            {/* --- HARGA DINAMIS --- */}
                            <div className="text-3xl font-bold text-indigo-600 mb-6 transition-all duration-300">
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
                                                className={`px-4 py-2 border rounded-md text-sm font-medium transition-all ${
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
                                                className={`px-4 py-2 border rounded-md text-sm font-medium transition-all ${
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
                                                    Tersedia ({currentStock}{" "}
                                                    item)
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
                                    className={`w-full py-4 px-8 rounded-xl font-bold text-lg shadow-lg transform transition hover:-translate-y-1 ${
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

                {/* --- BAGIAN 2: ULASAN & REVIEW --- */}
                <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-bold mb-8">Ulasan Pembeli</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* KOLOM KIRI: LIST REVIEW */}
                        <div className="space-y-8">
                            {product.reviews && product.reviews.length > 0 ? (
                                product.reviews.map((review) => (
                                    <div
                                        key={review.id}
                                        className="border-b pb-6 last:border-0"
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Avatar User */}
                                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-600 flex-shrink-0">
                                                {review.user?.name.charAt(0) ||
                                                    "U"}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 text-sm">
                                                            {review.user
                                                                ?.name ||
                                                                "Anonim"}
                                                        </h4>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <StarRating
                                                                rating={
                                                                    review.rating
                                                                }
                                                                size="w-3 h-3"
                                                            />
                                                            <span className="text-xs text-gray-400">
                                                                {formatDate(
                                                                    review.created_at
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-gray-700 text-sm mt-3 leading-relaxed bg-gray-50 p-3 rounded-lg">
                                                    {review.comment || (
                                                        <span className="italic text-gray-400">
                                                            Tidak ada komentar
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 bg-gray-50 rounded-lg">
                                    <p className="text-gray-500 italic">
                                        Belum ada ulasan untuk produk ini.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* KOLOM KANAN: FORM INPUT REVIEW */}
                        <div className="h-fit">
                            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 sticky top-24">
                                <h3 className="font-bold text-lg mb-4 text-indigo-900">
                                    Bagikan Pengalaman Anda
                                </h3>

                                {auth.user ? (
                                    <form
                                        onSubmit={submitReview}
                                        className="space-y-4"
                                    >
                                        {/* TAMPILKAN ERROR VALIDASI JIKA ADA */}
                                        {Object.keys(errors).length > 0 && (
                                            <div className="bg-red-100 text-red-700 p-3 rounded text-sm mb-3">
                                                {Object.values(errors)[0]}
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Berikan Rating
                                            </label>
                                            <StarRating
                                                rating={data.rating}
                                                setRating={(val) =>
                                                    setData("rating", val)
                                                }
                                                editable={true}
                                                size="w-8 h-8"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Klik bintang untuk memberi nilai
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Komentar
                                            </label>
                                            <textarea
                                                rows="4"
                                                value={data.comment}
                                                onChange={(e) =>
                                                    setData(
                                                        "comment",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="Ceritakan kepuasan Anda terhadap produk ini..."
                                            ></textarea>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition shadow-md"
                                        >
                                            {processing
                                                ? "Mengirim..."
                                                : "Kirim Ulasan"}
                                        </button>
                                    </form>
                                ) : (
                                    <div className="text-center py-6">
                                        <p className="text-gray-600 mb-4 text-sm">
                                            Anda harus login untuk memberikan
                                            ulasan.
                                        </p>
                                        <Link
                                            href="/login"
                                            className="bg-white text-indigo-600 border border-indigo-600 px-6 py-2 rounded-lg font-bold hover:bg-indigo-50 text-sm inline-block transition"
                                        >
                                            Login Sekarang
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
