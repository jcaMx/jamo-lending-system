import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Megaphone } from 'lucide-react';
import { route } from 'ziggy-js';



const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Borrowers',
        href: route('borrowers.index'),
    }
];

export default function Index() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Borrowers" />

            <div className="p-6">
                <Alert>
                    <Megaphone className="h-4 w-4" />
                    <AlertTitle>Borrowers Page</AlertTitle>
                    <AlertDescription>
                        Manage or add new borrowers here.
                    </AlertDescription>
                </Alert>

            </div>
        </AppLayout>
    );
}
