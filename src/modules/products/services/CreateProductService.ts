import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import Product from '../infra/typeorm/entities/Product';
import IProductsRepository from '../repositories/IProductsRepository';

interface IRequest {
  name: string;
  price: number;
  quantity: number;
}

@injectable()
class CreateProductService {
  private productsRepository: IProductsRepository;

  constructor(
    @inject('ProductsRepository')
    productsRepository: IProductsRepository,
  ) {
    this.productsRepository = productsRepository;
  }

  public async execute({ name, price, quantity }: IRequest): Promise<Product> {
    const productExist = await this.productsRepository.findByName(name);

    if (productExist) {
      throw new AppError('this product aready exist');
    }

    const products = await this.productsRepository.create({
      name,
      price,
      quantity,
    });

    return products;
  }
}

export default CreateProductService;
