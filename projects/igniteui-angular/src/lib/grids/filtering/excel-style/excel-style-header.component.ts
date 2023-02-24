import { Component, Input } from '@angular/core';
import { BaseFilteringComponent } from './base-filtering.component';
import { IgxIconComponent } from '../../../icon/icon.component';
import { IgxButtonDirective } from '../../../directives/button/button.directive';
import { NgIf, NgClass } from '@angular/common';

/**
 * A component used for presenting Excel style header UI.
 */
@Component({
    selector: 'igx-excel-style-header',
    templateUrl: './excel-style-header.component.html',
    standalone: true,
    imports: [NgIf, IgxButtonDirective, NgClass, IgxIconComponent]
})
export class IgxExcelStyleHeaderComponent {
    /**
     * Sets whether the column pinning icon should be shown in the header.
     * Default value is `false`.
     *
     * @example
     * ```html
     * <igx-excel-style-header [showPinning]="true"></igx-excel-style-header>
     * ```
     */
    @Input()
    public showPinning: boolean;

    /**
     * Sets whether the column selecting icon should be shown in the header.
     * Default value is `false`.
     *
     * @example
     * ```html
     * <igx-excel-style-header [showSelecting]="true"></igx-excel-style-header>
     * ```
     */
    @Input()
    public showSelecting: boolean;

    /**
     * Sets whether the column hiding icon should be shown in the header.
     * Default value is `false`.
     *
     * @example
     * ```html
     * <igx-excel-style-header [showHiding]="true"></igx-excel-style-header>
     * ```
     */
    @Input()
    public showHiding: boolean;

    constructor(public esf: BaseFilteringComponent) { }
}
