interface CompromiseReferences {
    minuteEnum: number;
    topicEnum: number;
}

export interface Compromise {
    _id: string;
    content: string;
    enum: number;
    references: CompromiseReferences;
}