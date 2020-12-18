import { Request, Response } from 'express';

import { container } from 'tsyringe';

import CreateOrderService from '@modules/orders/services/CreateOrderService';
import FindOrderService from '@modules/orders/services/FindOrderService';

export default class OrdersController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const findOrderService = container.resolve(FindOrderService);

    const order = await findOrderService.execute({
      id,
    });

    return response.status(200).json(order);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const createOrderService = container.resolve(CreateOrderService);
    const { customer_id, products } = request.body;

    const order = await createOrderService.execute({
      customer_id,
      products,
    });

    return response.status(201).json(order);
  }
}
