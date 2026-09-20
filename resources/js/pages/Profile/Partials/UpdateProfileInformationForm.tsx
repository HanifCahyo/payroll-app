import { Link, useForm, usePage } from "@inertiajs/react";
import { CheckCircle2, Save, User } from "lucide-react";
import type { FormEvent } from "react";

import { update } from "@/routes/profile";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type ProfileForm = { name: string; email: string };
type ProfilePageProps = {
    auth: {
        user: { name: string; email: string; email_verified_at: string | null };
    };
};
type UpdateProfileInformationFormProps = {
    mustVerifyEmail?: boolean;
    status?: string;
    className?: string;
};

export default function UpdateProfileInformationForm({
    mustVerifyEmail = false,
    status,
    className = "",
}: UpdateProfileInformationFormProps) {
    const user = usePage<ProfilePageProps>().props.auth.user;
    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm<ProfileForm>({ name: user.name, email: user.email });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        patch(update.url());
    };

    return (
        <section className={className}>
            <header className="space-y-1">
                <div className="flex items-center gap-2 text-emerald-700">
                    <User className="size-5" />
                    <h2 className="text-lg font-semibold text-slate-900">
                        Informasi Profil
                    </h2>
                </div>
                <p className="text-sm leading-6 text-slate-500">
                    Perbarui nama lengkap dan alamat email utama akun pengguna
                    Anda.
                </p>
            </header>
            <form onSubmit={submit} className="mt-6 space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input
                        id="name"
                        value={data.name}
                        onChange={(event) =>
                            setData("name", event.target.value)
                        }
                        required
                        autoComplete="name"
                    />
                    <FieldError>{errors.name}</FieldError>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Alamat Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(event) =>
                            setData("email", event.target.value)
                        }
                        required
                        autoComplete="username"
                    />
                    <FieldError>{errors.email}</FieldError>
                </div>
                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                        <p className="text-sm text-amber-800">
                            Alamat email Anda belum terverifikasi.{" "}
                            <Link
                                href="/email/verification-notification"
                                method="post"
                                as="button"
                                className="font-semibold text-amber-900 underline hover:text-amber-950"
                            >
                                Klik di sini untuk mengirim ulang email
                                verifikasi.
                            </Link>
                        </p>
                        {status === "verification-link-sent" && (
                            <p className="mt-2 text-sm font-medium text-emerald-700">
                                Link verifikasi baru telah dikirim ke alamat
                                email Anda.
                            </p>
                        )}
                    </div>
                )}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                    <Button
                        type="submit"
                        isDisabled={processing}
                        className="bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                        <Save className="size-4" />
                        Simpan Perubahan
                    </Button>
                    {recentlySuccessful && (
                        <p className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700">
                            <CheckCircle2 className="size-4" />
                            Berhasil disimpan.
                        </p>
                    )}
                </div>
            </form>
        </section>
    );
}
