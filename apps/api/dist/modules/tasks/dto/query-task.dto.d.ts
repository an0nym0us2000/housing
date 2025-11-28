export declare enum TaskStatus {
    TODO = "TODO",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}
export declare enum TaskPriority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    URGENT = "URGENT"
}
export declare class QueryTaskDto {
    status?: TaskStatus;
    priority?: TaskPriority;
    assignedToId?: string;
    page?: number;
    limit?: number;
}
//# sourceMappingURL=query-task.dto.d.ts.map