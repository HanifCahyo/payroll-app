import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { ShieldCheck, User } from "lucide-react";

import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";

type EditProps = { mustVerifyEmail?: boolean; status?: string };

export default function Edit({ mustVerifyEmail = false, status }: EditProps) {
    return (
        <AuthenticatedLayout
            header={
                <div className="space-y-2">
                    <p className="text-xs font-medium tracking-[0.2em] text-emerald-600 uppercase">
                        Account Settings
                    </p>
                    <h2 className="text-xl leading-tight font-semibold text-slate-900">
                        Profile
                    </h2>
                </div>
            }
        >
            <Head title="Profile" />
            <div className="space-y-6">
                <div className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl space-y-3">
                            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                                <User className="size-3.5" />
                                Pengaturan Akun
                            </div>
                            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                                Kelola identitas dan keamanan akun Anda.
                            </h1>
                            <p className="text-sm leading-6 text-slate-500">
                                Perbarui nama profil, email akun, kata sandi,
                                serta pengaturan keamanan pengguna di bawah ini.
                            </p>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                            <ShieldCheck className="size-4" />
                            Sistem Terproteksi
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-2xl"
                        />
                    </div>
                    <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
                        <UpdatePasswordForm className="max-w-2xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
