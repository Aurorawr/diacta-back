import { Component, Input, Output, EventEmitter } from '@angular/core';

import { EditionParams, SwitchEditionParams } from 'src/app/models/edition-params.model';
import { EditionAttribute } from 'src/app/models/types.model';
import { Edition } from 'src/app/models/edition.model';

type InputType = 'input' | 'textarea'

@Component({
    selector: 'minute-collab-edition',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss']
})
export class MinuteCollabEditionComponent {
    @Input() value = '';
    @Input() type: EditionAttribute = 'topicName';
    @Input() attributeId: undefined | string = undefined;
    @Input() topicId: string | undefined = undefined;
    @Input() externalEditing: undefined | Edition = undefined;
    @Output() switchEdit = new EventEmitter<SwitchEditionParams>();
    @Output() onEdit = new EventEmitter<EditionParams>();

    editing = false

    switchEdition() {
        this.switchEdit.emit({attribute: this.type, attributeId: this.attributeId})
        this.editing = !this.editing
    }

    edit(event: KeyboardEvent) {
        this.onEdit.emit({topicId: this.topicId, elementId: this.attributeId, elementType: this.type ,event})
    }

    isExternalEditing(): boolean {
        return this.externalEditing != undefined;
    }

    getEditorName() {
        if (this.externalEditing) {
            return this.externalEditing.editorName
        }
        return ''
    }
}