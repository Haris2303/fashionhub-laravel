<?php

namespace App\Filament\Resources\Transactions\Transactions\Pages;

use App\Filament\Resources\Transactions\Transactions\TransactionResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListTransactions extends ListRecords
{
    protected static string $resource = TransactionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            //
        ];
    }
}
