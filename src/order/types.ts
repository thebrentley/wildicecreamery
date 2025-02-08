export type ProductInput = {
  id: number;
  quantity: number;
};

export type CreateOrderInput = {
  email: string;
  products: ProductInput[];
};
