import { AnimationBuilder } from '@angular/animations';
import {
    ChangeDetectorRef, Component, ContentChild, ElementRef, HostBinding, Inject, Input, OnInit, ViewChild
} from '@angular/core';
import { ToggleAnimationPlayer, ToggleAnimationSettings } from '../../expansion-panel/toggle-animation-component';
import { IGX_STEPPER_COMPONENT } from '../common';
import { IgxStepperComponent } from '../igx-stepper.component';
import { IgxStepContentDirective, IgxStepIconDirective, IgxStepLabelDirective } from '../igx-stepper.directive';

let NEXT_ID = 0;

@Component({
    selector: 'igx-step',
    templateUrl: 'igx-step.component.html',
})
export class IgxStepComponent extends ToggleAnimationPlayer implements OnInit {
    /**
     * Get/Set the `id` of the step component.
     * Default value is `"igx-step-0"`;
     * ```html
     * <igx-step id="my-first-step"></igx-step>
     * ```
     * ```typescript
     * const stepId = this.step.id;
     * ```
     */
    @HostBinding('attr.id')
    @Input()
    public id = `igx-step-${NEXT_ID++}`;

    /** @hidden @internal **/
    @HostBinding('class.igx-step')
    public cssClass = 'igx-step';

    /**
     * Get the step index inside of the stepper.
     *
     * ```typescript
     * const step = this.stepper.steps[1];
     * const stepIndex: number = step.index;
     * ```
     */
    @Input()
    public get index(): number {
        return this._index;
    }

    /**
     * Get/Set whether the step is activated.
     *
     * ```html
     * <igx-stepper>
     * ...
     *     <igx-step [active]="true"></igx-step>
     * ...
     * </igx-stepper>
     * ```
     *
     * ```typescript
     * this.stepper.steps[1].active = true;
     * ```
     */
    @Input()
    @HostBinding('class.igx-step--active')
    public get active(): boolean {
        return this._active;
    }

    public set active(value: boolean) {
        if (this._active !== value) {
            this._active = value;
            // this.activeChanged.emit(this._active);
        }
    }

    /** @hidden @internal */
    public get animationSettings(): ToggleAnimationSettings {
        return this.stepper.animationSettings;
    }

    @ContentChild(IgxStepIconDirective)
    public icon: IgxStepIconDirective;

    @ContentChild(IgxStepLabelDirective)
    public label: IgxStepLabelDirective;

    /**
     * @hidden
     * @internal
     */
    @ContentChild(IgxStepContentDirective)
    public content: IgxStepContentDirective;

    @ViewChild('asd', { read: ElementRef })
    public contentContainer: ElementRef;

    public get contentTempl() {
        return this.content.templateRef;
    }

    public positionPercent: number;

    private _index = NEXT_ID - 1;
    private _active = false;

    constructor(@Inject(IGX_STEPPER_COMPONENT) public stepper: IgxStepperComponent, protected builder: AnimationBuilder,
        private cdr: ChangeDetectorRef) {
        super(builder);
    }

    public ngOnInit() {

    }









    // /**
    //  * Get/Set whether the step should be skipped. It could be activated on click.
    //  *
    //  * ```html
    //  * <igx-stepper>
    //  * ...
    //  *     <igx-step [skip]="true"></igx-step>
    //  * ...
    //  * </igx-stepper>
    //  * ```
    //  *
    //  * ```typescript
    //  * this.stepper.steps[1].skip = true;
    //  * ```
    //  */
    // @Input()
    // public skip = false;

    // /**
    //  * Get/Set whether the step is interactable.
    //  *
    //  * ```html
    //  * <igx-stepper>
    //  * ...
    //  *     <igx-step [disabled]="true"></igx-step>
    //  * ...
    //  * </igx-stepper>
    //  * ```
    //  *
    //  * ```typescript
    //  * this.stepper.steps[1].disabled = true;
    //  * ```
    //  */
    // @Input()
    // @HostBinding('class.igx-step--disabled')
    // public disabled = false;

    // /**
    //  * Get/Set whether the step is optional.
    //  *
    //  * ```html
    //  * <igx-stepper>
    //  * ...
    //  *     <igx-step [optional]="true"></igx-step>
    //  * ...
    //  * </igx-stepper>
    //  * ```
    //  *
    //  * ```typescript
    //  * this.stepper.steps[1].optional = true;
    //  * ```
    //  */
    // @Input()
    // public get optional(): boolean {
    //     return this._optional;
    // };

    // public set optonal(value: boolean) {
    //     if (!this.disabled) {
    //         this._optional = value;
    //     }
    // }

    // @Input()
    // @HostBinding('class.igx-step--complete')
    // public complete = false;

    // /**
    //  * Get/Set whether the step is valid.
    //  *
    //  */
    // @Input()
    // public isValid = true;

    // /** @hidden */
    // @HostBinding('class.igx-step--invalid')
    // public get invalidClass(): boolean {
    //     return !this.isValid;
    // }


    // /**
    //  * Get/Set whether the step the progress indicator type.
    //  *
    //  * ```typescript
    //  * this.stepper.steps[1].completedStyle = IgxStepperProgressLine.Dashed;
    //  * ```
    //  */
    // @Input()
    // public completedStyle = IgxStepperProgressLine.Solid;

    // /** @hidden @internal */
    // @HostBinding('class.igx-step--solid')
    // public get solidClass() {
    //     return this.complete && this.completedStyle === IgxStepperProgressLine.Solid;
    // }

    // /** @hidden @internal */
    // @HostBinding('class.igx-step--dashed')
    // public get dashedClass() {
    //     return this.complete && this.completedStyle === IgxStepperProgressLine.Dashed;
    // }

    // private get accessible() {
    //     return (this.stepper.linear && this.stepper._activeStep?.isValid) || !this.disabled;
    // }

    // /** @hidden @internal */
    // public isLabelVisible = true;
    // /** @hidden @internal */
    // public isIndicatorVisible = true;
    // /** @hidden @internal */
    // public isHorizontal = true;

    // private _optional = false;


    // @HostListener('click')
    // public onClick() {
    //     if (!this.accessible) {
    //         return;
    //     }
    //     const evArgs: IStepperCancelableEventArgs = {
    //         oldIndex: this.stepper._activeStep?.index,
    //         newIndex: this.index,
    //         owner: this.stepper,
    //         cancel: false
    //     };
    //     this.stepper.activeStepChanging.emit(evArgs);

    //     if (!evArgs.cancel) {
    //         this.active = true;
    //         this.cdr.detectChanges();
    //         if (!this.isHorizontal) {
    //             // this.playOpenAnimation(
    //             //     this.contentContainer
    //             // );

    //             this.playOpenAnimation(this.contentContainer);
    //             this.stepper._previousActiveStep?.playCloseAnimation(this.stepper._previousActiveStep.contentContainer);
    //         }
    //     }
    // }
}
