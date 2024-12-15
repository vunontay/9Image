import { Breadcrumbs } from "@/components/custom/breadcrumb-page";

export default async function BreadcrumbSlot({
    params,
}: {
    params: Promise<{ catchAll?: string[] }>;
}) {
    const { catchAll = [] } = await params;

    return (
        <div className="container mx-auto px-4 sm:px-8 py-2 sm:py-4">
            <Breadcrumbs routes={catchAll} />
        </div>
    );
}
