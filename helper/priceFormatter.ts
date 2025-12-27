
type priceFormatter = {
    price: number,
}

export const priceFormatter = ({ price }: priceFormatter) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'MYR',
    }).format(price);
}