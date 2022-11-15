import Repository from "../utils/firebase/firestore/repository";

export interface ProductVariant {
  id: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

class ProductRepository extends Repository<Product> {
  constructor() {
    super("products");
  }

  async getVariants(product: Product): Promise<ProductVariant[]> {
    return new Repository<ProductVariant>(
      `products/${product.id}/variants`
    ).getAll();
  }
}

export const productRepo = new ProductRepository();
