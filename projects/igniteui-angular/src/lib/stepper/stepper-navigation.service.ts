import { Injectable, OnDestroy } from '@angular/core';
import { NAVIGATION_KEYS } from '../core/utils';
import { Subject } from 'rxjs';
import { IgxStepperComponent } from './igx-stepper.component';
import { IgxStepComponent } from './step/igx-step.component';
import { IgxStepperService } from './stepper.service';

/** @hidden @internal */
@Injectable()
export class IgxStepperNavigationService implements OnDestroy {
    private stepper: IgxStepperComponent;

    private _focusedStep: IgxStepComponent = null;
    private _lastFocusedStep: IgxStepComponent = null;
    private _activeStep: IgxStepComponent = null;
    private _lastActiveStep: IgxStepComponent = null;

    private _visibleChildren: IgxStepComponent[] = [];
    // private _invisibleChildren: Set<IgxStepComponent> = new Set();
    // private _disabledChildren: Set<IgxStepComponent> = new Set();

    private _cacheChange = new Subject<void>();

    constructor() {
        this._cacheChange.subscribe(() => {
            // this._visibleChildren =
            //     this.stepper?.steps ?
            //         this.stepper.steps.filter(e => !(this._invisibleChildren.has(e) || this._disabledChildren.has(e))) :
            //         [];
            this._visibleChildren = this.stepper?.steps;
        });
    }

    public register(stepper: IgxStepperComponent) {
        this.stepper = stepper;
    }

    public get focusedStep() {
        return this._focusedStep;
    }

    public set focusedStep(value: IgxStepComponent) {
        if (this._focusedStep === value) {
            return;
        }
        this._lastFocusedStep = this._focusedStep;
        if (this._lastFocusedStep) {
            // this._lastFocusedStep.tabIndex = -1;
        }
        this._focusedStep = value;
        if (this._focusedStep !== null) {
            // this._focusedStep.tabIndex = 0;
            // this._focusedStep.header.nativeElement.focus();
        }
    }

    public get activeStep() {
        return this._activeStep;
    }

    public set activeStep(value: IgxStepComponent) {
        if (this._activeStep === value) {
            return;
        }
        this._lastActiveStep = this._activeStep;
        this._activeStep = value;
        this.stepper.activeStepChanged.emit(this._activeStep);
    }

    public get lastActiveStep() {
        return this._lastActiveStep;
    }

    public get visibleChildren(): IgxStepComponent[] {
        return this._visibleChildren;
    }

    // public update_disabled_cache(step: IgxStepComponent): void {
    //     if (step.disabled) {
    //         this._disabledChildren.add(step);
    //     } else {
    //         this._disabledChildren.delete(step);
    //     }
    //     this._cacheChange.next();
    // }

    // public init_invisible_cache() {
    //     this.stepper.steps.filter(e => e.level === 0).forEach(step => {
    //         this.update_visible_cache(step, step.expanded, false);
    //     });
    //     this._cacheChange.next();
    // }

    public update_visible_cache(step: IgxStepComponent, expanded: boolean, shouldEmit = true): void {
        // if (expanded) {
        //     step._children.forEach(child => {
        //         this._invisibleChildren.delete(child);
        //         this.update_visible_cache(child, child.expanded, false);
        //     });
        // } else {
        //     step.allChildren.forEach(c => this._invisibleChildren.add(c));
        // }

        if (shouldEmit) {
            this._cacheChange.next();
        }
    }

    /**
     * Sets the step as focused (and active)
     *
     * @param step target step
     * @param isActive if true, sets the step as active
     */
    public setFocusedAndActiveStep(step: IgxStepComponent, isActive: boolean = true): void {
        if (isActive) {
            this.activeStep = step;
        }
        this.focusedStep = step;
    }

    /** Handler for keydown events. Used in stepper.component.ts */
    // public handleKeydown(event: KeyboardEvent) {
    //     const key = event.key.toLowerCase();
    //     if (!this.focusedNode) {
    //         return;
    //     }
    //     if (!(NAVIGATION_KEYS.has(key) || key === '*')) {
    //         if (key === 'enter') {
    //             this.activeStep = this.focusedNode;
    //         }
    //         return;
    //     }
    //     event.preventDefault();
    //     if (event.repeat) {
    //         setTimeout(() => this.handleNavigation(event), 1);
    //     } else {
    //         this.handleNavigation(event);
    //     }
    // }

