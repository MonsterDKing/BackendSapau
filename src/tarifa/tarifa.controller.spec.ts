import { Test, TestingModule } from '@nestjs/testing';
import { TarifaController } from './tarifa.controller';
import { TarifaService } from './tarifa.service';

describe('TarifaController', () => {
  let controller: TarifaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TarifaController],
      providers: [TarifaService],
    }).compile();

    controller = module.get<TarifaController>(TarifaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
