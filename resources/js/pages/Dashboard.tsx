import { Head, Link } from "@inertiajs/react";
import { ArrowRight, Clock3, FileSpreadsheet, Mail } from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { index as overtimeIndex } from "@/routes/payroll/overtime";
import { index as mailConfigIndex } from "@/routes/mail-config";

type Stats = {
    imports?: number;
    employees?: number;
    activeMailConfigs?: number;
    mailConfigs?: number;
};
type ImportItem = {
    id: number | string;
    file_name: string;
    period: string;
    employees_count: number;
    status: string;
};

function StatCard({
    label,
    value,
    hint,
}: {
    label: string;
    value?: number;
    hint: string;
}) {
    return (
        <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                {label}
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
                {value ?? 0}
            </p>
            <p className="mt-1 text-sm text-slate-500">{hint}</p>
        </div>
    );
}

export default function Dashboard({
    stats = {},
    recentImports = [],
}: {
    stats?: Stats;
    recentImports?: ImportItem[];
}) {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-600">
                        Overview
                    </p>
                    <h2 className="text-xl font-semibold leading-tight text-slate-900">
                        Dashboard Lembur
                    </h2>
                </div>
            }
        >
            <Head title="Dashboard Lembur" />
            <div className="space-y-6">
                <section className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl space-y-3">
                            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                                <FileSpreadsheet className="size-3.5" />
                                Monthly overtime
                            </div>
                            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                                Slip lembur bulanan dalam satu tempat.
                            </h1>
                            <p className="text-sm leading-6 text-slate-500">
                                Upload data, kelola tabel karyawan, unduh PDF,
                                dan kirim slip melalui email.
                            </p>
                        </div>
                        <Link
                            href={overtimeIndex.url()}
                            className="inline-flex items-center justify-between rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white"
                        >
                            Buka data lembur <ArrowRight className="size-4" />
                        </Link>
                    </div>
                </section>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        label="Batch lembur"
                        value={stats.imports}
                        hint="Batch yang tersimpan"
                    />
                    <StatCard
                        label="Karyawan"
                        value={stats.employees}
                        hint="Data lembur masuk"
                    />
                    <StatCard
                        label="SMTP aktif"
                        value={stats.activeMailConfigs}
                        hint="Konfigurasi email aktif"
                    />
                    <StatCard
                        label="SMTP total"
                        value={stats.mailConfigs}
                        hint="Seluruh konfigurasi email"
                    />
                </div>
                <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                    <section className="rounded-3xl border border-emerald-100 bg-white shadow-sm">
                        <div className="border-b border-slate-100 px-6 py-5">
                            <h2 className="text-lg font-semibold text-slate-900">
                                Import lembur terbaru
                            </h2>
                            <p className="text-sm text-slate-500">
                                Lima batch terakhir yang masuk.
                            </p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                    <tr>
                                        <th className="px-4 py-3 text-left">
                                            File
                                        </th>
                                        <th className="px-4 py-3 text-left">
                                            Periode
                                        </th>
                                        <th className="px-4 py-3 text-left">
                                            Karyawan
                                        </th>
                                        <th className="px-4 py-3 text-left">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {recentImports.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="px-4 py-12 text-center text-sm text-slate-500"
                                            >
                                                Belum ada import lembur.
                                            </td>
                                        </tr>
                                    ) : (
                                        recentImports.map((item) => (
                                            <tr key={item.id}>
                                                <td className="px-4 py-4 font-medium">
                                                    {item.file_name}
                                                </td>
                                                <td className="px-4 py-4">
                                                    {item.period}
                                                </td>
                                                <td className="px-4 py-4">
                                                    {item.employees_count}
                                                </td>
                                                <td className="px-4 py-4 text-emerald-700">
                                                    {item.status}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                    <section className="space-y-4 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                            Quick links
                        </p>
                        <Link
                            href={overtimeIndex.url()}
                            className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium"
                        >
                            <span className="flex items-center gap-2">
                                <Clock3 className="size-4 text-emerald-600" />
                                Slip lembur
                            </span>
                            <ArrowRight className="size-4" />
                        </Link>
                        <Link
                            href={mailConfigIndex.url()}
                            className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium"
                        >
                            <span className="flex items-center gap-2">
                                <Mail className="size-4 text-emerald-600" />
                                SMTP Config
                            </span>
                            <ArrowRight className="size-4" />
                        </Link>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
