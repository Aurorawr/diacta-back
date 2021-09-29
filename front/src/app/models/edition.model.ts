export interface Edition {
    editing: boolean;
    editorId: string;
    editorName: string;
    topicId?: string;
  }
  
  export interface Editions {
    header: Edition;
    description: Edition;
    topicName: {
      [key: string] : Edition
    };
    topicDescription: {
      [key: string] : Edition
    };
    dialogueElements: {
      [key: string] : Edition
    };
    notes: {
      [key: string] : Edition
    };
    annexes: {
      [key: string]: Edition
    };
    addingTopic: Edition[];
    addingAnnexes: Edition[];
    addingNotes: Edition[];
    addingDialogueElements: Edition[];
  }