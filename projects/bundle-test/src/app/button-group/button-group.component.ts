import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IGX_BUTTON_GROUP_DIRECTIVES } from 'igniteui-angular';

@Component({
    selector: 'app-button-group',
    standalone: true,
    imports: [
        IGX_BUTTON_GROUP_DIRECTIVES
    ],
    templateUrl: './button-group.component.html',
    styleUrl: './button-group.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonGroupComponent { }
