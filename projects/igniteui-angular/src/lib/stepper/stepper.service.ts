import { Injectable } from '@angular/core';
import { IgxStepperComponent } from './igx-stepper.component';
import { IgxStepComponent } from './step/igx-step.component';
import { IgxStepperNavigationService } from './stepper-navigation.service';

/** @hidden @internal */
@Injectable()
export class IgxStepperService {
    // public expandedSteps: Set<IgxStepComponent> = new Set<IgxStepComponent>();
    public collapsingSteps: Set<IgxStepComponent> = new Set<IgxStepComponent>();
    private stepper: IgxStepperComponent;

    constructor(public navService: IgxStepperNavigationService) {}

    /**
     * Adds the step to the `expandedSteps` set and fires the nodes change event
     *
     * @param step target step
     * @param uiTrigger is the event triggered by a ui interraction (so we know if we should animate)
     * @returns void
     */
    public expand(step: IgxStepComponent, uiTrigger?: boolean): void {
        this.collapsingSteps.delete(step);
        if (this.navService.activeStep !== step) {
            step.expandedChange.emit(true);
            this.navService.activeStep = step;
            const lastActiveStep = this.navService.lastActiveStep;
            if(!lastActiveStep) {
                return;
            }
            if (uiTrigger) {
                this.navService.lastActiveStep?.collapse();
            } else {
                this.navService.lastActiveStep.expanded = false;
            }

        } else {
            return;
        }
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
        if (this.navService.activeStep === step) {
            step.expandedChange.emit(false);
        }
        this.collapsingSteps.delete(step);
    }

    public register(stepper: IgxStepperComponent) {
        this.stepper = stepper;
    }

    // private siblingComparer:
    // (data: IgxStepComponent, step: IgxStepComponent) => boolean =
    // (data: IgxStepComponent, step: IgxStepComponent) => step !== data && step.level === data.level;
}
