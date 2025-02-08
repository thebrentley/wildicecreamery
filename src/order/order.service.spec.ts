import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderService } from './order.service';
import { Order } from './order.entity';
import { OrderProduct } from './order-product.entity';
import { ProductService } from '../product/product.service';
import { BadRequestException } from '@nestjs/common';
import { CreateOrderInput } from './types';
import { EmailService } from '../email/email.service';

// Mock createId to return a predictable value
jest.mock('@paralleldrive/cuid2', () => ({
  createId: jest.fn().mockReturnValue('mock-cuid'),
}));

describe('OrderService', () => {
  let service: OrderService;
  let orderRepository: Repository<Order>;
  let orderProductRepository: Repository<OrderProduct>;
  let productService: ProductService;

  const mockOrder = {
    id: 'mock-cuid',
    orderProducts: [
      { productId: 1, quantity: 2, product: { name: 'Test1' } },
      { productId: 2, quantity: 1, product: { name: 'Test2' } },
    ],
  };

  const mockProduct = {
    id: 1,
    name: 'Test Product',
    price: 100,
  };

  const mockOrderRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockOrderProductRepository = {
    save: jest.fn(),
  };

  const mockProductService = {
    getProductById: jest.fn(),
  };

  const mockEmailService = {
    sendOrderEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository,
        },
        {
          provide: getRepositoryToken(OrderProduct),
          useValue: mockOrderProductRepository,
        },
        {
          provide: ProductService,
          useValue: mockProductService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    orderProductRepository = module.get<Repository<OrderProduct>>(
      getRepositoryToken(OrderProduct),
    );
    productService = module.get<ProductService>(ProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(orderRepository).toBeDefined();
    expect(orderProductRepository).toBeDefined();
    expect(productService).toBeDefined();
  });

  describe('createOrder', () => {
    const validCreateOrderInput: CreateOrderInput = {
      email: 'test@example.com',
      products: [
        { id: 1, quantity: 2 },
        { id: 2, quantity: 1 },
      ],
    };

    it('should successfully create an order with valid input', async () => {
      mockProductService.getProductById
        .mockResolvedValueOnce(mockProduct)
        .mockResolvedValueOnce({ ...mockProduct, id: 2 });
      mockOrderRepository.save.mockResolvedValue(mockOrder);
      mockOrderRepository.findOne.mockResolvedValue(mockOrder);

      const result = await service.createOrder(validCreateOrderInput);

      expect(result).toEqual(mockOrder);
      expect(mockProductService.getProductById).toHaveBeenCalledTimes(2);
      expect(mockOrderRepository.save).toHaveBeenCalledWith({
        id: 'mock-cuid',
        recipientEmail: 'test@example.com',
        orderProducts: [
          { productId: 1, quantity: 2 },
          { productId: 2, quantity: 1 },
        ],
      });
    });

    it('should throw BadRequestException when email is missing', async () => {
      const invalidInput = { ...validCreateOrderInput, email: '' };

      await expect(service.createOrder(invalidInput)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockProductService.getProductById).not.toHaveBeenCalled();
      expect(mockOrderRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when products array is empty', async () => {
      const invalidInput = { ...validCreateOrderInput, products: [] };

      await expect(service.createOrder(invalidInput)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockProductService.getProductById).not.toHaveBeenCalled();
      expect(mockOrderRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when product quantity is missing', async () => {
      mockProductService.getProductById.mockResolvedValue(mockProduct);
      const invalidInput = {
        ...validCreateOrderInput,
        products: [{ id: 1, quantity: 0 }],
      };

      await expect(service.createOrder(invalidInput)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockProductService.getProductById).toHaveBeenCalledTimes(1);
      expect(mockOrderRepository.save).not.toHaveBeenCalled();
    });

    it('should handle product service errors', async () => {
      const error = new Error('Product service error');
      mockProductService.getProductById.mockRejectedValue(error);

      await expect(service.createOrder(validCreateOrderInput)).rejects.toThrow(
        error,
      );
      expect(mockOrderRepository.save).not.toHaveBeenCalled();
    });

    it('should handle order repository errors', async () => {
      mockProductService.getProductById
        .mockResolvedValueOnce(mockProduct)
        .mockResolvedValueOnce({ ...mockProduct, id: 2 });
      const error = new Error('Database error');
      mockOrderRepository.save.mockRejectedValue(error);

      await expect(service.createOrder(validCreateOrderInput)).rejects.toThrow(
        error,
      );
      expect(mockProductService.getProductById).toHaveBeenCalledTimes(2);
      expect(mockOrderRepository.save).toHaveBeenCalledTimes(1);
    });
  });
});
