import { Test, TestingModule } from '@nestjs/testing';
import { TarifaService } from './tarifa.service';

describe('TarifaService', () => {
  let service: TarifaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TarifaService],
    }).compile();

    service = module.get<TarifaService>(TarifaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
