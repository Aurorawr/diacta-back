
export interface Topic {
    enum: number;
    name: string;
    description: string;
}

export interface Annex {
    url: string;
    name: string;
    description?: string;
}

export interface Preminute {
    enum: number;
    header: string;
    description: string;
    place: string;
    date: Date;
    topics: Array<Topic>;
    annexes: Array<Annex>;
}
