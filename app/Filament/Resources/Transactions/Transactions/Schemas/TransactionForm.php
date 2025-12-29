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
                                        'waiting_approval' => 'Menunggu Konfirmasi Admin', // Tambahan Status Baru
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
                                            // Tampil jika status bukan pending/waiting/failed
                                            ->visible(fn(Get $get) => in_array($get('status'), ['paid', 'processing', 'shipped', 'completed'])),

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
                                        TextInput::make('product_display')
                                            ->label('Produk')
                                            ->formatStateUsing(fn($record) => $record->productVariant->product->name . ' (' . $record->productVariant->size . ')')
                                            ->disabled()
                                            ->dehydrated(false),

                                        TextInput::make('quantity')
                                            ->label('Qty')
                                            ->disabled()
                                            ->dehydrated(false),

                                        TextInput::make('price')
                                            ->label('Harga Satuan')
                                            ->prefix('Rp')
                                            ->numeric()
                                            ->disabled()
                                            ->dehydrated(false),
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
                                TextInput::make('customer_name')
                                    ->label('Nama Customer')
                                    ->formatStateUsing(fn($record) => $record->user->name)
                                    ->disabled()
                                    ->dehydrated(false),

                                Textarea::make('address')
                                    ->label('Detail Pengiriman (Nama, HP, Alamat)')
                                    ->rows(5)
                                    ->disabled()
                                    ->formatStateUsing(fn($state) => str_replace('|', "\n\n", $state)),
                            ]),

                        Section::make('Bukti Pembayaran')
                            ->schema([
                                FileUpload::make('proof_display')
                                    ->label('Foto Bukti Transfer')
                                    ->image()
                                    ->disk('public')
                                    ->visibility('public')
                                    ->afterStateHydrated(function ($component, $record) {
                                        $component->state($record->payment?->payment_proof);
                                    })
                                    ->openable()
                                    ->disabled()
                                    ->dehydrated(false),
                            ]),
                    ])
                    ->columnSpan(1),
            ])
            ->columns(3);
    }
}
