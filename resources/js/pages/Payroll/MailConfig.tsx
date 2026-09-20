import { Head, router, useForm } from "@inertiajs/react";
import { Check, Edit2, Mail, Plus, Send, Sparkles, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import EmptyState from "@/components/EmptyState";
import {
    activate,
    destroy,
    store,
    test as testRoute,
    update,
} from "@/routes/mail-config";

type Config = {
    id: number;
    name: string;
    host: string;
    port: number;
    username: string;
    encryption: string;
    from_address: string;
    from_name: string;
    is_active: boolean;
    quota?: { sent: number; limit: number; remaining: number };
};

type Form = {
    name: string;
    host: string;
    port: number;
    username: string;
    password: string;
    encryption: "tls" | "ssl";
    from_address: string;
    from_name: string;
};

const FIELDS = [
    {
        key: "name",
        label: "Label Konfigurasi",
        type: "text",
        placeholder: "Gmail HRD 1",
    },
    {
        key: "host",
        label: "SMTP Host",
        type: "text",
        placeholder: "smtp.gmail.com",
    },
    { key: "port", label: "Port", type: "number", placeholder: "587" },
    {
        key: "username",
        label: "Username Email",
        type: "email",
        placeholder: "email@gmail.com",
    },
    {
        key: "password",
        label: "App Password Gmail",
        type: "password",
        placeholder: "•••• •••• •••• ••••",
    },
    {
        key: "from_address",
        label: "Email Pengirim (From)",
        type: "email",
        placeholder: "email@gmail.com",
    },
    {
        key: "from_name",
        label: "Nama Pengirim (From Name)",
        type: "text",
        placeholder: "TIM HR PAYROLL",
    },
] as const;

const DEFAULT: Form = {
    name: "",
    host: "smtp.gmail.com",
    port: 587,
    username: "",
    password: "",
    encryption: "tls",
    from_address: "",
    from_name: "TIM HR PAYROLL",
};

export default function MailConfig({ configs = [] }: { configs?: Config[] }) {
    const [editing, setEditing] = useState<number | null>(null);
    const [testTarget, setTestTarget] = useState<number | null>(null);
    const [testEmail, setTestEmail] = useState("");
    const [testLoading, setTestLoading] = useState(false);
    const { data, setData, post, put, processing, errors, reset } =
        useForm<Form>(DEFAULT);

    const startEdit = (config: Config) => {
        setEditing(config.id);
        setData({
            name: config.name,
            host: config.host,
            port: config.port,
            username: config.username,
            password: "",
            encryption: config.encryption === "ssl" ? "ssl" : "tls",
            from_address: config.from_address,
            from_name: config.from_name,
        });
    };

    const cancelEdit = () => {
        setEditing(null);
        reset();
    };

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (editing !== null) {
            put(update.url(editing), { onSuccess: cancelEdit });
            return;
        }
        post(store.url(), { onSuccess: () => reset() });
    };

    const handleTest = () => {
        if (!testEmail || testTarget === null) return;
        setTestLoading(true);
        router.post(
            testRoute.url(testTarget),
            { to: testEmail },
            {
                onFinish: () => {
                    setTestLoading(false);
                    setTestTarget(null);
                    setTestEmail("");
                },
            },
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-600">
                        Pengaturan Email
                    </p>
                    <h2 className="text-xl font-semibold leading-tight text-slate-900">
                        Konfigurasi SMTP
                    </h2>
                </div>
            }
        >
            <Head title="Konfigurasi SMTP Email" />
            <div className="space-y-6">
                <div className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl space-y-3">
                            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                                <Sparkles className="size-3.5" />
                                SMTP Configuration Manager
                            </div>
                            <h3 className="text-3xl font-semibold tracking-tight text-slate-900">
                                Setup Pengiriman Email Payroll
                            </h3>
                            <p className="text-sm leading-6 text-slate-500">
                                Konfigurasi SMTP dipakai untuk mengirim slip
                                lembur secara otomatis kepada karyawan via
                                email.
                            </p>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                            <Mail className="size-4" />
                            SMTP Workspace
                        </div>
                    </div>
                </div>

                <div className="grid items-start gap-6 lg:grid-cols-12">
                    <div className="min-w-0 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm lg:col-span-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div>
                                <h3 className="text-base font-semibold text-slate-900">
                                    {editing !== null
                                        ? "Edit Konfigurasi SMTP"
                                        : "Tambah Konfigurasi SMTP"}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Isi parameter akun email pengirim di bawah
                                    ini.
                                </p>
                            </div>
                            <div className="grid size-9 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                                {editing !== null ? (
                                    <Edit2 className="size-4" />
                                ) : (
                                    <Plus className="size-4" />
                                )}
                            </div>
                        </div>
                        <form onSubmit={submit} className="mt-5 space-y-4">
                            {FIELDS.map(({ key, label, type, placeholder }) => (
                                <div key={key} className="space-y-1.5">
                                    <label className="block text-xs font-semibold text-slate-700">
                                        {label}
                                        {key === "password" &&
                                            editing !== null && (
                                                <span className="ml-1 font-normal text-slate-400">
                                                    (kosongkan jika tidak
                                                    diubah)
                                                </span>
                                            )}
                                    </label>
                                    <input
                                        type={type}
                                        placeholder={placeholder}
                                        autoComplete={
                                            key === "password"
                                                ? "new-password"
                                                : undefined
                                        }
                                        value={data[key]}
                                        onChange={(event) =>
                                            setData(
                                                key,
                                                key === "port"
                                                    ? Number(event.target.value)
                                                    : event.target.value,
                                            )
                                        }
                                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                    />
                                    {key === "password" && (
                                        <p className="text-[11px] leading-tight text-amber-700">
                                            Gmail wajib pakai{" "}
                                            <strong>
                                                App Password 16 karakter
                                            </strong>
                                            . Spasi otomatis dibersihkan.
                                        </p>
                                    )}
                                    {errors[key] && (
                                        <p className="text-xs text-rose-600">
                                            {errors[key]}
                                        </p>
                                    )}
                                </div>
                            ))}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-slate-700">
                                    Enkripsi (Encryption)
                                </label>
                                <select
                                    value={data.encryption}
                                    onChange={(event) =>
                                        setData(
                                            "encryption",
                                            event.target
                                                .value as Form["encryption"],
                                        )
                                    }
                                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                >
                                    <option value="tls">
                                        TLS (Port 587 - Rekomendasi)
                                    </option>
                                    <option value="ssl">SSL (Port 465)</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 rounded-xl bg-emerald-600 py-3 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                                >
                                    {processing
                                        ? "Memproses..."
                                        : editing !== null
                                          ? "Update Konfigurasi"
                                          : "Simpan Konfigurasi"}
                                </button>
                                {editing !== null && (
                                    <button
                                        type="button"
                                        onClick={cancelEdit}
                                        className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                                    >
                                        Batal
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    <div className="min-w-0 overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm lg:col-span-7">
                        <div className="border-b border-slate-100 px-6 py-5">
                            <h3 className="text-base font-semibold text-slate-900">
                                Daftar Konfigurasi SMTP
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">
                                Kuota harian 400 email per akun. Jika kuota
                                penuh, sistem otomatis beralih ke akun SMTP
                                berikutnya.
                            </p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-175 w-full text-left text-xs">
                                <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                    <tr>
                                        {[
                                            "Label",
                                            "Host / User",
                                            "From Email",
                                            "Kuota Hari Ini",
                                            "Status",
                                            "Aksi",
                                        ].map((heading) => (
                                            <th
                                                key={heading}
                                                className="px-4 py-3"
                                            >
                                                {heading}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {configs.length === 0 ? (
                                        <EmptyState
                                            colSpan={6}
                                            icon={Mail}
                                            title="Belum Ada Konfigurasi SMTP"
                                            description="Isi formulir di samping untuk menambahkan konfigurasi email baru."
                                        />
                                    ) : (
                                        configs.map((config) => (
                                            <tr
                                                key={config.id}
                                                className={`transition hover:bg-slate-50/70 ${config.is_active ? "bg-emerald-50/40" : ""}`}
                                            >
                                                <td className="px-4 py-3 font-semibold text-slate-900">
                                                    <div>{config.name}</div>
                                                    <span className="font-mono text-[10px] font-normal text-slate-400">
                                                        {config.encryption.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="font-mono text-[11px] text-slate-700">
                                                        {config.host}:
                                                        {config.port}
                                                    </div>
                                                    <div
                                                        className="max-w-37.5 truncate text-[11px] text-slate-500"
                                                        title={config.username}
                                                    >
                                                        {config.username}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div
                                                        className="max-w-35 truncate font-medium text-slate-800"
                                                        title={
                                                            config.from_address
                                                        }
                                                    >
                                                        {config.from_address}
                                                    </div>
                                                    <div className="max-w-35 truncate text-[10px] text-slate-400">
                                                        {config.from_name}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3">
                                                    <span className="font-semibold text-slate-800">
                                                        {config.quota?.sent ??
                                                            0}{" "}
                                                        /{" "}
                                                        {config.quota?.limit ??
                                                            400}
                                                    </span>
                                                    <p className="text-[10px] text-slate-400">
                                                        Sisa:{" "}
                                                        {config.quota
                                                            ?.remaining ?? 400}
                                                    </p>
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3">
                                                    {config.is_active ? (
                                                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                                                            <Check className="size-3" />
                                                            Aktif
                                                        </span>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                router.patch(
                                                                    activate.url(
                                                                        config.id,
                                                                    ),
                                                                    {},
                                                                    {
                                                                        preserveScroll: true,
                                                                    },
                                                                )
                                                            }
                                                            className="text-xs font-semibold text-emerald-700 hover:underline"
                                                        >
                                                            Set Aktif
                                                        </button>
                                                    )}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3 text-right">
                                                    <div className="inline-flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                startEdit(
                                                                    config,
                                                                )
                                                            }
                                                            className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                                            title="Edit Konfigurasi"
                                                        >
                                                            <Edit2 className="size-3.5" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setTestTarget(
                                                                    config.id,
                                                                )
                                                            }
                                                            className="rounded-lg border border-emerald-200 bg-emerald-50 p-1.5 text-emerald-700 hover:bg-emerald-100"
                                                            title="Test Kirim Email"
                                                        >
                                                            <Send className="size-3.5" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                if (
                                                                    window.confirm(
                                                                        "Hapus konfigurasi ini?",
                                                                    )
                                                                )
                                                                    router.delete(
                                                                        destroy.url(
                                                                            config.id,
                                                                        ),
                                                                        {
                                                                            preserveScroll: true,
                                                                        },
                                                                    );
                                                            }}
                                                            className="rounded-lg border border-rose-100 bg-rose-50 p-1.5 text-rose-600 hover:bg-rose-100"
                                                            title="Hapus"
                                                        >
                                                            <Trash2 className="size-3.5" />
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
            </div>

            {testTarget !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-3xl border border-emerald-100 bg-white p-6 shadow-2xl">
                        <h3 className="mb-1 text-lg font-semibold text-slate-900">
                            Test Kirim Email
                        </h3>
                        <p className="mb-4 text-xs text-slate-500">
                            Email tes akan dikirim menggunakan konfigurasi SMTP
                            ini.
                        </p>
                        <input
                            type="email"
                            placeholder="Email tujuan test..."
                            value={testEmail}
                            onChange={(event) =>
                                setTestEmail(event.target.value)
                            }
                            autoFocus
                            className="mb-4 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        />
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={handleTest}
                                disabled={!testEmail || testLoading}
                                className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                            >
                                {testLoading ? "Mengirim..." : "Kirim Tes"}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setTestTarget(null);
                                    setTestEmail("");
                                }}
                                className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
