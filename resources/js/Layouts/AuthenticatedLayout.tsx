import Dropdown from "@/components/Dropdown";
import { Link, usePage } from "@inertiajs/react";
import { dashboard } from "@/routes";
import { index as mailConfigIndex } from "@/routes/mail-config";
import { form as payrollUploadForm } from "@/routes/payroll/upload";
import { index as overtimeIndex } from "@/routes/payroll/overtime";
import { edit as profileEdit } from "@/routes/profile";
import { useEffect, useState, type ReactNode } from "react";
import {
    CircleUserRound,
    LayoutDashboard,
    LogOut,
    Mail,
    Menu,
    TimerReset,
    UploadCloud,
    X,
} from "lucide-react";

type User = {
    name: string;
    email: string;
};

type Flash = {
    success?: string;
    error?: string;
};

type AuthenticatedPageProps = {
    auth: {
        user: User;
    };
    flash?: Flash;
};

type AuthenticatedLayoutProps = {
    user?: User;
    header?: ReactNode;
    children: ReactNode;
};

const navigation = [
    {
        name: "Dashboard",
        href: dashboard.url(),
        match: "dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "Upload Payroll",
        href: payrollUploadForm.url(),
        match: "payroll.upload.form",
        icon: UploadCloud,
    },
    {
        name: "Slip Lembur",
        href: overtimeIndex.url(),
        match: "payroll.overtime.*",
        icon: TimerReset,
    },
    {
        name: "SMTP Config",
        href: mailConfigIndex.url(),
        match: "mail-config.*",
        icon: Mail,
    },
];

function isNavigationActive(match: string, url: string) {
    if (match === "dashboard") return url === "/dashboard";
    if (match === "payroll.upload.form")
        return url.startsWith("/payroll/upload");
    if (match === "payroll.overtime.*")
        return url.startsWith("/payroll/lembur");
    return url.startsWith("/mail-config");
}

type SidebarLinkProps = {
    href: string;
    active: boolean;
    icon: typeof LayoutDashboard;
    children: ReactNode;
    onClick?: () => void;
};

function SidebarLink({
    href,
    active,
    icon: Icon,
    children,
    onClick,
}: SidebarLinkProps) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                active
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                    : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
            }`}
        >
            <Icon className="size-4 shrink-0" />
            <span>{children}</span>
        </Link>
    );
}

export default function AuthenticatedLayout({
    user: userProp,
    header,
    children,
}: AuthenticatedLayoutProps) {
    const page = usePage<AuthenticatedPageProps>();
    const { auth, flash } = page.props;
    const url = page.url;
    const user = userProp ?? auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const [toast, setToast] = useState<{
        msg: string;
        type: "success" | "error";
    } | null>(null);

    useEffect(() => {
        if (flash?.success) {
            setToast({ msg: flash.success, type: "success" });
        } else if (flash?.error) {
            setToast({ msg: flash.error, type: "error" });
        }

        const timeout = window.setTimeout(() => setToast(null), 4000);
        return () => window.clearTimeout(timeout);
    }, [flash]);

    return (
        <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#f0fdf4_100%)]">
            <div className="mx-auto flex min-h-screen max-w-[1800px]">
                <aside className="sticky top-0 hidden h-screen w-80 shrink-0 flex-col border-r border-emerald-100 bg-white/90 px-6 py-6 backdrop-blur xl:flex">
                    <Link
                        href={dashboard()}
                        className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-4"
                    >
                        <img
                            src="/LOGO%20GGM%20BARU.png"
                            alt="GGM"
                            className="h-12 w-auto"
                        />
                        <div>
                            <p className="text-sm font-semibold text-emerald-950">
                                GGM Payroll
                            </p>
                        </div>
                    </Link>

                    <nav className="mt-8 flex-1 space-y-2">
                        {navigation.map((item) => (
                            <SidebarLink
                                key={item.name}
                                href={item.href}
                                active={isNavigationActive(item.match, url)}
                                icon={item.icon}
                            >
                                {item.name}
                            </SidebarLink>
                        ))}
                        <div className="pt-4">
                            <SidebarLink
                                href={profileEdit.url()}
                                active={url.startsWith("/profile")}
                                icon={CircleUserRound}
                            >
                                Profile
                            </SidebarLink>
                        </div>
                    </nav>

                    <div className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm">
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-600">
                            Signed in as
                        </p>
                        <p className="mt-2 text-sm font-semibold text-slate-900">
                            {user.name}
                        </p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-rose-600 transition hover:text-rose-700"
                        >
                            <LogOut className="size-4" />
                            Log out
                        </Link>
                    </div>
                </aside>

                <div className="flex min-w-0 flex-1 flex-col">
                    <header className="sticky top-0 z-30 border-b border-white/70 bg-white/80 backdrop-blur">
                        <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8 xl:pl-10">
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowingNavigationDropdown(
                                            (previousState) => !previousState,
                                        )
                                    }
                                    className="inline-flex items-center justify-center rounded-xl border border-emerald-100 bg-white px-3 py-3 text-emerald-700 shadow-sm transition hover:bg-emerald-50 xl:hidden"
                                >
                                    {showingNavigationDropdown ? (
                                        <X className="size-5" />
                                    ) : (
                                        <Menu className="size-5" />
                                    )}
                                </button>
                            </div>

                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white px-3 py-2 text-left shadow-sm transition hover:bg-emerald-50"
                                    >
                                        <span className="grid size-9 place-items-center rounded-full bg-emerald-600 text-sm font-semibold text-white">
                                            {user.name.charAt(0).toUpperCase()}
                                        </span>
                                        <span className="hidden sm:block">
                                            <span className="block text-sm font-semibold text-slate-900">
                                                {user.name}
                                            </span>
                                            <span className="block text-xs text-slate-500">
                                                {user.email}
                                            </span>
                                        </span>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content contentClasses="bg-white p-2">
                                    <Dropdown.Link
                                        href={profileEdit.url()}
                                        className="rounded-xl px-4 py-3 hover:bg-emerald-50"
                                    >
                                        Profile
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="rounded-xl px-4 py-3 hover:bg-emerald-50"
                                    >
                                        Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>

                        {showingNavigationDropdown && (
                            <div className="border-t border-emerald-100 bg-white px-4 py-4 xl:hidden">
                                <div className="space-y-2">
                                    {navigation.map((item) => (
                                        <SidebarLink
                                            key={item.name}
                                            href={item.href}
                                            active={isNavigationActive(
                                                item.match,
                                                url,
                                            )}
                                            icon={item.icon}
                                            onClick={() =>
                                                setShowingNavigationDropdown(
                                                    false,
                                                )
                                            }
                                        >
                                            {item.name}
                                        </SidebarLink>
                                    ))}
                                    <SidebarLink
                                        href={profileEdit.url()}
                                        active={url.startsWith("/profile")}
                                        icon={CircleUserRound}
                                        onClick={() =>
                                            setShowingNavigationDropdown(false)
                                        }
                                    >
                                        Profile
                                    </SidebarLink>
                                </div>
                            </div>
                        )}
                    </header>

                    {toast && (
                        <div
                            className={`fixed right-4 top-4 z-50 rounded-2xl px-5 py-3 text-sm font-medium shadow-lg ${toast.type === "error" ? "bg-rose-600 text-white" : "bg-emerald-600 text-white"}`}
                        >
                            {toast.msg}
                        </div>
                    )}

                    <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
