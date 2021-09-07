import { animation } from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
    AfterContentInit, AfterViewInit, Component, ContentChildren, EventEmitter,
    HostBinding, Input, NgModule, OnDestroy, OnInit, Output, QueryList
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { growVerIn, growVerOut } from '../animations/grow';
import { slideInLeft } from '../animations/slide';
import { IgxCheckboxModule } from '../checkbox/checkbox.component';
import { IgxExpansionPanelModule } from '../expansion-panel/expansion-panel.module';
import { ToggleAnimationSettings } from '../expansion-panel/toggle-animation-component';
import { IgxIconModule } from '../icon/public_api';
import { IgxInputGroupModule } from '../input-group/input-group.component';
import { IgxProgressBarModule } from '../progressbar/progressbar.component';
import {
    IgxStepperLabelPosition, IgxStepperOrienatation,
    IgxStepType, IGX_STEPPER_COMPONENT, IStepToggledEventArgs, IStepTogglingEventArgs
} from './common';
import {
    IgxStepValidIconDirective, IgxStepInvalidIconDirective,
    IgxStepIconDirective, IgxStepLabelDirective, IgxStepContentDirective
} from './igx-stepper.directive';
import { IgxStepComponent } from './step/igx-step.component';
import { IgxStepperNavigationService } from './stepper-navigation.service';
import { IgxStepperService } from './stepper.service';

let NEXT_ID = 0;

@Component({
    selector: 'igx-stepper',
    templateUrl: 'igx-stepper.component.html',
    providers: [
        IgxStepperService,
        IgxStepperNavigationService,
        { provide: IGX_STEPPER_COMPONENT, useExisting: IgxStepperComponent },
    ]
})
export class IgxStepperComponent implements AfterViewInit, OnDestroy, OnInit {

    /**
     * Get/Set the `id` of the stepper component.
     * Default value is `"igx-stepper-0"`;
     * ```html
     * <igx-stepper id="my-first-stepper"></igx-stepper>
     * ```
     * ```typescript
     * const stepperId = this.stepper.id;
     * ```
     */
    @HostBinding('attr.id')
    @Input()
    public id = `igx-stepper-${NEXT_ID++}`;

    /** @hidden @internal **/
    @HostBinding('class.igx-stepper')
    public cssClass = 'igx-stepper';

    /**
     * Get/Set the animation settings.
     *
     * ```html
     * <igx-stepper [animationSettings]="customAnimationSettings"></igx-stepper>
     * ```
     */
    @Input()
    public animationSettings: ToggleAnimationSettings = {
        // openAnimation: animation(slideInLeft,
        //     {
        //         params: {
        //             delay: '0s',
        //             duration: '3000ms',
        //             endOpacity: 1,
        //             startOpacity: 1,
        //             fromPosition: 'translateX(100%)',
        //             toPosition: 'translateX(0%)'
        //         }
        //     }),
        // closeAnimation: animation(slideInLeft,
        //     {
        //         params: {
        //             delay: '0s',
        //             duration: '3000ms',
        //             endOpacity: 1,
        //             startOpacity: 1,
        //             fromPosition: 'translateX(0%)',
        //             toPosition: 'translateX(100%)'
        //         }
        //     }),
        openAnimation: growVerIn,
        closeAnimation: growVerOut
    };

    /** Emitted when a node is expanding, before it finishes
     *
     * ```html
     * <igx-tree (nodeExpanding)="handleNodeExpanding($event)">
     * </igx-tree>
     * ```
     *
     *```typescript
     * public handleNodeExpanding(event: ITreeNodeTogglingEventArgs) {
     *  const expandedNode: IgxTreeNode<any> = event.node;
     *  if (expandedNode.disabled) {
     *      event.cancel = true;
     *  }
     * }
     *```
     */
    @Output()
    public stepExpanding = new EventEmitter<IStepTogglingEventArgs>();

    /** Emitted when a node is expanded, after it finishes
     *
     * ```html
     * <igx-tree (nodeExpanded)="handleNodeExpanded($event)">
     * </igx-tree>
     * ```
     *
     *```typescript
     * public handleNodeExpanded(event: ITreeNodeToggledEventArgs) {
     *  const expandedNode: IgxTreeNode<any> = event.node;
     *  console.log("Node is expanded: ", expandedNode.data);
     * }
     *```
     */
    @Output()
    public stepExpanded = new EventEmitter<IStepToggledEventArgs>();

    /** Emitted when a node is collapsing, before it finishes
     *
     * ```html
     * <igx-tree (nodeCollapsing)="handleNodeCollapsing($event)">
     * </igx-tree>
     * ```
     *
     *```typescript
     * public handleNodeCollapsing(event: ITreeNodeTogglingEventArgs) {
     *  const collapsedNode: IgxTreeNode<any> = event.node;
     *  if (collapsedNode.alwaysOpen) {
     *      event.cancel = true;
     *  }
     * }
     *```
     */
    @Output()
    public stepCollapsing = new EventEmitter<IStepTogglingEventArgs>();

