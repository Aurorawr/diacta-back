export interface Task {
    _id: string;
    compromise: {
        _id: string;
        content: string;
        references: {
            minuteEnum: number;
            topicEnum: number;
        };
        enum: number;
    }
    state: 0 | 1 | 2 | 3 | 4;
    user?: TaskUser
    dueDate?: Date
}

export interface GroupedTasks {
    new: Task[];
    doing: Task[];
    paused: Task[];
    testing: Task[];
    ended: Task[];
}

export interface TaskUser {
    _id: string;
    name: string;
    lastname?: string;
}