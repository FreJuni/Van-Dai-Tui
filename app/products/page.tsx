import ProductCard from '@/components/productCard/product-card';
import { fetchAllProducts } from '@/server/actions/product';
import React from 'react';

const Products = async () => {

    const products = await fetchAllProducts();

    return (
        <div className=' my-5 mx-24' >
            <h2 className=' text-2xl font-medium'>Your products</h2>
            <div>
                {
                    products!.length > 0 && products?.map(p => {
                        return <ProductCard key={p.id} data={p} />
                    })
                }
            </div>
        </div>
    )
}

export default Products
