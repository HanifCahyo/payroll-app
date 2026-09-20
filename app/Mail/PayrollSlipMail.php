<?php
namespace App\Mail;

use App\Models\PayrollEmployee;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PayrollSlipMail extends Mailable
{
    use Queueable, SerializesModels;

    public const TYPE_OVERTIME = 'overtime';

    public function __construct(
        public PayrollEmployee $employee,
        public string $pdfPath,
        public string $documentType = self::TYPE_OVERTIME,
    ) {
    }

    public function envelope(): Envelope
    {
        $period = $this->employee->import->period;
        $nama = $this->employee->nama;
        return new Envelope(
            subject: sprintf(
                'SLIP LEMBUR %s_%s_PT. Gading Gadjah Mada',
                $period,
                $nama,
            ),
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.overtime',
        );
    }

    /** @return array<int, Attachment> */
    public function attachments(): array
    {
        $period = $this->employee->import->period;
        $nip = $this->employee->nip;
        return [
            Attachment::fromStorage($this->pdfPath)
                ->as("SlipLembur_{$nip}_{$period}.pdf")
                ->withMime('application/pdf'),
        ];
    }
}
