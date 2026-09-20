import { Link } from "@inertiajs/react";
import { createContext, useContext, useState, type ReactNode } from "react";

type DropdownContextValue = {
    open: boolean;
    setOpen: (open: boolean) => void;
    toggleOpen: () => void;
};

const DropdownContext = createContext<DropdownContextValue | null>(null);

function useDropdown() {
    const context = useContext(DropdownContext);
    if (!context)
        throw new Error("Dropdown components must be nested inside Dropdown.");
    return context;
}

function Trigger({ children }: { children: ReactNode }) {
    const { open, setOpen, toggleOpen } = useDropdown();
    return (
        <>
            <div onClick={toggleOpen}>{children}</div>
            {open && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setOpen(false)}
                />
            )}
        </>
    );
}

function Content({
    children,
    contentClasses = "py-1 bg-white",
}: {
    children: ReactNode;
    contentClasses?: string;
}) {
    const { open, setOpen } = useDropdown();
    if (!open) return null;
    return (
        <div className="absolute end-0 z-50 mt-2 w-48 origin-top-right rounded-md shadow-lg">
            <div
                className={`rounded-md ring-1 ring-black/5 ${contentClasses}`}
                onClick={() => setOpen(false)}
            >
                {children}
            </div>
        </div>
    );
}

function DropdownLink({
    children,
    className = "",
    ...props
}: React.ComponentProps<typeof Link>) {
    return (
        <Link
            {...props}
            className={`block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 transition hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}

function Dropdown({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);
    const toggleOpen = () => setOpen((previousState) => !previousState);
    return (
        <DropdownContext.Provider value={{ open, setOpen, toggleOpen }}>
            <div className="relative">{children}</div>
        </DropdownContext.Provider>
    );
}

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = DropdownLink;

export default Dropdown;
