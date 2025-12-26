<?php

namespace App\Filament\Resources\Transactions\Transactions\Schemas;

use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class TransactionForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Info Transaksi')
                    ->schema([
                        Select::make('user_id')
                            ->relationship('user', 'name')
                            ->label('Customer')
                            ->disabled(), // Admin gak boleh ubah customer

                        TextInput::make('total_price')
                            ->label('Total Bayar')
                            ->prefix('Rp')
                            ->numeric()
                            ->readOnly(), // Jangan diubah manual, bahaya korupsi data

                        Select::make('status')
                            ->options([
                                'pending' => 'Menunggu Pembayaran',
                                'paid' => 'Sudah Dibayar',
                                'shipping' => 'Sedang Dikirim',
                                'completed' => 'Selesai',
                                'failed' => 'Gagal/Batal',
                            ])
                            ->required()
                            ->default('pending'),

                        TextInput::make('created_at')
                            ->label('Tanggal Order')
                            ->disabled(),
                    ])->columns(2),

                Section::make('Alamat Pengiriman')
                    ->schema([
                        Select::make('address_id')
                            ->relationship('address', 'address') // Pastikan kolom 'address' ada di tabel addresses
                            ->label('Alamat Tujuan')
                            ->disabled(),
                    ]),

                // === BAGIAN 3: BARANG YANG DIBELI (REPEATER READ-ONLY) ===
                Section::make('Rincian Pesanan')
                    ->schema([
                        Repeater::make('items')
                            ->relationship()
                            ->schema([
                                Select::make('product_variant_id')
                                    ->relationship('productVariant', 'id') // Sementara ID dulu krn relasi bertingkat agak rumit
                                    ->label('ID Varian Produk')
                                    ->disabled(),

                                TextInput::make('quantity')
                                    ->label('Jumlah (Qty)')
                                    ->disabled(),

                                TextInput::make('price')
                                    ->label('Harga Satuan')
                                    ->prefix('Rp')
                                    ->disabled(),
                            ])
                            ->addable(false) // Admin gaboleh nambah barang
                            ->deletable(false) // Admin gaboleh hapus barang
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
