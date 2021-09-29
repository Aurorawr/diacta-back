import { EditionAttribute } from "./types.model";

export interface EditionParams {
    topicId?: string | undefined;
    elementId?: string | undefined;
    event: KeyboardEvent;
    elementType: EditionAttribute;
}

export interface SwitchEditionParams {
    attribute: string;
    attributeId?: string;
}