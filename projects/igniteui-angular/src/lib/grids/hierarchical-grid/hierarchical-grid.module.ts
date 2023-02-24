import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IgxChildGridRowComponent, IgxHierarchicalGridComponent } from './hierarchical-grid.component';
import { IgxHierarchicalRowComponent } from './hierarchical-row.component';
import { IgxGridHierarchicalPipe, IgxGridHierarchicalPagingPipe } from './hierarchical-grid.pipes';
import { IgxRowIslandComponent } from './row-island.component';
import { IgxHierarchicalGridCellComponent } from './hierarchical-cell.component';
import { IgxTooltipModule } from '../../directives/tooltip';
import { ReactiveFormsModule } from '@angular/forms';
import { IgxGridComponent } from '../grid/grid.component';

/**
 * @hidden
 */
@NgModule({
    exports: [
        IgxHierarchicalGridComponent,
        IgxHierarchicalRowComponent,
        IgxHierarchicalGridCellComponent,
        IgxRowIslandComponent,
        IgxChildGridRowComponent
    ],
    imports: [
        IgxGridComponent,
        IgxTooltipModule,
        ReactiveFormsModule,
        IgxHierarchicalGridComponent,
        IgxHierarchicalRowComponent,
        IgxRowIslandComponent,
        IgxChildGridRowComponent,
        IgxHierarchicalGridCellComponent,
        IgxGridHierarchicalPipe,
        IgxGridHierarchicalPagingPipe
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IgxHierarchicalGridModule {
}
