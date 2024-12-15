import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react";

const Breadcrumbs = ({ routes = [] }: { routes: string[] }) => {
    const breadcrumbItems = routes.slice(0, -1).map((route, index) => {
        const href = "/" + routes.slice(0, index + 1).join("/");
        return (
            <Fragment key={href}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink href={href}>{route}</BreadcrumbLink>
                </BreadcrumbItem>
            </Fragment>
        );
    });

    const lastRoute = routes[routes.length - 1];
    const breadcrumbPage = lastRoute ? (
        <BreadcrumbItem>
            <BreadcrumbPage>{lastRoute}</BreadcrumbPage>
        </BreadcrumbItem>
    ) : null;

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                {breadcrumbItems}
                {routes.length > 0 && <BreadcrumbSeparator />}
                {breadcrumbPage}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

Breadcrumbs.displayName = "Breadcrumbs";
export { Breadcrumbs };
