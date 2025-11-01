import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto, userId: number) {
  return this.prisma.task.create({
    data: {
      title: createTaskDto.title,
      completed: false,
      user: {
        connect: { id: userId },
      },
    },
  });
  }

  async findAll() {
    return this.prisma.task.findMany({
      include: { user: true },
    });
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    await this.findOne(id);

    return this.prisma.task.update({
      where: { id },
      data: {
        title: updateTaskDto.title,
        completed: updateTaskDto.completed,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.task.delete({
      where: { id },
    });
  }
}