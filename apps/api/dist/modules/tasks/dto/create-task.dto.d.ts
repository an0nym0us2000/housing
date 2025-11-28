export declare enum TaskPriority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    URGENT = "URGENT"
}
export declare class CreateTaskDto {
    title: string;
    description?: string;
    assignedToId: string;
    priority?: TaskPriority;
    dueDate?: string;
    leadId?: string;
    listingId?: string;
}
//# sourceMappingURL=create-task.dto.d.ts.map