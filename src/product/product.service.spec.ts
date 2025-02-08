import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductService } from './product.service';
import { Product } from './product.entity';

describe('ProductService', () => {
  let service: ProductService;
  let repository: Repository<Product>;

  const mockProducts: Partial<Product>[] = [
    { id: 1, name: 'Product 1', price: 100 },
    { id: 2, name: 'Product 2', price: 200 },
  ];

  const mockRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of products', async () => {
      mockRepository.find.mockResolvedValue(mockProducts);

      const result = await service.getAll();

      expect(result).toEqual(mockProducts);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
      expect(mockRepository.find).toHaveBeenCalledWith();
    });

    it('should return an empty array when no products exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.getAll();

      expect(result).toEqual([]);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should handle repository errors', async () => {
      const error = new Error('Database connection failed');
      mockRepository.find.mockRejectedValue(error);

      await expect(service.getAll()).rejects.toThrow(error);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('getProductById', () => {
    it('should return a product by id', async () => {
      const product = mockProducts[0];
      mockRepository.findOneBy.mockResolvedValue(product);

      const result = await service.getProductById(1);

      expect(result).toEqual(product);
      expect(mockRepository.findOneBy).toHaveBeenCalledTimes(1);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return null when product is not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      const result = await service.getProductById(999);

      expect(result).toBeNull();
      expect(mockRepository.findOneBy).toHaveBeenCalledTimes(1);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 999 });
    });

    it('should return null when id is not provided', async () => {
      const result = await service.getProductById(null);

      expect(result).toBeNull();
      expect(mockRepository.findOneBy).not.toHaveBeenCalled();
    });

    it('should handle repository errors', async () => {
      const error = new Error('Database connection failed');
      mockRepository.findOneBy.mockRejectedValue(error);

      await expect(service.getProductById(1)).rejects.toThrow(error);
      expect(mockRepository.findOneBy).toHaveBeenCalledTimes(1);
    });
  });
});
