<?php

namespace App\Filament\Resources\Products\Products\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Informasi Produk')
                    ->schema([
                        Select::make('category_id')
                            ->relationship('category', 'name')
                            ->label('kategori')
                            ->searchable()
                            ->preload()
                            ->required(),

                        TextInput::make('name')
                            ->label('Nama Produk')
                            ->required()
                            ->maxLength(255),

                        FileUpload::make('image')
                            ->label('Foto Produk')
                            ->image()
                            ->disk('public')
                            ->directory('products')
                            ->columnSpanFull()
                            ->visibility('public')
                            ->required(),

                        Textarea::make('description')
                            ->label('Deskripsi')
                            ->rows(3)
                            ->columnSpanFull(),
                    ])->columns(2),

                Section::make('Varian Produk')
                    ->description('Kelola ukuran, warna, dan stok di sini.')
                    ->schema([
                        Repeater::make('variants')
                            ->relationship()
                            ->schema([
                                TextInput::make('size')
                                    ->label('Ukuran')
                                    ->placeholder('S, M, L')
                                    ->required(),

                                TextInput::make('color')
                                    ->label('Warna')
                                    ->placeholder('Hitam, Putih')
                                    ->required(),

                                TextInput::make('stock')
                                    ->label('Stok')
                                    ->numeric()
                                    ->default(0)
                                    ->required(),

                                TextInput::make('price')
                                    ->label('Harga')
                                    ->prefix('Rp')
                                    ->numeric()
                                    ->required()
                                    ->columnSpanFull(),
                            ])
                            ->columns(3)
                            ->defaultItems(1)
                            ->addActionLabel('Tambah Varian Lagi'),
                    ]),
            ]);
    }
}
