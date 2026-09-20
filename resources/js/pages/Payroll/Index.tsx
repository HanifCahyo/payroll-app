import { Head, Link, router } from "@inertiajs/react";
import { ArrowRight, FileSpreadsheet, Trash2, UploadCloud } from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import EmptyState from "@/components/EmptyState";
import { form as uploadForm } from "@/routes/payroll/upload";
import { destroy } from "@/routes/payroll";
import { detail as overtimeDetail } from "@/routes/payroll/overtime";

type ImportItem = {
    id: number;
    file_name: string;
    period: string;
    period_range: string;
    employees_count?: number;
    status: string;
    created_at?: string;
};
type Props = { imports?: ImportItem[] };

export default function PayrollIndex({ imports = [] }: Props) {
    const title = "Lembur";
    const remove = (item: ImportItem) => {
        if (window.confirm(`Hapus import "${item.file_name}"?`))
            router.delete(destroy.url(item.id));
    };
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold text-slate-900">
                    {title}
                </h2>
            }
        >
            <Head title={title} />
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-600">
                            Payroll section
                        </p>
                        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
                            {title}
                        </h1>
                        <p className="mt-2 text-sm text-slate-500">
                            Kelola batch lembur bulanan dan pengiriman slip
                            lembur.
                        </p>
                    </div>
                </div>
                <div className="rounded-3xl border border-emerald-100 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                Riwayat import {title.toLowerCase()}
                            </h2>
                            <p className="text-sm text-slate-500">
                                Batch payroll yang tersimpan di sistem.
                            </p>
                        </div>
                        <Link
                            href={uploadForm.url()}
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white"
                        >
                            <UploadCloud className="size-4" />
                            Upload {title.toLowerCase()}
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                <tr>
                                    {[
                                        "File",
                                        "Periode",
                                        "Rentang",
                                        "Karyawan",
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
                                {imports.length === 0 ? (
                                    <EmptyState
                                        colSpan={6}
                                        icon={FileSpreadsheet}
                                        title={`Belum ada import ${title.toLowerCase()}`}
                                        description="Upload file payroll untuk membuat batch baru."
                                    />
                                ) : (
                                    imports.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-emerald-50/40"
                                        >
                                            <td className="px-4 py-4 font-medium text-slate-900">
                                                {item.file_name}
                                            </td>
                                            <td className="px-4 py-4 text-slate-600">
                                                {item.period}
                                            </td>
                                            <td className="px-4 py-4 text-slate-500">
                                                {item.period_range}
                                            </td>
                                            <td className="px-4 py-4 text-slate-600">
                                                {item.employees_count ?? 0}
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Link
                                                        href={overtimeDetail.url(
                                                            item.id,
                                                        )}
                                                        className="inline-flex items-center gap-1 text-emerald-700"
                                                    >
                                                        Detail
                                                        <ArrowRight className="size-4" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            remove(item)
                                                        }
                                                        className="inline-flex items-center gap-1 text-rose-600"
                                                    >
                                                        <Trash2 className="size-4" />
                                                        Hapus
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
            </div>
        </AuthenticatedLayout>
    );
}
