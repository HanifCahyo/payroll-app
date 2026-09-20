import { useForm } from "@inertiajs/react";
import { CheckCircle2, Eye, EyeOff, KeyRound, Save } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";

import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type PasswordForm = {
    current_password: string;
    password: string;
    password_confirmation: string;
};
type UpdatePasswordFormProps = { className?: string };

export default function UpdatePasswordForm({
    className = "",
}: UpdatePasswordFormProps) {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] =
        useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);
    const {
        data,
        setData,
        put,
        reset,
        errors,
        processing,
        recentlySuccessful,
    } = useForm<PasswordForm>({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const updatePassword = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        put("/password", {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (formErrors) => {
                if (formErrors.password) {
                    reset("password", "password_confirmation");
                    passwordInput.current?.focus();
                }
                if (formErrors.password_confirmation) {
                    reset("password_confirmation");
                    passwordInput.current?.focus();
                }
                if (formErrors.current_password) {
                    reset("current_password");
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header className="space-y-1">
                <div className="flex items-center gap-2 text-emerald-700">
                    <KeyRound className="size-5" />
                    <h2 className="text-lg font-semibold text-slate-900">
                        Perbarui Kata Sandi
                    </h2>
                </div>
                <p className="text-sm leading-6 text-slate-500">
                    Gunakan kombinasi kata sandi yang kuat dan unik demi
                    keamanan akses akun Anda.
                </p>
            </header>
            <form onSubmit={updatePassword} className="mt-6 space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="current_password">
                        Kata Sandi Saat Ini
                    </Label>
                    <div className="relative">
                        <Input
                            id="current_password"
                            ref={currentPasswordInput}
                            type={showCurrentPassword ? "text" : "password"}
                            value={data.current_password}
                            onChange={(event) =>
                                setData("current_password", event.target.value)
                            }
                            autoComplete="current-password"
                            className="pr-10"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={
                                showCurrentPassword
                                    ? "Sembunyikan kata sandi saat ini"
                                    : "Tampilkan kata sandi saat ini"
                            }
                            onPress={() =>
                                setShowCurrentPassword((visible) => !visible)
                            }
                            className="absolute top-1/2 right-1 -translate-y-1/2 text-slate-500 hover:text-emerald-700"
                        >
                            {showCurrentPassword ? (
                                <EyeOff className="size-4" />
                            ) : (
                                <Eye className="size-4" />
                            )}
                        </Button>
                    </div>
                    <FieldError>{errors.current_password}</FieldError>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Kata Sandi Baru</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            ref={passwordInput}
                            type={showPassword ? "text" : "password"}
                            value={data.password}
                            onChange={(event) =>
                                setData("password", event.target.value)
                            }
                            autoComplete="new-password"
                            className="pr-10"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={
                                showPassword
                                    ? "Sembunyikan kata sandi baru"
                                    : "Tampilkan kata sandi baru"
                            }
                            onPress={() =>
                                setShowPassword((visible) => !visible)
                            }
                            className="absolute top-1/2 right-1 -translate-y-1/2 text-slate-500 hover:text-emerald-700"
                        >
                            {showPassword ? (
                                <EyeOff className="size-4" />
                            ) : (
                                <Eye className="size-4" />
                            )}
                        </Button>
                    </div>
                    <FieldError>{errors.password}</FieldError>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password_confirmation">
                        Konfirmasi Kata Sandi Baru
                    </Label>
                    <div className="relative">
                        <Input
                            id="password_confirmation"
                            type={
                                showPasswordConfirmation ? "text" : "password"
                            }
                            value={data.password_confirmation}
                            onChange={(event) =>
                                setData(
                                    "password_confirmation",
                                    event.target.value,
                                )
                            }
                            autoComplete="new-password"
                            className="pr-10"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={
                                showPasswordConfirmation
                                    ? "Sembunyikan konfirmasi kata sandi"
                                    : "Tampilkan konfirmasi kata sandi"
                            }
                            onPress={() =>
                                setShowPasswordConfirmation(
                                    (visible) => !visible,
                                )
                            }
                            className="absolute top-1/2 right-1 -translate-y-1/2 text-slate-500 hover:text-emerald-700"
                        >
                            {showPasswordConfirmation ? (
                                <EyeOff className="size-4" />
                            ) : (
                                <Eye className="size-4" />
                            )}
                        </Button>
                    </div>
                    <FieldError>{errors.password_confirmation}</FieldError>
                </div>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                    <Button
                        type="submit"
                        isDisabled={processing}
                        className="bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                        <Save className="size-4" />
                        Update Kata Sandi
                    </Button>
                    {recentlySuccessful && (
                        <p className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700">
                            <CheckCircle2 className="size-4" />
                            Kata sandi berhasil diubah.
                        </p>
                    )}
                </div>
            </form>
        </section>
    );
}
