import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import Customer from '../infra/typeorm/entities/Customer';
import ICustomersRepository from '../repositories/ICustomersRepository';

interface IRequest {
  name: string;
  email: string;
}

@injectable()
class CreateCustomerService {
  private customersRepository: ICustomersRepository;

  constructor(
    @inject('CustomersRepository')
    customersRepository: ICustomersRepository,
  ) {
    this.customersRepository = customersRepository;
  }

  public async execute({ name, email }: IRequest): Promise<Customer> {
    const customerExist = await this.customersRepository.findByEmail(email);

    if (customerExist) {
      throw new AppError('this email is already being used');
    }

    const customer = await this.customersRepository.create({
      email,
      name,
    });

    return customer;
  }
}

export default CreateCustomerService;
