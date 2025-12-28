<?php

namespace App\Filament\Widgets;

use App\Models\Transaction;
use Filament\Widgets\ChartWidget;
use Flowframe\Trend\Trend;
use Flowframe\Trend\TrendValue;

class RevenueChart extends ChartWidget
{
    protected ?string $heading = 'Grafik Pendapatan (30 Hari Terakhir)';

    // Urutkan agar tampil di bawah kartu stats
    protected static ?int $sort = 2;

    // Warna grafik
    protected ?string $pollingInterval = null;

    protected function getData(): array
    {
        $query = Transaction::query()->whereIn('status', ['paid', 'processing', 'shipped', 'completed']);

        // Ambil data 30 hari terakhir, kelompokkan per hari
        $data = Trend::query($query)
            ->between(
                start: now()->subDays(30),
                end: now(),
            )
            ->perDay()
            ->sum('total_price'); // Sum total harga

        return [
            'datasets' => [
                [
                    'label' => 'Pendapatan Harian',
                    'data' => $data->map(fn(TrendValue $value) => $value->aggregate),
                    'borderColor' => '#4f46e5', // Warna Indigo
                    'backgroundColor' => 'rgba(79, 70, 229, 0.1)',
                    'fill' => true,
                ],
            ],
            'labels' => $data->map(fn(TrendValue $value) => $value->date),
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
