import { redirect } from 'next/navigation';

export default function LegacyAddProductPage() {
    redirect('/dashboard/products/manage');
}