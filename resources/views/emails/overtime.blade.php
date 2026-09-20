<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Slip Lembur — PT. Gading Gadjah Mada</title>
</head>

<body
    style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
        style="background-color:#f1f5f9;padding:20px 10px">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                    style="max-width:600px;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 10px 25px rgba(15,23,42,.05)">
                    <tr>
                        <td
                            style="background:#ecfdf5;border-bottom:1px solid #a7f3d0;padding:6px 16px;text-align:center">
                            <p
                                style="margin:0;font-size:11px;font-weight:700;color:#065f46;letter-spacing:.08em;text-transform:uppercase">
                                ATAS BERKAT ROHMAT ALLOH YANG MAHA KUASA</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background:#064e3b;padding:18px 24px;color:#fff">
                            <p style="margin:2px 0 0;font-size:18px;font-weight:700;color:#fff;letter-spacing:.02em">PT.
                                GADING GADJAH MADA</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:20px 24px">
                            <p style="margin:0 0 4px;font-size:13px;color:#64748b">Kepada Yth.</p>
                            <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#0f172a">{{ $employee->nama }}
                            </p>
                            <p style="margin:0 0 14px;font-size:12.5px;color:#475569">NIP: <strong
                                    style="color:#047857">{{ $employee->nip }}</strong> &bull; Departemen: <strong
                                    style="color:#0f172a">{{ $employee->departement }}</strong></p>
                            <p style="margin:0 0 12px;font-size:13.5px;line-height:1.5;color:#334155">Bersama email ini
                                kami sampaikan dokumen resmi <strong>Slip Lembur Karyawan</strong> untuk periode
                                <strong>{{ $employee->import->period }}</strong>.</p>
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                                style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:14px">
                                <tr>
                                    <td style="padding:8px 14px;border-bottom:1px dashed #e2e8f0"><span
                                            style="font-size:12.5px;color:#64748b">Jenis Dokumen</span><span
                                            style="float:right;font-size:12.5px;font-weight:700;color:#047857">Slip
                                            Lembur Karyawan</span></td>
                                </tr>
                                <tr>
                                    <td style="padding:8px 14px;border-bottom:1px dashed #e2e8f0"><span
                                            style="font-size:12.5px;color:#64748b">Periode Pembayaran</span><span
                                            style="float:right;font-size:12.5px;font-weight:700;color:#0f172a">{{ $employee->import->period }}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:8px 14px"><span style="font-size:12.5px;color:#64748b">Total
                                            Lembur</span><span
                                            style="float:right;font-size:12.5px;font-weight:700;color:#047857">Rp
                                            {{ number_format($employee->total_lembur, 0, ',', '.') }}</span></td>
                                </tr>
                            </table>
                            <div
                                style="background:#f0fdf4;border-left:4px solid #059669;padding:10px 14px;border-radius:8px;margin-bottom:14px">
                                <p style="margin:0 0 4px;font-size:12px;line-height:1.4;color:#065f46">Slip bersifat
                                    rahasia, mohon disimpan dengan aman.</p>
                                <p style="margin:0;font-size:12px;line-height:1.4;color:#047857">Apabila ada pertanyaan,
                                    ketidaksesuaian data, atau komplain, silakan hubungi HRD di nomor
                                    <strong>081337649261</strong> maksimal <strong>1x24 jam</strong> setelah email
                                    diterima.</p>
                            </div>
                            <p style="margin:0 0 12px;font-size:13px;color:#334155">Demikian pemberitahuan ini
                                disampaikan. Atas perhatian dan dedikasi Anda, kami ucapkan terima kasih.</p>
                            <p
                                style="margin:14px 0 0;border-top:1px solid #f1f5f9;padding-top:12px;font-size:12px;color:#64748b">
                                Hormat kami,<br><strong style="color:#047857;font-size:13.5px">HRD Gading Gadjah
                                    Mada</strong></p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background:#f8fafc;padding:14px 24px;border-top:1px solid #e2e8f0;text-align:center">
                            <p style="margin:0;font-size:10.5px;color:#94a3b8;line-height:1.4">Jl. Albisindo Raya No. 9,
                                Gebog, Kudus, Jawa Tengah 59333 &bull; System-Generated Email</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>
