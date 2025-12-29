<?php

namespace App\Filament\Resources\Transactions\Transactions\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class TransactionsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')
                    ->label('Order ID')
                    ->sortable(),

                TextColumn::make('user.name')
                    ->label('Customer')
                    ->searchable(),

                TextColumn::make('total_price')
                    ->label('Total')
                    ->money('IDR')
                    ->sortable(),

                ImageColumn::make('payment.payment_proof')
                    ->label('Bukti TF')
                    ->disk('public')
                    ->visibility('public')
                    ->square(),

                TextColumn::make('status')
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'pending' => 'warning',
                        'waiting_approval' => 'warning',
                        'paid' => 'info',
                        'shipping' => 'primary',
                        'completed' => 'success',
                        'failed' => 'danger',
                        default => 'gray',
                    }),

                TextColumn::make('created_at')
                    ->dateTime('d M Y H:i')
                    ->label('Waktu Order'),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->label('Status Transaksi')
                    ->multiple()
                    ->options([
                        'pending' => 'Pending (Belum Bayar)',
                        'waiting_approval' => 'Menunggu Konfirmasi Admin',
                        'paid' => 'Lunas (Siap Proses)',
                        'processing' => 'Sedang Diproses / Packing',
                        'shipped' => 'Sedang Dikirim',
                        'completed' => 'Selesai',
                        'failed' => 'Dibatalkan',
                    ])
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
