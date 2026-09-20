import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { useState, type FormEvent } from "react";
import {
    AlertCircle,
    ArrowRight,
    Ban,
    CheckCircle2,
    Download,
    Info,
    Mail,
    MailCheck,
    Pencil,
    Play,
    Send,
    ShieldCheck,
    Trash2,
    X,
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import EmptyState from "@/components/EmptyState";
import overtimeEmail from "@/routes/payroll/email/overtime";
import { overtime as overtimePdf } from "@/routes/payroll/pdf";
import employeeRoutes from "@/routes/payroll/employee";
import { index as overtimeIndex } from "@/routes/payroll/overtime";
import { Input } from "@/components/ui/input";

type Employee = {
    id: number;
    row_number: number;
    nip: string | null;
    rekening: string | null;
    bank: string | null;
    nama: string | null;
    departement: string | null;
    email: string | null;
    jam_lb: number;
    jumlah_lb: number;
    jam_ll: number;
    jumlah_ll: number;
    total_lembur: number;
    email_sent: boolean;
};
type ImportData = {
    id: number;
    period: string;
    period_range: string;
    total_rows: number;
};
type Props = {
    import: ImportData;
    employees?: Employee[];
    pendingJobsCount?: number;
};
type EditData = {
    nip: string;
    rekening: string;
    bank: string;
    nama: string;
    departement: string;
    email: string;
    jam_lb: number;
    jumlah_lb: number;
    jam_ll: number;
    jumlah_ll: number;
    total_lembur: number;
};
const money = (value: number) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(Number(value ?? 0));
const blankEdit: EditData = {
    nip: "",
    rekening: "",
    bank: "",
    nama: "",
    departement: "",
    email: "",
    jam_lb: 0,
    jumlah_lb: 0,
    jam_ll: 0,
    jumlah_ll: 0,
    total_lembur: 0,
};

export default function Detail({
    import: payrollImport,
    employees = [],
    pendingJobsCount = 0,
}: Props) {
    const { flash } = usePage().props as {
        flash?: { success?: string; error?: string; info?: string };
    };
    const [editing, setEditing] = useState<Employee | null>(null);
    const [bulkFrom, setBulkFrom] = useState(1);
    const [bulkTo, setBulkTo] = useState(payrollImport.total_rows);
    const [sending, setSending] = useState(false);
    const [processingQueue, setProcessingQueue] = useState(false);
    const [cancelingQueue, setCancelingQueue] = useState(false);
    const [localFlash, setLocalFlash] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);
    const { data, setData, put, processing, errors, reset } =
        useForm<EditData>(blankEdit);
    const openEdit = (employee: Employee) => {
        setEditing(employee);
        setData({
            nip: employee.nip ?? "",
            rekening: employee.rekening ?? "",
            bank: employee.bank ?? "",
            nama: employee.nama ?? "",
            departement: employee.departement ?? "",
            email: employee.email ?? "",
            jam_lb: employee.jam_lb ?? 0,
            jumlah_lb: employee.jumlah_lb ?? 0,
            jam_ll: employee.jam_ll ?? 0,
            jumlah_ll: employee.jumlah_ll ?? 0,
            total_lembur: employee.total_lembur ?? 0,
        });
    };
    const closeEdit = () => {
        setEditing(null);
        reset();
    };
    const saveEdit = (event: FormEvent) => {
        event.preventDefault();
        if (!editing) return;
        put(employeeRoutes.update.url(editing.id), {
            preserveScroll: true,
            onSuccess: closeEdit,
        });
    };
    const notify = (message: string, type: "success" | "error" = "success") => {
        setLocalFlash({ message, type });
        window.setTimeout(() => setLocalFlash(null), 4000);
    };
    const removeEmployee = (employee: Employee) => {
        if (window.confirm(`Hapus data ${employee.nama ?? "karyawan"}?`))
            router.delete(employeeRoutes.destroy.url(employee.id), {
                preserveScroll: true,
                onSuccess: () => notify("Data karyawan berhasil dihapus."),
                onError: () =>
                    notify("Gagal menghapus data karyawan.", "error"),
            });
    };
    const sendBulk = () => {
        if (
            bulkFrom < 1 ||
            bulkTo < bulkFrom ||
            bulkTo > payrollImport.total_rows
        ) {
            notify(
                `Rentang baris harus 1 sampai ${payrollImport.total_rows}.`,
                "error",
            );
            return;
        }
        if (!window.confirm(`Kirim slip lembur baris ${bulkFrom}–${bulkTo}?`))
            return;
        setSending(true);
        router.post(
            overtimeEmail.bulk.url(payrollImport.id),
            { from: bulkFrom, to: bulkTo },
            { preserveScroll: true, onFinish: () => setSending(false) },
        );
    };
    const sendOne = (employee: Employee) => {
        if (!employee.email?.trim()) {
            notify("Email karyawan belum diisi.", "error");
            return;
        }
        if (!window.confirm(`Kirim slip lembur ke ${employee.email}?`)) return;
        router.post(
            overtimeEmail.one.url(employee.id),
            {},
            { preserveScroll: true },
        );
    };
    const processQueue = () => {
        setProcessingQueue(true);
        router.post(
            "/payroll/process-queue",
            {},
            {
                preserveScroll: true,
                onFinish: () => setProcessingQueue(false),
            },
        );
    };
    const cancelQueue = () => {
        if (!window.confirm(`Batalkan ${pendingJobsCount} antrean email?`))
            return;
        setCancelingQueue(true);
        router.post(
            "/payroll/cancel-queue",
            {},
            {
                preserveScroll: true,
                onFinish: () => setCancelingQueue(false),
            },
        );
    };
    const activeError =
        flash?.error ??
        (localFlash?.type === "error" ? localFlash.message : undefined);
    const activeSuccess =
        flash?.success ??
        (localFlash?.type === "success" ? localFlash.message : undefined);
    const activeInfo = flash?.info;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold text-slate-900">
                    Detail Slip Lembur
                </h2>
            }
        >
            <Head title={`Slip Lembur - ${payrollImport.period}`} />
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-600">
                            Monthly overtime
                        </p>
                        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
                            Slip Lembur
                        </h1>
                        <p className="mt-2 text-sm text-slate-500">
                            {payrollImport.period} ·{" "}
                            {payrollImport.period_range} ·{" "}
                            {payrollImport.total_rows} karyawan
                        </p>
                    </div>
                    <Link
                        href={overtimeIndex.url()}
                        className="inline-flex items-center gap-2 rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-emerald-50 hover:text-emerald-800"
                    >
                        Kembali
                        <ArrowRight className="size-4 rotate-180" />
                    </Link>
                </div>
                {(activeError || activeSuccess || activeInfo) && (
                    <div
                        className={`rounded-2xl border p-4 text-sm shadow-sm ${
                            activeError
                                ? "border-rose-200 bg-rose-50 text-rose-800"
                                : activeInfo
                                  ? "border-sky-200 bg-sky-50 text-sky-800"
                                  : "border-emerald-200 bg-emerald-50 text-emerald-800"
                        }`}
                    >
                        <div className="flex items-start gap-3">
                            {activeError ? (
                                <AlertCircle className="size-5 shrink-0" />
                            ) : activeInfo ? (
                                <Info className="size-5 shrink-0" />
                            ) : (
                                <CheckCircle2 className="size-5 shrink-0" />
                            )}
                            <div>
                                <p className="font-semibold">
                                    {activeError
                                        ? "Gagal mengirim"
                                        : activeInfo
                                          ? "Informasi pengiriman"
                                          : "Berhasil"}
                                </p>
                                <p className="mt-1 text-xs opacity-90">
                                    {activeError || activeSuccess || activeInfo}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
                    <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Aksi batch
                                </h2>
                                <p className="text-sm text-slate-500">
                                    Kirim slip lembur untuk rentang baris yang
                                    dipilih.
                                </p>
                            </div>
                            <div className="inline-flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                                <ShieldCheck className="size-4" /> Otomatis
                                Rotasi Akun SMTP
                            </div>
                        </div>
                        <div className="mt-6 grid gap-4 md:grid-cols-3">
                            <label className="space-y-2 text-sm font-medium text-slate-700">
                                Dari baris
                                <Input
                                    type="number"
                                    min={1}
                                    max={payrollImport.total_rows}
                                    value={bulkFrom}
                                    onChange={(event) =>
                                        setBulkFrom(Number(event.target.value))
                                    }
                                />
                            </label>
                            <label className="space-y-2 text-sm font-medium text-slate-700">
                                Sampai baris
                                <Input
                                    type="number"
                                    min={1}
                                    max={payrollImport.total_rows}
                                    value={bulkTo}
                                    onChange={(event) =>
                                        setBulkTo(Number(event.target.value))
                                    }
                                />
                            </label>
                            <div className="flex items-end">
                                <button
                                    type="button"
                                    onClick={sendBulk}
                                    disabled={sending}
                                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
                                >
                                    <Send className="size-4" />{" "}
                                    {sending
                                        ? "Mengirim..."
                                        : "Kirim slip lembur"}
                                </button>
                            </div>
                        </div>
                        <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                <span
                                    className={`size-2.5 rounded-full ${pendingJobsCount > 0 ? "bg-amber-500" : "bg-emerald-500"}`}
                                />
                                <span className="font-semibold text-slate-900">
                                    {pendingJobsCount} Antrean Email (Pending)
                                </span>
                                <span>· Pengiriman Tanpa CLI Terminal</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {pendingJobsCount > 0 && (
                                    <button
                                        type="button"
                                        onClick={cancelQueue}
                                        disabled={cancelingQueue}
                                        className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-semibold text-rose-700"
                                    >
                                        <Ban className="size-3.5" />{" "}
                                        {cancelingQueue
                                            ? "Membatalkan..."
                                            : `Batalkan Antrean (${pendingJobsCount})`}
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={processQueue}
                                    disabled={processingQueue}
                                    className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white"
                                >
                                    <Play className="size-3.5 fill-emerald-400 text-emerald-400" />{" "}
                                    {processingQueue
                                        ? "Memproses..."
                                        : "Jalankan Queue Worker"}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                            Ringkasan
                        </p>
                        <div className="mt-4 space-y-4">
                            <div>
                                <p className="text-sm text-slate-500">
                                    Total karyawan
                                </p>
                                <p className="text-2xl font-semibold text-slate-900">
                                    {employees.length}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">
                                    Sudah terkirim
                                </p>
                                <p className="text-2xl font-semibold text-emerald-700">
                                    {
                                        employees.filter(
                                            (employee) => employee.email_sent,
                                        ).length
                                    }
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">
                                    Tanpa email
                                </p>
                                <p className="text-2xl font-semibold text-rose-600">
                                    {
                                        employees.filter(
                                            (employee) => !employee.email,
                                        ).length
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto rounded-3xl border border-emerald-100 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-6 py-5">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Daftar karyawan
                        </h2>
                        <p className="text-sm text-slate-500">
                            Detail slip dan status pengiriman per karyawan.
                        </p>
                    </div>
                    <table className="min-w-full text-sm">
                        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                            <tr>
                                {[
                                    "#",
                                    "NIP",
                                    "Nama",
                                    "Departement",
                                    "Jam LB",
                                    "Jam LL",
                                    "Total lembur",
                                    "Email",
                                    "Status",
                                    "Aksi",
                                ].map((heading) => (
                                    <th
                                        key={heading}
                                        className="px-4 py-3 text-left font-medium"
                                    >
                                        {heading}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {employees.length === 0 ? (
                                <EmptyState
                                    colSpan={10}
                                    title="Belum ada karyawan"
                                    description="Batch ini belum memiliki data lembur."
                                />
                            ) : (
                                employees.map((employee) => (
                                    <tr
                                        key={employee.id}
                                        className="hover:bg-emerald-50/40"
                                    >
                                        <td className="px-4 py-4 text-slate-500">
                                            {employee.row_number}
                                        </td>
                                        <td className="px-4 py-4">
                                            {employee.nip || "-"}
                                        </td>
                                        <td className="px-4 py-4 font-medium">
                                            {employee.nama || "-"}
                                        </td>
                                        <td className="px-4 py-4">
                                            {employee.departement || "-"}
                                        </td>
                                        <td className="px-4 py-4">
                                            {employee.jam_lb}
                                        </td>
                                        <td className="px-4 py-4">
                                            {employee.jam_ll}
                                        </td>
                                        <td className="px-4 py-4 font-semibold text-emerald-700">
                                            {money(employee.total_lembur)}
                                        </td>
                                        <td className="px-4 py-4">
                                            {employee.email || "-"}
                                        </td>
                                        <td className="px-4 py-4">
                                            {employee.email_sent ? (
                                                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                                                    <MailCheck className="size-3.5" />{" "}
                                                    Terkirim
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500">
                                                    <Mail className="size-3.5" />{" "}
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        employee.email_sent
                                                            ? undefined
                                                            : sendOne(employee)
                                                    }
                                                    className="text-emerald-700"
                                                    title={
                                                        employee.email_sent
                                                            ? "Email sudah terkirim"
                                                            : "Kirim email"
                                                    }
                                                >
                                                    {employee.email_sent ? (
                                                        <MailCheck className="size-4" />
                                                    ) : (
                                                        <Mail className="size-4" />
                                                    )}
                                                </button>
                                                <a
                                                    href={overtimePdf.url(
                                                        employee.id,
                                                    )}
                                                    className="text-slate-600"
                                                    title="Unduh PDF"
                                                >
                                                    <Download className="size-4" />
                                                </a>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openEdit(employee)
                                                    }
                                                    className="text-sky-700"
                                                    title="Edit"
                                                >
                                                    <Pencil className="size-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeEmployee(employee)
                                                    }
                                                    className="text-rose-600"
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="size-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {editing && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
                    <form
                        onSubmit={saveEdit}
                        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-emerald-600">
                                    CRUD data lembur
                                </p>
                                <h2 className="mt-1 text-xl font-semibold">
                                    Edit karyawan
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={closeEdit}
                                className="text-slate-500"
                            >
                                <X className="size-5" />
                            </button>
                        </div>
                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            {(
                                [
                                    "nama",
                                    "nip",
                                    "departement",
                                    "rekening",
                                    "bank",
                                    "email",
                                ] as const
                            ).map((field) => (
                                <label
                                    key={field}
                                    className="space-y-2 text-sm font-medium capitalize"
                                >
                                    {field}
                                    <Input
                                        value={data[field]}
                                        onChange={(event) =>
                                            setData(field, event.target.value)
                                        }
                                    />
                                    {errors[field] && (
                                        <span className="text-xs text-rose-600">
                                            {errors[field]}
                                        </span>
                                    )}
                                </label>
                            ))}
                            {(
                                [
                                    "jam_lb",
                                    "jumlah_lb",
                                    "jam_ll",
                                    "jumlah_ll",
                                    "total_lembur",
                                ] as const
                            ).map((field) => (
                                <label
                                    key={field}
                                    className="space-y-2 text-sm font-medium"
                                >
                                    {field.replaceAll("_", " ")}
                                    <Input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={data[field]}
                                        onChange={(event) =>
                                            setData(
                                                field,
                                                Number(event.target.value),
                                            )
                                        }
                                    />
                                    {errors[field] && (
                                        <span className="text-xs text-rose-600">
                                            {errors[field]}
                                        </span>
                                    )}
                                </label>
                            ))}
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={closeEdit}
                                className="rounded-xl border px-4 py-2 text-sm"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
                            >
                                {processing
                                    ? "Menyimpan..."
                                    : "Simpan perubahan"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
