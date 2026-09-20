import PayrollIndex from "./Index";

export default function Overtime({
    imports = [],
}: {
    imports?: Parameters<typeof PayrollIndex>[0]["imports"];
}) {
    return <PayrollIndex imports={imports} />;
}