    /** Emitted when a node is collapsed, after it finishes
     *
     * @example
     * ```html
     * <igx-tree (nodeCollapsed)="handleNodeCollapsed($event)">
     * </igx-tree>
     * ```
     * ```typescript
     * public handleNodeCollapsed(event: ITreeNodeToggledEventArgs) {
     *  const collapsedNode: IgxTreeNode<any> = event.node;
     *  console.log("Node is collapsed: ", collapsedNode.data);
     * }
     * ```
     */
    @Output()
    public stepCollapsed = new EventEmitter<IStepToggledEventArgs>();

    /**
     * Emitted when the active node is changed.
     *
     * @example
     * ```
     * <igx-tree (activeNodeChanged)="activeNodeChanged($event)"></igx-tree>
     * ```
     */
    @Output()
    public activeStepChanged = new EventEmitter<IgxStepComponent>();

    /** @hidden @internal */
    @ContentChildren(IgxStepComponent, { descendants: false })
    private _steps: QueryList<IgxStepComponent>;

    /** @hidden @internal */
    public disabledChange = new EventEmitter<IgxStepComponent>();

    /**
     * Emitted when the active node is set through API
     *
     * @hidden @internal
     */
    public activeNodeBindingChange = new EventEmitter<IgxStepComponent>();

    private destroy$ = new Subject<void>();
    private unsubChildren$ = new Subject<void>();
    private _orientation = IgxStepperOrienatation.Horizontal;

    constructor(public navService: IgxStepperNavigationService, public stepperService: IgxStepperService) {
        this.navService.register(this);
        this.stepperService.register(this);
     }


    /** @hidden @internal */
    public ngOnInit() {
        // super.ngOnInit();

        // this.disabledChange.pipe(takeUntil(this.destroy$)).subscribe((e) => {
        //     this.navService.update_disabled_cache(e);
        // });

        // this.activeNodeBindingChange.pipe(takeUntil(this.destroy$)).subscribe((node) => {
        //     this.expandToNode(this.navService.activeNode);
        //     this.scrollNodeIntoView(node?.header?.nativeElement);
        // });

        // this.onDensityChanged.pipe(takeUntil(this.destroy$)).subscribe(() => {
        //     requestAnimationFrame(() => {
        //         this.scrollNodeIntoView(this.navService.activeNode?.header.nativeElement);
        //     });
        // });

        this.subToCollapsing();
    }

    /** @hidden @internal */
    public ngAfterViewInit() {
        this._steps.changes.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.subToChanges();
        });
        // this.scrollNodeIntoView(this.navService.activeNode?.header?.nativeElement);
        this.subToChanges();
    }

    /** @hidden @internal */
    public ngOnDestroy() {
        this.unsubChildren$.next();
        this.unsubChildren$.complete();
        this.destroy$.next();
        this.destroy$.complete();
    }

    public getOrientationDisplay() {
        if (this._orientation === IgxStepperOrienatation.Horizontal) {
            return 'flex';
        } else {
            return 'block';
        }
    }
    // private expandToNode(node: IgxTreeNode<any>) {
    //     if (node && node.parentNode) {
    //         node.path.forEach(n => {
    //             if (n !== node && !n.expanded) {
    //                 n.expanded = true;
    //             }
    //         });
    //     }
    // }

    private subToCollapsing() {
        this.stepCollapsing.pipe(takeUntil(this.destroy$)).subscribe(event => {
            if (event.cancel) {
                return;
            }
            this.navService.update_visible_cache(event.step, false);
        });
        this.stepExpanding.pipe(takeUntil(this.destroy$)).subscribe(event => {
            if (event.cancel) {
                return;
            }
            this.navService.update_visible_cache(event.step, true);
        });
    }

    private subToChanges() {
        this.unsubChildren$.next();

        this.steps.forEach(step => {
            step.expandedChange.pipe(takeUntil(this.unsubChildren$)).subscribe(stepState => {
                this.navService.update_visible_cache(step, stepState);
            });

            step.closeAnimationDone.pipe(takeUntil(this.unsubChildren$)).subscribe(() => {
                // const targetElement = this.navService.focusedStep?.header.nativeElement;
                // this.scrollNodeIntoView(targetElement);
            });

            step.openAnimationDone.pipe(takeUntil(this.unsubChildren$)).subscribe(() => {
                // const targetElement = this.navService.focusedStep?.header.nativeElement;
                // this.scrollNodeIntoView(targetElement);
            });

        });
        // this.navService.init_invisible_cache();
    }

    /**
     * Get all steps.
     *
     * ```typescript
     * const steps: IgxStepComponent[] = this.stepper.steps;
     * ```
     */
    public get steps(): IgxStepComponent[] {
        return this._steps?.toArray();
    }

    /**
     * Get/Set the stepper orientation.
     *
     * ```typescript
     * this.stepper.orientation = IgxStepperOrienatation.Vertical;
     * ```
     */
    @Input()
    public get orientation(): IgxStepperOrienatation | string {
        return this._orientation;
    }

    public set orientation(value: IgxStepperOrienatation | string) {
        if (this._orientation !== value) {
            this._orientation = value;
        }
    }










    // private _stepType = IgxStepType.Full;
    // private _labelPosition = IgxStepperLabelPosition.Bottom;

    //  /**
    //   * Get/Set the position of the steps label.
    //   *
    //   * ```typescript
    //   * this.stepper.labelPosition = IgxStepperLabelPosition.Top;
    //   * ```
    //   */
    //  @Input()
    //  public get labelPosition(): IgxStepperLabelPosition {
    //      return this._labelPosition;
    //  }

    //  public set labelPosition(value: IgxStepperLabelPosition) {
    //      if (value !== this._labelPosition) {
    //          this._labelPosition = value;
    //          this._steps?.forEach(step => step.label.position = this.labelPosition);
    //      }
    //  }

    //  /**
    //   * Get/Set whether the stepper is linear.
    //   * Only if the active step is valid the user is able to move forward.
    //   *
    //   * ```html
    //   * <igx-stepper [linear]="true"></igx-stepper>
    //   * ```
    //   */
    //  @Input()
    //  public linear = false;

    // public navigateTo(index: number) {
    //     const step = this._steps.filter(s => s.index === index)[0];
    //     if (!step || step.disabled) {
    //         return;
    //     }

    //     if (!this._activeStep) {
    //         step.active = true;
    //     }

    //     if (this._activeStep && this._activeStep.index !== index) {
    //         this._activeStep.active = false;
    //         step.active = true;
    //     }
    // }

    // private getNextStep() {
    //     if (this._activeStep) {
    //         return this._activeStep.index === this.steps.length - 1 ? this._activeStep :
    //             this._steps.find(s => s.index > this._activeStep.index && !s.disabled && !s.skip);
    //     }
    // }

    // private getPrevStep() {
    //     if (this._activeStep) {
    //         return this._activeStep.index === 0 ? this._activeStep :
    //             this._steps.find(s => s.index < this._activeStep.index && !s.disabled && !s.skip);
    //     }
    // }

    // /**
    //  * Get/Set the type of the steps.
    //  *
    //  * ```typescript
    //  * this.stepper.stepType = IgxStepType.Indicator;
    //  * ```
    //  */
    //  @Input()
    //  public get stepType(): IgxStepType {
    //      return this._stepType;
    //  }

    //  public set stepType(value: IgxStepType) {
    //      if (value !== this._stepType) {
    //          this._stepType = value;
    //          this._steps?.forEach(step => {
    //              step.isLabelVisible = !(this._stepType === IgxStepType.Indicator);
    //              step.isIndicatorVisible = !(this._stepType === IgxStepType.Label);
    //          });
    //      }
    //  }
}

