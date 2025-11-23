import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService
  ) {}

  async create(userId: string, createTaskDto: CreateTaskDto) {
    // Verify assignee exists and get their details
    const assignee = await this.prisma.user.findUnique({
      where: { id: createTaskDto.assignedToId },
      select: { id: true, name: true, email: true },
    });

    if (!assignee) {
      throw new NotFoundException('Assignee user not found');
    }

    const task = await this.prisma.task.create({
      data: {
        ...createTaskDto,
        dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : null,
        createdById: userId,
        status: 'TODO',
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Send task assigned notification (async, don't wait)
    this.notificationsService
      .sendTaskAssigned(task, task.assignedTo, task.createdBy)
      .catch((error) => console.error('Failed to send task assigned notification:', error));

    return task;
  }

  async findAll(userId: string, query: QueryTaskDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    // Users can see tasks assigned to them or created by them
    where.OR = [{ assignedToId: userId }, { createdById: userId }];

    if (query.status) {
      where.status = query.status;
    }

    if (query.priority) {
      where.priority = query.priority;
    }

    if (query.assignedToId) {
      where.assignedToId = query.assignedToId;
    }

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        include: {
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: [{ status: 'asc' }, { priority: 'desc' }, { dueDate: 'asc' }],
        skip,
        take: limit,
      }),
      this.prisma.task.count({ where }),
    ]);

    return {
      data: tasks,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string) {
    const task = await this.prisma.task.findFirst({
      where: {
        id,
        OR: [{ assignedToId: userId }, { createdById: userId }],
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found or access denied');
    }

    return task;
  }

  async update(id: string, userId: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.prisma.task.findFirst({
      where: {
        id,
        OR: [{ assignedToId: userId }, { createdById: userId }],
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found or access denied');
    }

    const data: any = { ...updateTaskDto };

    if (updateTaskDto.dueDate) {
      data.dueDate = new Date(updateTaskDto.dueDate);
    }

    if (updateTaskDto.status === 'COMPLETED') {
      data.completedAt = new Date();
    }

    const updated = await this.prisma.task.update({
      where: { id },
      data,
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return updated;
  }

  async delete(id: string, userId: string) {
    const task = await this.prisma.task.findFirst({
      where: {
        id,
        createdById: userId,
      },
    });

    if (!task) {
      throw new ForbiddenException('Only task creator can delete the task');
    }

    await this.prisma.task.delete({
      where: { id },
    });

    return { message: 'Task deleted successfully' };
  }

  async getMyTasks(userId: string, query: QueryTaskDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where: any = {
      assignedToId: userId,
    };

    if (query.status) {
      where.status = query.status;
    }

    if (query.priority) {
      where.priority = query.priority;
    }

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: [{ status: 'asc' }, { priority: 'desc' }, { dueDate: 'asc' }],
        skip,
        take: limit,
      }),
      this.prisma.task.count({ where }),
    ]);

    return {
      data: tasks,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getTaskStats(userId: string) {
    const [todoTasks, inProgressTasks, completedTasks, overdueTasks] = await Promise.all([
      this.prisma.task.count({
        where: {
          assignedToId: userId,
          status: 'TODO',
        },
      }),
      this.prisma.task.count({
        where: {
          assignedToId: userId,
          status: 'IN_PROGRESS',
        },
      }),
      this.prisma.task.count({
        where: {
          assignedToId: userId,
          status: 'COMPLETED',
        },
      }),
      this.prisma.task.count({
        where: {
          assignedToId: userId,
          status: {
            in: ['TODO', 'IN_PROGRESS'],
          },
          dueDate: {
            lt: new Date(),
          },
        },
      }),
    ]);

    return {
      todoTasks,
      inProgressTasks,
      completedTasks,
      overdueTasks,
    };
  }
}
