import { AnimationBuilder } from '@angular/animations';
import {
    ChangeDetectorRef, Component, ContentChild, ElementRef, HostBinding, Inject, Input,
    OnInit, Output, ViewChild, EventEmitter, OnDestroy, HostListener
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ToggleAnimationPlayer, ToggleAnimationSettings } from '../../expansion-panel/toggle-animation-component';
import { IGX_STEPPER_COMPONENT, IStepTogglingEventArgs } from '../common';
import { IgxStepperComponent } from '../igx-stepper.component';
import { IgxStepContentDirective, IgxStepIconDirective, IgxStepLabelDirective } from '../igx-stepper.directive';
import { IgxStepperNavigationService } from '../stepper-navigation.service';
import { IgxStepperService } from '../stepper.service';

let NEXT_ID = 0;

@Component({
    selector: 'igx-step',
    templateUrl: 'igx-step.component.html',
})
export class IgxStepComponent extends ToggleAnimationPlayer implements OnInit, OnDestroy {
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
    public set active(value: boolean) {
        if (value) {
            this.navService.activeStep = this;
            this.stepper.activeNodeBindingChange.emit(this);
        }
    }

    public get active(): boolean {
        return this.navService.activeStep === this;
    }

    /**
     * Emitted when the node's `expanded` property changes.
     *
     * ```html
     * <igx-tree>
     *      <igx-tree-node *ngFor="let node of data" [data]="node" [(expanded)]="node.expanded">
     *      </igx-tree-node>
     * </igx-tree>
     * ```
     *
     * ```typescript
     * const node: IgxTreeNode<any> = this.tree.findNodes(data[0])[0];
     * node.expandedChange.pipe(takeUntil(this.destroy$)).subscribe((e: boolean) => console.log("Node expansion state changed to ", e))
     * ```
     */
    @Output()
    public expandedChange = new EventEmitter<boolean>();

    /** @hidden @internal */
    public get focused() {
        return this.isFocused &&
            this.navService.focusedStep === this;
    }

    /** @hidden @internal */
    public get animationSettings(): ToggleAnimationSettings {
        return this.stepper.animationSettings;
    }

    // /** @hidden @internal */
    // public get isCompact(): boolean {
    //     return this.stepper?.displayDensity === DisplayDensity.compact;
    // }

    // /** @hidden @internal */
    // public get isCosy(): boolean {
    //     return this.stepper?.displayDensity === DisplayDensity.cosy;
    // }

    @ContentChild(IgxStepIconDirective)
    public icon: IgxStepIconDirective;

    @ContentChild(IgxStepLabelDirective)
    public label: IgxStepLabelDirective;

    /**
     * @hidden
     * @internal
     */
    @ContentChild(IgxStepContentDirective)
    public contentDirective: IgxStepContentDirective;

    public get contentTemplate() {
        return this.contentDirective.templateRef;
    }

    @ViewChild('asd', { read: ElementRef })
    public contentContainer: ElementRef;


    public positionPercent: number;

    /** @hidden @internal */
    public isFocused: boolean;

    private _index = NEXT_ID - 1;
    private _active = false;
    private _tabIndex = null;

    constructor(@Inject(IGX_STEPPER_COMPONENT) public stepper: IgxStepperComponent,
        private cdr: ChangeDetectorRef, public navService: IgxStepperNavigationService,
        public stepperService: IgxStepperService, protected builder: AnimationBuilder,
        private element: ElementRef) {
        super(builder);
    }

    /** Get/set whether the node is expanded
     *
     * ```html
     * <igx-tree>
     *  ...
     *  <igx-tree-node *ngFor="let node of data" [expanded]="node.name === this.expandedNode">
     *      {{ node.label }}
     *  </igx-tree-node>
     * </igx-tree>
     * ```
     *
     * ```typescript
     * const node: IgxTreeNode<any> = this.tree.findNodes(data[0])[0];
     * const expanded = node.expanded;
     * node.expanded = true;
     * ```
     */
    @Input()
    public get expanded() {
        return this.navService.activeStep === this;
    }

