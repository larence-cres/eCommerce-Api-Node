export interface ICreateCartDTO {
    name: string,
    size: string,
    color: string,
    image: string,
    price: string,
    buyerId: string,
    quantity: number,
    category: string,
    productId: string,
}

export type UpdateCartDTO = Partial<ICreateCartDTO>;