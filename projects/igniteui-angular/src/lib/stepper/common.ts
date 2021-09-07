import { InjectionToken } from '@angular/core';
import { CancelableEventArgs, IBaseCancelableBrowserEventArgs, IBaseEventArgs, mkenum } from '../core/utils';
import { IgxStepperComponent } from './igx-stepper.component';
import { IgxStepComponent } from './step/igx-step.component';

// Events
// export interface IStepperEventArgs extends IBaseEventArgs {
//     index: number;
//     owner: IgxStepperComponent;
// }

// export interface IStepperCancelableEventArgs extends CancelableEventArgs {
//     oldIndex: number;
//     newIndex: number;
//     owner: IgxStepperComponent;
// }

export interface IStepTogglingEventArgs extends IBaseEventArgs, IBaseCancelableBrowserEventArgs {
    step: IgxStepComponent;
    owner: IgxStepperComponent;
}

export interface IStepToggledEventArgs extends IBaseEventArgs {
    step: IgxStepComponent;
    owner: IgxStepperComponent;
    oldStep?: IgxStepComponent;
    oldIndex?: number;
}


// Enums
export const IgxStepperOrienatation = mkenum({
    Horizontal: 'Horizontal',
    Vertical: 'Vertical'
});
export type IgxStepperOrienatation = (typeof IgxStepperOrienatation)[keyof typeof IgxStepperOrienatation];

export enum IgxStepType {
    Indicator,
    Label,
    Full
}

export enum IgxStepperLabelPosition {
    Bottom,
    Top,
    End,
    Start
}

export enum IgxStepperProgressLine {
    Solid,
    Dashed
}

// Token
export const IGX_STEPPER_COMPONENT = new InjectionToken<IgxStepperComponent>('IgxStepperToken');
