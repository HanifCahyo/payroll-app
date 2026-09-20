import { Head, Link, useForm } from "@inertiajs/react";
import {
    ArrowRight,
    CheckCircle2,
    Clock3,
    FileSpreadsheet,
    FileText,
    Sparkles,
    UploadCloud,
} from "lucide-react";
import type { FormEvent } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Input } from "@/components/ui/input";
import { FieldError } from "@/components/ui/field";
import { upload } from "@/routes/payroll";
import {
    detail as overtimeDetail,
    index as overtimeIndex,
} from "@/routes/payroll/overtime";

type UploadProps = {
    recentImports?: Array<{
        id: number;
        period: string;
        file_name: string;
        employees_count?: number;
    }>;
};
type UploadForm = {
    file: File | null;
    period: string;
    period_range: string;
    sheet_name: string;
};

export default function Upload({ recentImports = [] }: UploadProps) {
    const { data, setData, post, processing, errors } = useForm<UploadForm>({
        file: null,
        period: "",
        period_range: "",
        sheet_name: "",
    });
    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post(upload.url(), { forceFormData: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="space-y-1">
                    <p className="text-xs font-medium tracking-[0.2em] text-emerald-600 uppercase">
                        Batch impor
                    </p>
                    <h2 className="text-xl font-semibold text-slate-900">
                        Upload Slip Lembur
                    </h2>
                </div>
            }
        >
            <Head title="Upload Slip Lembur" />
            <div className="mx-auto max-w-6xl space-y-6">
                <section className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl space-y-3">
                            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                                <UploadCloud className="size-3.5" />
                                File Excel Processor
                            </div>
                            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
                                Unggah File Excel Lembur
                            </h1>
                            <p className="text-sm leading-6 text-slate-500">
                                Buat batch slip lembur bulanan dari satu file
                                Excel. Data jam, nominal, dan email karyawan
                                akan diproses otomatis.
                            </p>
                        </div>
                        <Link
                            href={overtimeIndex.url()}
                            className="inline-flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 transition hover:bg-emerald-100"
                        >
                            <Clock3 className="size-4" />
                            Riwayat Lembur
                        </Link>
                    </div>
                </section>
                <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                    <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Formulir Upload Lembur
                                </h2>
                                <p className="text-sm text-slate-500">
                                    Isi periode dan unggah file Excel Anda.
                                </p>
                            </div>
                            <div className="grid size-10 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                                <FileSpreadsheet className="size-5" />
                            </div>
                        </div>
                        <form onSubmit={submit} className="mt-6 space-y-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="space-y-2 text-sm font-medium text-slate-700">
                                    Periode Payroll
                                    <Input
                                        value={data.period}
                                        onChange={(event) =>
                                            setData(
                                                "period",
                                                event.target.value,
                                            )
                                        }
                                        placeholder="APRIL 2026"
                                        aria-invalid={!!errors.period}
                                    />
                                    {errors.period ? (
                                        <FieldError>{errors.period}</FieldError>
                                    ) : (
                                        <p className="text-xs font-normal text-slate-500">
                                            Contoh: APRIL 2026
                                        </p>
                                    )}
                                </label>
                                <label className="space-y-2 text-sm font-medium text-slate-700">
                                    Rentang Tanggal
                                    <Input
                                        value={data.period_range}
                                        onChange={(event) =>
                                            setData(
                                                "period_range",
                                                event.target.value,
                                            )
                                        }
                                        placeholder="1 - 30 APRIL 2026"
                                        aria-invalid={!!errors.period_range}
                                    />
                                    {errors.period_range ? (
                                        <FieldError>
                                            {errors.period_range}
                                        </FieldError>
                                    ) : (
                                        <p className="text-xs font-normal text-slate-500">
                                            Rentang waktu kerja
                                        </p>
                                    )}
                                </label>
                            </div>
                            <label className="space-y-2 text-sm font-medium text-slate-700">
                                Nama Sheet di Excel
                                <Input
                                    value={data.sheet_name}
                                    onChange={(event) =>
                                        setData(
                                            "sheet_name",
                                            event.target.value,
                                        )
                                    }
                                    placeholder="SLIP LEMBUR"
                                    aria-invalid={!!errors.sheet_name}
                                />
                                {errors.sheet_name ? (
                                    <FieldError>{errors.sheet_name}</FieldError>
                                ) : (
                                    <p className="text-xs font-normal text-slate-500">
                                        Opsional, default: SLIP LEMBUR
                                    </p>
                                )}
                            </label>
                            <label className="block space-y-2 text-sm font-medium text-slate-700">
                                File Excel Lembur
                                <div className="rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/40 p-5 transition hover:bg-emerald-50/70">
                                    <Input
                                        type="file"
                                        accept=".xlsx,.xlsm,.xls"
                                        className="cursor-pointer"
                                        onChange={(event) =>
                                            setData(
                                                "file",
                                                event.target.files?.[0] ?? null,
                                            )
                                        }
                                        aria-invalid={!!errors.file}
                                    />
                                    <p className="mt-2 text-xs font-normal text-slate-500">
                                        Format .xlsx, .xls, atau .xlsm. Maksimal
                                        50MB.
                                    </p>
                                </div>
                                {errors.file && (
                                    <FieldError>{errors.file}</FieldError>
                                )}
                            </label>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:opacity-50"
                            >
                                <UploadCloud className="size-4" />
                                {processing
                                    ? "Memproses Excel..."
                                    : "Upload & proses batch lembur"}
                            </button>
                        </form>
                    </section>
                    <div className="space-y-6">
                        <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-3 text-emerald-700">
                                <Sparkles className="size-5" />
                                <h3 className="text-base font-semibold text-slate-900">
                                    Panduan Format File Lembur
                                </h3>
                            </div>
                            <p className="mt-1 text-xs text-slate-500">
                                Pastikan header kolom sesuai agar data mudah
                                dicocokkan.
                            </p>
                            <ul className="mt-4 space-y-2.5 text-xs text-slate-600">
                                {[
                                    [
                                        "NIP BARU, NIP, Nama, Email:",
                                        "Wajib untuk pencocokan data dan pengiriman email.",
                                    ],
                                    [
                                        "Lembur Biasa:",
                                        "Jam lembur biasa dan nominal lembur biasa.",
                                    ],
                                    [
                                        "Lembur Libur:",
                                        "Jam lembur libur dan nominal lembur libur.",
                                    ],
                                ].map(([title, description]) => (
                                    <li
                                        key={title}
                                        className="flex items-start gap-2 rounded-xl bg-slate-50 p-2.5"
                                    >
                                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                                        <span>
                                            <strong className="font-semibold text-slate-800">
                                                {title}
                                            </strong>{" "}
                                            {description}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                        <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <h3 className="text-base font-semibold text-slate-900">
                                    Import Terbaru
                                </h3>
                                <FileText className="size-4 text-slate-400" />
                            </div>
                            <div className="mt-4 space-y-3">
                                {recentImports.length === 0 ? (
                                    <p className="text-xs text-slate-400">
                                        Belum ada batch lembur.
                                    </p>
                                ) : (
                                    recentImports.map((item) => (
                                        <div
                                            key={item.id}
                                            className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3 text-xs"
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <div>
                                                    <span className="font-semibold text-slate-800">
                                                        {item.period}
                                                    </span>
                                                    <p className="mt-1 text-slate-500">
                                                        {item.file_name} ·{" "}
                                                        {item.employees_count ??
                                                            0}{" "}
                                                        karyawan
                                                    </p>
                                                </div>
                                                <span className="rounded-md bg-amber-100 px-1.5 py-0.5 font-medium text-amber-800">
                                                    Lembur
                                                </span>
                                            </div>
                                            <Link
                                                href={overtimeDetail.url(
                                                    item.id,
                                                )}
                                                className="mt-3 inline-flex items-center gap-1 font-medium text-emerald-700 transition hover:text-emerald-800 hover:underline"
                                            >
                                                Buka detail
                                                <ArrowRight className="size-3.5" />
                                            </Link>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
