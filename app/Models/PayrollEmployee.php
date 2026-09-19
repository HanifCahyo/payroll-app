<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PayrollEmployee extends Model
{
    protected $fillable = [
        'payroll_import_id',
        'row_number',
        'nip',
        'rekening',
        'bank',
        'nama',
        'departement',
        'email',
        'lembur_biasa',
        'jam_lb',
        'jumlah_lb',
        'lembur_libur',
        'jam_ll',
        'jumlah_ll',
        'total_lembur',
        'email_sent',
        'email_sent_at',
        'pdf_path'
    ];

    protected $casts = [
        'email_sent' => 'boolean',
        'email_sent_at' => 'datetime',
    ];

    public function import(): BelongsTo
    {
        return $this->belongsTo(PayrollImport::class, 'payroll_import_id');
    }
}
