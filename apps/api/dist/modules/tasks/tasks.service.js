"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
let TasksService = class TasksService {
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async create(userId, createTaskDto) {
        const assignee = await this.prisma.user.findUnique({
            where: { id: createTaskDto.assignedToId },
            select: { id: true, name: true, email: true },
        });
        if (!assignee) {
            throw new common_1.NotFoundException('Assignee user not found');
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
        this.notificationsService
            .sendTaskAssigned(task, task.assignedTo, task.createdBy)
            .catch((error) => console.error('Failed to send task assigned notification:', error));
        return task;
    }
    async findAll(userId, query) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;
        const skip = (page - 1) * limit;
        const where = {};
        where.OR = [
            { assignedToId: userId },
            { createdById: userId },
        ];
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
                orderBy: [
                    { status: 'asc' },
                    { priority: 'desc' },
                    { dueDate: 'asc' },
                ],
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
    async findOne(id, userId) {
        const task = await this.prisma.task.findFirst({
            where: {
                id,
                OR: [
                    { assignedToId: userId },
                    { createdById: userId },
                ],
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
            throw new common_1.NotFoundException('Task not found or access denied');
        }
        return task;
    }
    async update(id, userId, updateTaskDto) {
        const task = await this.prisma.task.findFirst({
            where: {
                id,
                OR: [
                    { assignedToId: userId },
                    { createdById: userId },
                ],
            },
        });
        if (!task) {
            throw new common_1.NotFoundException('Task not found or access denied');
        }
        const data = { ...updateTaskDto };
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
    async delete(id, userId) {
        const task = await this.prisma.task.findFirst({
            where: {
                id,
                createdById: userId,
            },
        });
        if (!task) {
            throw new common_1.ForbiddenException('Only task creator can delete the task');
        }
        await this.prisma.task.delete({
            where: { id },
        });
        return { message: 'Task deleted successfully' };
    }
    async getMyTasks(userId, query) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;
        const skip = (page - 1) * limit;
        const where = {
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
                orderBy: [
                    { status: 'asc' },
                    { priority: 'desc' },
                    { dueDate: 'asc' },
                ],
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
    async getTaskStats(userId) {
        const [todoTasks, inProgressTasks, completedTasks, overdueTasks,] = await Promise.all([
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
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map