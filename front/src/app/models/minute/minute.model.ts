interface DialogueElementType {
    type: 'Duda' | 'Compromiso' | 'Acuerdo' | 'Desacuerdo' | 'Nota';
    enum?: number;
    content: string;
}

interface TopicType {
    enum: number;
    title: string;
    description: string;
    elements: Array<DialogueElementType>
}

interface annexType {
    url: string;
}

interface PreviousCompromisesType {
    minuteEnum: number;
    enum: number;
    content: string;
    minuteId: string;
}

export interface Minute {
    _id: string;
    enum: number;
    description: string;
    place: string;
    date: Date;
    startTime: string;
    endTime: string;
    nextReunionDate: Date;
    previousCompromises: Array<PreviousCompromisesType>;
    topics: Array<TopicType>;
    annexes: Array<annexType>
}

export const defaultMinute : Minute = {
    _id: '',
    enum: -1,
    description: '',
    place: '',
    date: new Date(),
    startTime: '',
    endTime: '',
    nextReunionDate: new Date(),
    previousCompromises: [],
    topics: [],
    annexes: []
}