// /**
//  * @hidden @internal
//  * Used for templating the select marker of the tree
//  */
// @Directive({
//     selector: '[igxTreeSelectMarker]'
// })
// export class IgxTreeSelectMarkerDirective {
// }

// /**
//  * @hidden @internal
//  * Used for templating the expand indicator of the tree
//  */
// @Directive({
//     selector: '[igxTreeExpandIndicator]'
// })
// export class IgxTreeExpandIndicatorDirective {
// }


// export class IgxTreeComponents {





// private scrollNodeIntoView(el: HTMLElement) {
//     if (!el) {
//         return;
//     }
//     const nodeRect = el.getBoundingClientRect();
//     const treeRect = this.nativeElement.getBoundingClientRect();
//     const topOffset = treeRect.top > nodeRect.top ? nodeRect.top - treeRect.top : 0;
//     const bottomOffset = treeRect.bottom < nodeRect.bottom ? nodeRect.bottom - treeRect.bottom : 0;
//     const shouldScroll = !!topOffset || !!bottomOffset;
//     if (shouldScroll && this.nativeElement.scrollHeight > this.nativeElement.clientHeight) {
//         // this.nativeElement.scrollTop = nodeRect.y - treeRect.y - nodeRect.height;
//         this.nativeElement.scrollTop =
//             this.nativeElement.scrollTop + bottomOffset + topOffset + (topOffset ? -1 : +1) * nodeRect.height;
//     }
// }

// private _comparer = <T>(data: T, node: IgxTreeNodeComponent<T>) => node.data === data;

// }

/**
 * @hidden
 *
 * NgModule defining the components and directives needed for `igx-tree`
 */
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IgxIconModule,
        IgxInputGroupModule,
        IgxCheckboxModule,
        IgxProgressBarModule,
        IgxExpansionPanelModule
    ],
    declarations: [
        IgxStepComponent,
        IgxStepperComponent,
        IgxStepLabelDirective,
        IgxStepIconDirective,
        IgxStepContentDirective,
        IgxStepValidIconDirective,
        IgxStepInvalidIconDirective,
    ],
    exports: [
        IgxStepComponent,
        IgxStepperComponent,
        IgxStepLabelDirective,
        IgxStepContentDirective,
        IgxStepIconDirective,
        IgxStepValidIconDirective,
        IgxStepInvalidIconDirective,
        IgxExpansionPanelModule
    ]
})
export class IgxStepperModule { }
