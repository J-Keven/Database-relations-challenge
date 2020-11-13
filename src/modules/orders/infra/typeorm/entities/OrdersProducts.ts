import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';

import Order from '@modules/orders/infra/typeorm/entities/Order';
import Product from '@modules/products/infra/typeorm/entities/Product';

@Entity('ordersProducts')
class OrdersProducts {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  product_id: string;

  @Column()
  order_id: string;

  @ManyToOne(() => Order, order => order, { eager: true })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Product, product => product, { eager: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default OrdersProducts;
