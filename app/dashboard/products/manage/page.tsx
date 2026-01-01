
import ProductForm from '@/components/product/product-form';
import React from 'react'
import { auth } from '@/server/auth';
import { redirect } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

const ManageProductPage = async () => {
    const session = await auth();
    if(!session?.user || session?.user?.role !== 'admin') {
        redirect('/')
    }

    return (
        <div className="space-y-10">
            {/* Header */}
            <div>
                <Link 
                    href="/dashboard/products" 
                    className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-primary transition-colors mb-4 group"
                >
                    <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                    Back to Products
                </Link>
                <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Manage Product</h1>
                <p className="text-gray-500 mt-2 font-medium">Create a new product or update an existing one.</p>
            </div>

            <div className='bg-white rounded-[3rem] border border-gray-100 shadow-sm'>
                <ProductForm />
            </div>
        </div>
    )
}

export default ManageProductPage
