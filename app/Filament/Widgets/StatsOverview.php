<?php

namespace App\Filament\Widgets;

use App\Models\Transaction;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends StatsOverviewWidget
{

    protected ?string $pollingInterval = '15s';

    protected function getStats(): array
    {
        // 1. Hitung Total Omzet (Hanya yang statusnya 'paid', 'shipped', 'completed')
        $totalRevenue = Transaction::whereIn('status', ['paid', 'processing', 'shipped', 'completed'])
            ->sum('total_price');

        // 2. Hitung Total Order Masuk
        $totalOrders = Transaction::count();

        // 3. Hitung Total Customer
        $totalCustomers = User::where('role', 'customer')->count(); // Asumsi ada kolom role, atau hitung semua user

        // Format Rupiah
        $formatRevenue = 'Rp ' . number_format($totalRevenue, 0, ',', '.');

        return [
            Stat::make('Total Pendapatan', $formatRevenue)
                ->description('Uang masuk (Lunas)')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color('success')
                ->chart([7, 2, 10, 3, 15, 4, 17]), // Grafik mini hiasan

            Stat::make('Total Pesanan', $totalOrders)
                ->description('Semua transaksi')
                ->descriptionIcon('heroicon-m-shopping-bag')
                ->color('primary'),

            Stat::make('Total Customer', $totalCustomers)
                ->description('User terdaftar')
                ->descriptionIcon('heroicon-m-users')
                ->color('info'),
        ];
    }
}
