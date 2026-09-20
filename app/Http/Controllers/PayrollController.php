<?php

namespace App\Http\Controllers;

use App\Models\PayrollImport;
use App\Models\PayrollEmployee;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx as XlsxReader;

class PayrollController extends Controller
{
    private const COL_MAP = [
        'nip' => 'NIP',
        'rekening' => 'REKENING',
        'bank' => 'BANK',
        'nama' => 'NAMA',
        'departement' => 'DEPARTEMENT',
        'lembur_biasa' => 'LEMBUR BIASA',
        'jam_lb' => 'JAM LB',
        'jumlah_lb' => 'JUMLAH LB',
        'lembur_libur' => 'LEMBUR LIBUR',
        'jam_ll' => 'JAM LL',
        'jumlah_ll' => 'JUMLAH LL',
        'total_lembur' => 'TOTAL LEMBUR',
        'email' => 'EMAIL',
    ];

    private const STRING_FIELDS = ['nip', 'rekening', 'bank', 'nama', 'departement', 'email'];

    public function form(Request $request): Response
    {
        return Inertia::render('Payroll/Upload', [
            'recentImports' => PayrollImport::latest()->withCount('employees')->limit(5)->get(),
        ]);
    }

    public function overtimeIndex(): Response
    {
        return Inertia::render('Payroll/Overtime', [
            'imports' => PayrollImport::where('type', 'overtime')->latest()->withCount('employees')->get(),
        ]);
    }

    public function upload(Request $request): RedirectResponse
    {
        ini_set('max_execution_time', 300);
        set_time_limit(300);

        $request->validate([
            'type' => 'nullable|string|in:overtime',
            'file' => [
                'required',
                'file',
                'max:51200',
                function ($attribute, $value, $fail) {
                    $ext = strtolower($value->getClientOriginalExtension());
                    if (!in_array($ext, ['xlsx', 'xlsm', 'xls'])) {
                        $fail('File harus berformat xlsx, xlsm, atau xls.');
                    }
                },
            ],
            'period' => 'required|string|max:50',
            'period_range' => 'required|string|max:100',
        ]);

        $filePath = $request->file('file')->getPathname();

        $reader = new XlsxReader();
        $reader->setReadDataOnly(true);
        $spreadsheet = $reader->load($filePath);

        $sheetName = trim((string) $request->input('sheet_name', ''));
        $sheet = $sheetName !== '' && $spreadsheet->sheetNameExists($sheetName)
            ? $spreadsheet->getSheetByName($sheetName)
            : $spreadsheet->getActiveSheet();
        $allRows = $sheet->toArray(
            null,
            true,
            true,
            true
        );

        if (empty($allRows)) {
            return back()->withErrors(['file' => 'File Excel kosong atau tidak terbaca.']);
        }

        $headerRow = $allRows[1] ?? [];
        $nameToLetters = [];
        foreach ($headerRow as $letter => $value) {
            $value = trim((string) ($value ?? ''));
            if ($value !== '') {
                $nameToLetters[$value][] = $letter;
            }
        }

        $fieldToLetter = $this->resolveColumnLetters($nameToLetters);

        foreach (['nama', 'email'] as $required) {
            if (!isset($fieldToLetter[$required])) {
                return back()->withErrors([
                    'file' => "Kolom '{$required}' tidak ditemukan di file Excel. Pastikan format file sudah benar."
                ]);
            }
        }

        if (!isset($fieldToLetter['nip'])) {
            return back()->withErrors([
                'file' => "Kolom 'NIP' tidak ditemukan di file Excel. Pastikan format file sudah benar."
            ]);
        }

        $dataRows = [];
        $namaLetter = $fieldToLetter['nama'];

        foreach ($allRows as $rowIndex => $row) {
            if ($rowIndex === 1)
                continue;

            $namaVal = trim((string) ($row[$namaLetter] ?? ''));
            if ($namaVal === '')
                continue;

            $dataRows[$rowIndex] = $row;
        }

        $totalRows = count($dataRows);

        if ($totalRows === 0) {
            return back()->withErrors(['file' => 'Tidak ada data karyawan yang ditemukan di file.']);
        }

        $type = 'overtime';

        $import = PayrollImport::create([
            'file_name' => $request->file('file')->getClientOriginalName(),
            'type' => $type,
            'period' => strtoupper(trim($request->period)),
            'period_range' => trim($request->period_range),
            'sheet_name' => $sheet->getTitle(),
            'total_rows' => $totalRows,
            'status' => 'ready',
        ]);

        $batch = [];
        $rowNum = 0;

        foreach ($dataRows as $row) {
            $rowNum++;
            $record = [
                'payroll_import_id' => $import->id,
                'row_number' => $rowNum,
            ];

            foreach (self::COL_MAP as $field => $colName) {
                $letter = $fieldToLetter[$field] ?? null;
                $value = $letter ? ($row[$letter] ?? null) : null;

                if (in_array($field, self::STRING_FIELDS)) {
                    $record[$field] = trim((string) ($value ?? ''));
                } else {
                    $record[$field] = $this->toFloat($value);
                }
            }

            $batch[] = $record;

            if (count($batch) >= 100) {
                PayrollEmployee::insert($batch);
                $batch = [];
            }
        }

        if (!empty($batch)) {
            PayrollEmployee::insert($batch);
        }
        $spreadsheet->disconnectWorksheets();
        unset($spreadsheet, $allRows, $dataRows);

        return redirect()->route('payroll.overtime.detail', $import->id)
            ->with('success', "Berhasil import {$totalRows} karyawan untuk data lembur.");
    }

