import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';

describe('TasksService', () => {
  let service: TasksService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: {
            task: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should return all tasks', async () => {
    const mockTasks = [
      { id: 1, title: 'Task 1', completed: false, userId: 1 },
      { id: 2, title: 'Task 2', completed: true, userId: 1 },
    ];

    (prisma.task.findMany as jest.Mock).mockResolvedValue(mockTasks);

    const result = await service.findAll();

    expect(result).toEqual(mockTasks);
    expect(prisma.task.findMany).toHaveBeenCalled();
  });
});