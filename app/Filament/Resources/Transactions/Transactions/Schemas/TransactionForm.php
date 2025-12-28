<?php

namespace App\Filament\Resources\Transactions\Transactions\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;

class TransactionForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->schema([
                // --- GRUP KIRI (UTAMA) ---
                Group::make()
                    ->schema([
                        // 1. SECTION STATUS & PENGIRIMAN
                        Section::make('Status & Pengiriman')
                            ->schema([
                                Select::make('status')
                                    ->label('Status Pesanan')
                                    ->options([
                                        'pending' => 'Pending (Menunggu Bayar)',
                                        'paid' => 'Lunas (Siap Proses)',
                                        'processing' => 'Sedang Diproses / Packing',
                                        'shipped' => 'Sedang Dikirim',
                                        'completed' => 'Selesai',
                                        'failed' => 'Dibatalkan',
                                    ])
                                    ->required()
                                    ->live()
                                    ->native(false),

                                Grid::make(2)
                                    ->schema([
                                        TextInput::make('delivery_courier')
                                            ->label('Nama Kurir')
                                            ->placeholder('JNE / J&T / SiCepat')
                                            ->visible(fn(Get $get) => in_array($get('status'), ['processing', 'shipped', 'completed'])),

                                        TextInput::make('tracking_number')
                                            ->label('Nomor Resi')
                                            ->placeholder('Input Resi Pengiriman')
                                            ->visible(fn(Get $get) => in_array($get('status'), ['processing', 'shipped', 'completed'])),
                                    ]),
                            ]),

                        // 2. SECTION ITEM BARANG (READ ONLY)
                        Section::make('Barang Dipesan')
                            ->schema([
                                Repeater::make('items')
                                    ->relationship()
                                    ->schema([
                                        TextInput::make('product_display') // Ganti nama field biar unik
                                            ->label('Produk')
                                            ->formatStateUsing(fn($record) => $record->productVariant->product->name . ' (' . $record->productVariant->size . ')')
                                            ->disabled()
                                            ->dehydrated(false), // PENTING: Jangan simpan ke DB

                                        TextInput::make('quantity')
                                            ->label('Qty')
                                            ->disabled()
                                            ->dehydrated(false), // PENTING

                                        TextInput::make('price')
                                            ->label('Harga')
                                            ->prefix('Rp')
                                            ->numeric()
                                            ->disabled()
                                            ->dehydrated(false), // PENTING
                                    ])
                                    ->deletable(false)
                                    ->addable(false)
                                    ->columnSpanFull(),
                            ]),
                    ])
                    ->columnSpan(2),

                // --- GRUP KANAN (SIDEBAR) ---
                Group::make()
                    ->schema([
                        // 3. SECTION INFO CUSTOMER
                        Section::make('Info Customer')
                            ->schema([
                                // GANTI 'user.name' JADI 'customer_name'
                                TextInput::make('customer_name')
                                    ->label('Nama Customer')
                                    // Ambil data manual dari relasi
                                    ->formatStateUsing(fn($record) => $record->user->name)
                                    ->disabled()
                                    ->dehydrated(false), // WAJIB: Biar gak error SQL 'Unknown column user'

                                Textarea::make('full_address')
                                    ->label('Alamat Pengiriman')
                                    ->rows(4)
                                    ->formatStateUsing(fn($record) => $record->address ?
                                        "{$record->address->recipient}\n{$record->address->complete_address}\n{$record->address->city} - {$record->address->postal_code}\nWA: {$record->user->telp}"
                                        : 'Alamat dihapus')
                                    ->disabled()
                                    ->dehydrated(false), // WAJIB
                            ]),

                        // 4. SECTION BUKTI BAYAR
                        Section::make('Bukti Pembayaran')
                            ->schema([
                                // GANTI 'payment.payment_proof' JADI 'proof_display'
                                FileUpload::make('proof_display')
                                    ->label('Foto Bukti Transfer')
                                    ->image()
                                    ->disk('public')
                                    ->visibility('public')
                                    // Load gambar manual dari relasi payment
                                    ->afterStateHydrated(function ($component, $record) {
                                        $component->state($record->payment?->payment_proof);
                                    })
                                    ->openable()
                                    ->disabled()
                                    ->dehydrated(false), // WAJIB: Biar gak error SQL 'Unknown column payment'
                            ]),
                    ])
                    ->columnSpan(1),
            ])
            ->columns(3);
    }
}
