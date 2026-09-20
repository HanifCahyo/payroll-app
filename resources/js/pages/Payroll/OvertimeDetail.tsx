import Detail from "./Detail";
import type { ComponentProps } from "react";

export default function OvertimeDetail(props: ComponentProps<typeof Detail>) {
    return <Detail {...props} />;
}
