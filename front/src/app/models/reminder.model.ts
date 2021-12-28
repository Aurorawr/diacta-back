export type Vias = 'Email' | 'SMS'

export interface When {
    minute?: number;
    hour: number;
    date?: number;
    month?: number;
    year?: number;
    dayOfWeek?: number;
}

export interface Reminder {
    event: 'Reunión' | 'Tareas' | 'Personalizado';
    when: When,
    vias: Vias[],
    message?: string
}