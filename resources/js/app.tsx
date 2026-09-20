import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import type { ComponentType } from "react";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

void createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: async (name) =>
        (await resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob("./pages/**/*.tsx"),
        )) as ComponentType,
    setup({ el, App, props }) {
        if (el) {
            createRoot(el).render(<App {...props} />);

            return;
        }

        return <App {...props} />;
    },
    progress: {
        color: "#4B5563",
    },
});
