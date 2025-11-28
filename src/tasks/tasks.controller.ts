import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    try {
      return await this.tasksService.findOne(Number(id));
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new NotFoundException('Task not found');
      }
      throw e;
    }
  }

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {
    const userId = 1;
    return this.tasksService.create(createTaskDto, userId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    try {
      return await this.tasksService.update(Number(id), updateTaskDto);
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new NotFoundException('Task not found');
      }
      throw e;
    }
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('administrator')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      await this.tasksService.remove(Number(id));
      return { message: 'Task deleted' };
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new NotFoundException('Task not found');
      }
      throw e;
    }
  }
}