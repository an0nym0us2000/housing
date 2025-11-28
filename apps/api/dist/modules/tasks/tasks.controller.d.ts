import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    create(req: any, createTaskDto: CreateTaskDto): Promise<any>;
    findAll(req: any, query: QueryTaskDto): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getMyTasks(req: any, query: QueryTaskDto): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getTaskStats(req: any): Promise<{
        todoTasks: any;
        inProgressTasks: any;
        completedTasks: any;
        overdueTasks: any;
    }>;
    findOne(id: string, req: any): Promise<any>;
    update(id: string, req: any, updateTaskDto: UpdateTaskDto): Promise<any>;
    delete(id: string, req: any): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=tasks.controller.d.ts.map