    /** @param array<string, list<string>> $nameToLetters
     *  @return array<string, string>
     */
    private function resolveColumnLetters(array $nameToLetters): array
    {
        $usedCount = [];
        $result = [];

        foreach (self::COL_MAP as $field => $colName) {
            $idx = $usedCount[$colName] ?? 0;
            $usedCount[$colName] = $idx + 1;

            $letters = $nameToLetters[$colName] ?? [];
            if (isset($letters[$idx])) {
                $result[$field] = $letters[$idx];
            }
        }

        return $result;
    }


    private function toFloat(mixed $value): float
    {
        if ($value === null || $value === '')
            return 0.0;
        if (is_int($value) || is_float($value))
            return (float) $value;

        $str = trim((string) $value);
        if ($str === '')
            return 0.0;

        // Format Indonesia: titik ribuan + koma desimal → "1.500,75"
        if (str_contains($str, '.') && str_contains($str, ',')) {
            $str = str_replace('.', '', $str);  // hapus titik ribuan
            $str = str_replace(',', '.', $str); // ganti koma → titik desimal
        }
        // Hanya koma tanpa titik → "3,0" atau "500,00"
        elseif (str_contains($str, ',') && !str_contains($str, '.')) {
            $str = str_replace(',', '.', $str);
        }
        // Hanya titik atau angka biasa → biarkan

        return is_numeric($str) ? (float) $str : 0.0;
    }

    public function overtimeDetail(PayrollImport $import): Response
    {
        return Inertia::render('Payroll/OvertimeDetail', [
            'import' => $import,
            'employees' => $import->employees()->orderBy('row_number')->get(),
            'pendingJobsCount' => DB::table('jobs')->count(),
        ]);
    }

    private static function getPhpCliBinary(): string
    {
        if (defined('PHP_BINARY')) {
            $binary = PHP_BINARY;
            if (!preg_match('/(fpm|cgi)/i', basename($binary)) && file_exists($binary) && is_executable($binary)) {
                return $binary;
            }

            $cliCandidate = preg_replace('/php-(fpm|cgi)/i', 'php', $binary);
            $cliCandidate = str_replace(['sbin/php', 'sbin\\php'], ['bin/php', 'bin\\php'], $cliCandidate);
            if (file_exists($cliCandidate) && is_executable($cliCandidate)) {
                return $cliCandidate;
            }
        }

        if (defined('PHP_BINDIR')) {
            $cliBinary = PHP_BINDIR . (str_contains(PHP_OS, 'WIN') ? DIRECTORY_SEPARATOR . 'php.exe' : DIRECTORY_SEPARATOR . 'php');
            if (file_exists($cliBinary) && is_executable($cliBinary)) {
                return $cliBinary;
            }
        }

        $commonPaths = str_contains(PHP_OS, 'WIN')
            ? [
                'C:\\xampp\\php\\php.exe',
                'C:\\laragon\\bin\\php\\php-8.2.0-Win32-vs16-x64\\php.exe',
                'C:\\php\\php.exe',
            ]
            : [
                '/opt/homebrew/bin/php',
                '/usr/local/bin/php',
                '/usr/bin/php',
            ];

        foreach ($commonPaths as $path) {
            if (file_exists($path) && is_executable($path)) {
                return $path;
            }
        }

        return str_contains(PHP_OS, 'WIN') ? 'php.exe' : 'php';
    }