    public ngOnDestroy() {
        this._cacheChange.next();
        this._cacheChange.complete();
    }

    // private handleNavigation(event: KeyboardEvent) {
    //     switch (event.key.toLowerCase()) {
    //         case 'home':
    //             this.setFocusedAndActiveStep(this.visibleChildren[0]);
    //             break;
    //         case 'end':
    //             this.setFocusedAndActiveStep(this.visibleChildren[this.visibleChildren.length - 1]);
    //             break;
    //         case 'arrowleft':
    //         case 'left':
    //             this.handleArrowLeft();
    //             break;
    //         case 'arrowright':
    //         case 'right':
    //             this.handleArrowRight();
    //             break;
    //         case 'arrowup':
    //         case 'up':
    //             this.handleUpDownArrow(true, event);
    //             break;
    //         case 'arrowdown':
    //         case 'down':
    //             this.handleUpDownArrow(false, event);
    //             break;
    //         case '*':
    //             this.handleAsterisk();
    //             break;
    //         case ' ':
    //         case 'spacebar':
    //         case 'space':
    //             this.handleSpace(event.shiftKey);
    //             break;
    //         default:
    //             return;
    //     }
    // }

    // private handleArrowLeft(): void {
    //     if (this.focusedNode.expanded && !this.treeService.collapsingNodes.has(this.focusedNode) && this.focusedNode._children?.length) {
    //         this.activeStep = this.focusedNode;
    //         this.focusedNode.collapse();
    //     } else {
    //         const parentNode = this.focusedNode.parentNode;
    //         if (parentNode && !parentNode.disabled) {
    //             this.setFocusedAndActiveStep(parentNode);
    //         }
    //     }
    // }

    // private handleArrowRight(): void {
    //     if (this.focusedNode._children.length > 0) {
    //         if (!this.focusedNode.expanded) {
    //             this.activeStep = this.focusedNode;
    //             this.focusedNode.expand();
    //         } else {
    //             if (this.treeService.collapsingNodes.has(this.focusedNode)) {
    //                 this.focusedNode.expand();
    //                 return;
    //             }
    //             const firstChild = this.focusedNode._children.find(step => !step.disabled);
    //             if (firstChild) {
    //                 this.setFocusedAndActiveStep(firstChild);
    //             }
    //         }
    //     }
    // }

    // private handleUpDownArrow(isUp: boolean, event: KeyboardEvent): void {
    //     const next = this.getVisibleNode(this.focusedNode, isUp ? -1 : 1);
    //     if (next === this.focusedNode) {
    //         return;
    //     }

    //     if (event.ctrlKey) {
    //         this.setFocusedAndActiveStep(next, false);
    //     } else {
    //         this.setFocusedAndActiveStep(next);
    //     }
    // }

    // private handleAsterisk(): void {
    //     const steps = this.focusedNode.parentNode ? this.focusedNode.parentNode._children : this.stepper.rootNodes;
    //     steps?.forEach(step => {
    //         if (!step.disabled && (!step.expanded || this.treeService.collapsingNodes.has(step))) {
    //             step.expand();
    //         }
    //     });
    // }

    // private handleSpace(shiftKey = false): void {
    //     if (this.stepper.selection === IgxTreeSelectionType.None) {
    //         return;
    //     }

    //     this.activeStep = this.focusedNode;
    //     if (shiftKey) {
    //         this.selectionService.selectMultipleNodes(this.focusedNode);
    //         return;
    //     }

    //     if (this.focusedNode.selected) {
    //         this.selectionService.deselectNode(this.focusedNode);
    //     } else {
    //         this.selectionService.selectNode(this.focusedNode);
    //     }
    // }

    /** Gets the next visible step in the given direction - 1 -> next, -1 -> previous */
    private getVisibleStep(step: IgxStepComponent, dir: 1 | -1 = 1): IgxStepComponent {
        const stepIndex = this.visibleChildren.indexOf(step);
        return this.visibleChildren[stepIndex + dir] || step;
    }
}
