export interface ICreateProductDTO {
    name: string,
    size: string,
    image: string,
    color: string,
    price: number,
    category: string,
    description: string,
    orderQuantity: number,
    discountPercent: number,
    availableQuantity: number,
}

export type UpdateProductDTO = Partial<ICreateProductDTO>;