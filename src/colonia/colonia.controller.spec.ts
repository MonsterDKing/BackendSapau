import { Test, TestingModule } from '@nestjs/testing';
import { ColoniaController } from './colonia.controller';
import { ColoniaService } from './colonia.service';

describe('ColoniaController', () => {
  let controller: ColoniaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ColoniaController],
      providers: [ColoniaService],
    }).compile();

    controller = module.get<ColoniaController>(ColoniaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