    public static function startBackgroundWorker(): void
    {
        $basePath = base_path();
        $artisanPath = $basePath . DIRECTORY_SEPARATOR . 'artisan';
        $phpBinary = self::getPhpCliBinary();

        if (str_contains(PHP_OS, 'WIN')) {
            $cmd = sprintf('start /B "" %s %s queue:work --stop-when-empty --rest=1', escapeshellarg($phpBinary), escapeshellarg($artisanPath));
            $process = popen($cmd, 'r');
            if (is_resource($process)) {
                pclose($process);
            }
        } else {
            $cmd = sprintf('nohup %s %s queue:work --stop-when-empty --rest=1 > /dev/null 2>&1 &', escapeshellarg($phpBinary), escapeshellarg($artisanPath));
            exec($cmd);
        }
    }

    public function processQueue(): RedirectResponse
    {
        $pendingCount = DB::table('jobs')->count();

        if ($pendingCount === 0) {
            return back()->with('info', 'Tidak ada antrean email yang pending saat ini.');
        }

        try {
            self::startBackgroundWorker();
        } catch (\Throwable $e) {
            return back()->with('error', 'Gagal memicu worker antrean background: ' . $e->getMessage());
        }

        return back()->with('success', "Worker antrean background berhasil dipemicu untuk {$pendingCount} email. Pengiriman berjalan di latar belakang secara otomatis sampai selesai.");
    }

    public function cancelQueue(): RedirectResponse
    {
        $pendingCount = DB::table('jobs')->count();

        if ($pendingCount === 0) {
            return back()->with('info', 'Tidak ada antrean email yang sedang berjalan untuk dibatalkan.');
        }

        try {
            DB::table('jobs')->truncate();
            PayrollImport::where('status', 'sending')->update(['status' => 'done']);
        } catch (\Throwable $e) {
            return back()->with('error', 'Gagal membatalkan antrean: ' . $e->getMessage());
        }

        return back()->with('success', "Berhasil membatalkan dan membersihkan {$pendingCount} antrean email.");
    }

    public function exportOvertimePdf(PayrollEmployee $employee): \Illuminate\Http\Response
    {
        $pdf = Pdf::loadView('pdf.overtime', [
            'employee' => $employee,
            'import' => $employee->import,
        ])->setPaper('a4', 'portrait');

        $nip = $employee->nip;
        $filename = "SlipLembur_{$nip}_{$employee->import->period}.pdf";
        return $pdf->download($filename);
    }

    public static function generateAndStoreOvertimePdf(PayrollEmployee $employee): string
    {
        $pdf = Pdf::loadView('pdf.overtime', [
            'employee' => $employee,
            'import' => $employee->import,
        ])->setPaper('a4', 'portrait');

        $nip = $employee->nip;
        $path = "payroll/overtime_{$employee->id}_{$nip}.pdf";
        Storage::put($path, $pdf->output());

        return $path;
    }

    public function destroy(PayrollImport $import): RedirectResponse
    {
        foreach ($import->employees as $employee) {
            if ($employee->pdf_path && Storage::exists($employee->pdf_path)) {
                Storage::delete($employee->pdf_path);
            }
        }

        $import->delete();

        return back()->with('success', 'Data import payroll berhasil dihapus.');
    }

    public function updateEmployee(Request $request, PayrollEmployee $employee): RedirectResponse
    {
        $validated = $request->validate([
            'nip' => 'nullable|string|max:100',
            'rekening' => 'nullable|string|max:100',
            'bank' => 'nullable|string|max:100',
            'nama' => 'required|string|max:255',
            'departement' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',

            'lembur_biasa' => 'nullable|numeric|min:0',
            'jam_lb' => 'nullable|numeric|min:0',
            'jumlah_lb' => 'nullable|numeric|min:0',
            'lembur_libur' => 'nullable|numeric|min:0',
            'jam_ll' => 'nullable|numeric|min:0',
            'jumlah_ll' => 'nullable|numeric|min:0',
            'total_lembur' => 'nullable|numeric|min:0',
        ]);

        $payload = $validated;

        if ($employee->pdf_path && Storage::exists($employee->pdf_path)) {
            Storage::delete($employee->pdf_path);
            $payload['pdf_path'] = null;
        }

        $employee->update($payload);

        return back()->with('success', "Data karyawan '{$employee->nama}' berhasil diperbarui.");
    }

    public function destroyEmployee(PayrollEmployee $employee): RedirectResponse
    {
        if ($employee->pdf_path && Storage::exists($employee->pdf_path)) {
            Storage::delete($employee->pdf_path);
        }

        $import = $employee->import;
        $nama = $employee->nama;

        $employee->delete();

        if ($import) {
            $import->decrement('total_rows');
        }

        return back()->with('success', "Data karyawan '{$nama}' berhasil dihapus.");
    }
}
