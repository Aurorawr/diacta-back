import { User } from 'src/app/models/user/user.model';

interface NoteType {
    _id: string;
    content: string;
}

interface DialogueElementType {
    _id: string;
    elementType: 'Duda' | 'Compromiso' | 'Acuerdo' | 'Desacuerdo';
    enum: number;
    content: string;
}

interface ParticipantType {
    _id: string;
    user: User;
    confirmedAssistance: boolean;
    assistance: boolean;
}

interface TopicType {
    _id: string;
    enum: number;
    name: string;
    description: string;
    dialogueElements: Array<DialogueElementType>;
    notes: Array<NoteType>;
}

interface annexType {
    _id: string;
    url: string;
    name: string;
    description?: string;
}

export interface Minute {
    _id: string;
    enum: number;
    header: string;
    description: string;
    participants: Array<ParticipantType>;
    previousCompromises: Array<DialogueElementType>;
    place: string;
    date: Date;
    startTime: string;
    endTime: string;
    nextReunionDate: Date;
    topics: Array<TopicType>;
    annexes: Array<annexType>;
    finished: boolean;
}
