import { User } from 'src/app/models/user.model';

export interface NoteType {
    _id: string;
    content: string;
}

export interface DialogueElementType {
    _id: string;
    elementType: 'Duda' | 'Compromiso' | 'Acuerdo' | 'Desacuerdo';
    enum: number;
    content: string;
    references?: CompromiseReferences
}

interface ParticipantType {
    _id?: string;
    user: User;
    confirmedAssistance: boolean;
    assistance: boolean;
}

export interface TopicType {
    _id: string;
    enum: number;
    name: string;
    description?: string;
    dialogueElements: Array<DialogueElementType>;
    notes: Array<NoteType>;
}

export interface AnnexType {
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
    annexes: Array<AnnexType>;
    phase: number;
}

interface CompromiseReferences {
    minuteEnum: number;
    topicEnum: number;
}
