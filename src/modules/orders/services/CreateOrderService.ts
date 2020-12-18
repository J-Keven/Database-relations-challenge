import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('This customer dont exists');
    }

    const allProductsById = await this.productsRepository.findAllById(
      products.map(item => ({ id: item.id })),
    );

    if (allProductsById.length !== products.length) {
      throw new AppError('Product not found');
    }

    const orderProductsArray = allProductsById.map(product => {
      const index = products.findIndex(item => item.id === product.id);
      const { quantity } = products[index];
      if (product.quantity - quantity < 0) {
        throw new AppError(
          `the product with id "${product.id}" does not quantity suficient`,
        );
      }
      return {
        price: Number(product.price),
        product_id: product.id,
        quantity,
      };
    });

    await this.productsRepository.updateQuantity(products);

    const order = await this.ordersRepository.create({
      customer,
      products: orderProductsArray,
    });

    order.customer = customer;

    return order;
  }
}

export default CreateOrderService;
