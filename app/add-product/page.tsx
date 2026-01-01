
import ProductForm from '@/components/product/product-form';
import React from 'react'


import { BackButton } from '@/components/ui/back-button';
import { auth } from '@/server/auth';
import { redirect } from 'next/navigation';

const AddProductPage = async () => {
    const session = await auth();
    if(!session?.user || session?.user?.role !== 'admin') {
        redirect('/')
    }

    return (
        <div className='mt-10 md:mt-20 w-max-full sm:w-full lg:w-3/4 md:w-4/5 mx-auto p-4 md:p-5'>
            <div className="mb-6">
                <BackButton />
            </div>
            <ProductForm />
        </div>
    )
}

export default AddProductPage