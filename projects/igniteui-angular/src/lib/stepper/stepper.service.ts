import { Injectable } from '@angular/core';
import { IgxStepperComponent } from './igx-stepper.component';
import { IgxStepComponent } from './step/igx-step.component';

/** @hidden @internal */
@Injectable()
export class IgxStepperService {
    public expandedSteps: Set<IgxStepComponent> = new Set<IgxStepComponent>();
    public collapsingSteps: Set<IgxStepComponent> = new Set<IgxStepComponent>();
    private stepper: IgxStepperComponent;

    /**
     * Adds the step to the `expandedSteps` set and fires the nodes change event
     *
     * @param step target step
     * @param uiTrigger is the event triggered by a ui interraction (so we know if we should animate)
     * @returns void
     */
    public expand(step: IgxStepComponent, uiTrigger?: boolean): void {
        this.collapsingSteps.delete(step);
        if (!this.expandedSteps.has(step)) {
            step.expandedChange.emit(true);
        } else {
            return;
        }
        this.expandedSteps.add(step);
        // if (this.stepper.singleBranchExpand) {
        //     this.stepper.findNodes(step, this.siblingComparer)?.forEach(e => {
        //         if (uiTrigger) {
        //             e.collapse();
        //         } else {
        //             e.expanded = false;
        //         }
        //     });
        // }
    }

    /**
     * Adds a step to the `collapsing` collection
     *
     * @param step target step
     */
    public collapsing(step: IgxStepComponent): void {
        this.collapsingSteps.add(step);
    }

    /**
     * Removes the step from the 'expandedSteps' set and emits the step's change event
     *
     * @param step target step
     * @returns void
     */
    public collapse(step: IgxStepComponent): void {
        if (this.expandedSteps.has(step)) {
            step.expandedChange.emit(false);
        }
        this.collapsingSteps.delete(step);
        this.expandedSteps.delete(step);
    }

    public isExpanded(step: IgxStepComponent): boolean {
        return this.expandedSteps.has(step);
    }

    public register(stepper: IgxStepperComponent) {
        this.stepper = stepper;
    }

    // private siblingComparer:
    // (data: IgxStepComponent, step: IgxStepComponent) => boolean =
    // (data: IgxStepComponent, step: IgxStepComponent) => step !== data && step.level === data.level;
}
