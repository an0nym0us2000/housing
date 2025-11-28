import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';
export declare class TasksService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    create(userId: string, createTaskDto: CreateTaskDto): Promise<any>;
    findAll(userId: string, query: QueryTaskDto): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string, userId: string): Promise<any>;
    update(id: string, userId: string, updateTaskDto: UpdateTaskDto): Promise<any>;
    delete(id: string, userId: string): Promise<{
        message: string;
    }>;
    getMyTasks(userId: string, query: QueryTaskDto): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getTaskStats(userId: string): Promise<{
        todoTasks: any;
        inProgressTasks: any;
        completedTasks: any;
        overdueTasks: any;
    }>;
}
//# sourceMappingURL=tasks.service.d.ts.map