    public set expanded(val: boolean) {
        if (val) {
            this.stepperService.expand(this, false);
        } else {
            this.stepperService.collapse(this);
        }
    }

    /**
     * The native DOM element representing the node. Could be null in certain environments.
     *
     * ```typescript
     * // get the nativeElement of the second node
     * const node: IgxTreeNode = this.tree.nodes.first();
     * const nodeElement: HTMLElement = node.nativeElement;
     * ```
     */
    public get nativeElement() {
        return this.element.nativeElement;
    }

    /**
     * @hidden @internal
     * Clear the node's focused state
     */
    @HostListener('click', ['$event'])
    public onClick(ev) {
        ev.preventDefault();
        if(this.expanded) {
            return;
        }
        this.expand();
        this.navService.setFocusedAndActiveStep(this);
    }


    /** @hidden @internal */
    public ngOnInit() {
        this.openAnimationDone.pipe(takeUntil(this.destroy$)).subscribe(
            () => {
                this.stepper.stepExpanded.emit({ step: this, owner: this.stepper });
            }
        );
        this.closeAnimationDone.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.stepper.stepCollapsed.emit({ step: this, owner: this.stepper });
            this.stepperService.collapse(this);
            this.cdr.markForCheck();
        });
    }

    // /**
    //  * @hidden @internal
    //  * Sets the focus to the node's <a> child, if present
    //  * Sets the node as the tree service's focusedNode
    //  * Marks the node as the current active element
    //  */
    //  public handleFocus(): void {
    //     if (this.disabled) {
    //         return;
    //     }
    //     if (this.navService.focusedNode !== this) {
    //         this.navService.focusedNode = this;
    //     }
    //     this.isFocused = true;
    //     if (this.linkChildren?.length) {
    //         this.linkChildren.first.nativeElement.focus();
    //         return;
    //     }
    //     if (this.registeredChildren.length) {
    //         this.registeredChildren[0].elementRef.nativeElement.focus();
    //         return;
    //     }
    // }

    // /**
    //  * @hidden @internal
    //  * Clear the node's focused status
    //  */
    //  public clearFocus(): void {
    //     this.isFocused = false;
    // }

    public ngOnDestroy() {
        super.ngOnDestroy();
    }

    /**
     * Expands the node, triggering animation
     *
     * ```html
     * <igx-tree>
     *      <igx-tree-node #node>My Node</igx-tree-node>
     * </igx-tree>
     * <button igxButton (click)="node.expand()">Expand Node</button>
     * ```
     *
     * ```typescript
     * const myNode: IgxTreeNode<any> = this.tree.findNodes(data[0])[0];
     * myNode.expand();
     * ```
     */
    public expand() {
        const args: IStepTogglingEventArgs = {
            step: this,
            owner: this.stepper,
            cancel: false
        };
        this.stepper.stepExpanding.emit(args);
        if (!args.cancel) {
            this.stepperService.expand(this, true);
            this.cdr.detectChanges();
            this.playOpenAnimation(
                this.contentContainer
            );
        }
    }

    /**
     * Collapses the node, triggering animation
     *
     * ```html
     * <igx-tree>
     *      <igx-tree-node #node>My Node</igx-tree-node>
     * </igx-tree>
     * <button igxButton (click)="node.collapse()">Collapse Node</button>
     * ```
     *
     * ```typescript
     * const myNode: IgxTreeNode<any> = this.tree.findNodes(data[0])[0];
     * myNode.collapse();
     * ```
     */
    public collapse() {
        const args: IStepTogglingEventArgs = {
            step: this,
            owner: this.stepper,
            cancel: false
        };

        this.stepper.stepCollapsing.emit(args);
        if (!args.cancel) {
            this.stepperService.collapsing(this);
            this.playCloseAnimation(
                this.navService.lastActiveStep.contentContainer
            );
        }
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
