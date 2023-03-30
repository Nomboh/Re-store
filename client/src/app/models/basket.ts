export interface Basket {
  id: number;
  buyerId: string;
  items: BasketItems[];
}

export interface BasketItems {
  productId: number;
  name: string;
  price: number;
  pictureUrl: string;
  brand: string;
  type: string;
  quantity: number;
}
