<?php

namespace App\Filament\Resources\Transactions\Transactions\Pages;

use App\Filament\Resources\Transactions\Transactions\TransactionResource;
use Filament\Resources\Pages\CreateRecord;

class CreateTransaction extends CreateRecord
{
    protected static string $resource = TransactionResource::class;
}
