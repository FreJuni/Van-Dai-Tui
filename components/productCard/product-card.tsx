"use client";

import React from 'react';

type ProductCardProps = {
    data: {
        id: string,
        title: string,
        description: string,
        price: number,
        createdAt: Date | null
    }
}

const ProductCard = ({ data }: ProductCardProps) => {

    return (
        <div>
            Card
            <span onClick={() => {

            }}>Edit</span>
            <span onClick={() => {

            }}>Delete</span>

        </div>
    )
}

export default ProductCard
