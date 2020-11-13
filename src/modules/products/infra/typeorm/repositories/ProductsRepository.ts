import { getRepository, Repository } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = await this.ormRepository.create({
      name,
      price,
      quantity,
    });

    await this.ormRepository.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne({
      where: { name },
    });

    return product;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const product = await this.ormRepository.find({
      where: products,
    });

    return product;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const productsArray = await this.findAllById(
      products.map(item => ({
        id: item.id,
      })),
    );

    const productsArrayUpdate = productsArray.map(item => {
      const indexOfProductsQuantity = products.findIndex(
        indexOf => indexOf.id === item.id,
      );

      if (indexOfProductsQuantity !== -1) {
        const updateProduct = item;
        updateProduct.quantity = products[indexOfProductsQuantity].quantity;

        return updateProduct;
      }
      return item;
    });

    await this.ormRepository.save(productsArrayUpdate);

    return productsArrayUpdate;
  }
}

export default ProductsRepository;
