import { ArrowRight, LockKeyhole } from "lucide-react";
import type { FormEvent } from "react";
import { Head, useForm } from "@inertiajs/react";

import { login } from "@/routes";
import GuestLayout from "@/Layouts/GuestLayout";
import { FieldDescription, FieldError } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type LoginProps = {
    status?: string;
};

type LoginForm = {
    email: string;
    password: string;
};

export default function Login({ status }: LoginProps) {
    const { data, setData, post, processing, errors, reset } =
        useForm<LoginForm>({
            email: "",
            password: "",
        });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        post(login.url(), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
                <aside className="relative hidden overflow-hidden rounded-[1.75rem] border border-emerald-200/70 bg-[linear-gradient(160deg,#f0fdf4_0%,#dcfce7_55%,#bbf7d0_100%)] p-8 text-emerald-950 lg:flex lg:flex-col lg:justify-between">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.14),transparent_28%)]" />

                    <div className="relative space-y-8">
                        <div className="flex items-center justify-between gap-4">
                            <img
                                src="/LOGO%20GGM%20BARU.png"
                                alt="Logo GGM Baru"
                                className="h-14 w-auto drop-shadow-sm"
                            />
                        </div>
                        <div className="space-y-4">
                            <h2 className="max-w-md text-4xl font-semibold tracking-tight text-balance text-emerald-950">
                                Akses payroll resmi GGM.
                            </h2>
                            <p className="max-w-md text-sm leading-6 text-emerald-900/75">
                                Masuk untuk mengelola data payroll, slip
                                karyawan, dan pengaturan terkait akun.
                            </p>
                        </div>
                        <div className="inline-flex items-center gap-2 text-sm font-medium text-emerald-900/80">
                            <LockKeyhole className="size-4 text-emerald-700" />
                            Secure corporate access
                        </div>
                    </div>

                    <div className="relative flex items-end justify-between border-t border-emerald-200 pt-6 text-xs text-emerald-900/60">
                        <span>Payroll management</span>
                        <span>GGM</span>
                    </div>
                </aside>

                <div className="rounded-[1.75rem] border border-emerald-100/80 bg-white/95 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] sm:p-8">
                    <div className="mb-8 space-y-3">
                        <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
                            Masuk
                        </h2>
                        <p className="text-sm leading-6 text-slate-500">
                            Gunakan akun terdaftar untuk mengakses dashboard.
                        </p>
                    </div>

                    {status && (
                        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                autoComplete="email"
                                required
                                placeholder="nama@perusahaan.com"
                                value={data.email}
                                onChange={(event) =>
                                    setData("email", event.target.value)
                                }
                                aria-invalid={Boolean(errors.email)}
                            />
                            {errors.email ? (
                                <FieldError>{errors.email}</FieldError>
                            ) : (
                                <FieldDescription>
                                    Email akun Anda.
                                </FieldDescription>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                placeholder="Masukkan password"
                                value={data.password}
                                onChange={(event) =>
                                    setData("password", event.target.value)
                                }
                                aria-invalid={Boolean(errors.password)}
                            />
                            {errors.password ? (
                                <FieldError>{errors.password}</FieldError>
                            ) : (
                                <FieldDescription>
                                    Password akun Anda.
                                </FieldDescription>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="h-11 w-full rounded-xl text-sm font-semibold"
                            isDisabled={processing}
                        >
                            {processing ? "Memproses..." : "Masuk"}
                            <ArrowRight className="size-4" />
                        </Button>
                    </form>
                </div>
            </section>
        </GuestLayout>
    );
}
