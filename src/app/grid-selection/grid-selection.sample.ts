import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { NgFor, NgIf, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Observable } from 'rxjs';

import { RemoteService } from '../shared/remote.service';
import { IgxRippleDirective } from '../../../projects/igniteui-angular/src/lib/directives/ripple/ripple.directive';
import { IgxColumnComponent } from '../../../projects/igniteui-angular/src/lib/grids/columns/column.component';
import { IgxGridComponent } from '../../../projects/igniteui-angular/src/lib/grids/grid/grid.component';
import { IgxDropDownItemComponent } from '../../../projects/igniteui-angular/src/lib/drop-down/drop-down-item.component';
import { IgxDropDownComponent } from '../../../projects/igniteui-angular/src/lib/drop-down/drop-down.component';
import { IgxDropDownItemNavigationDirective } from '../../../projects/igniteui-angular/src/lib/drop-down/drop-down-navigation.directive';
import { IgxToggleActionDirective } from '../../../projects/igniteui-angular/src/lib/directives/toggle/toggle.directive';
import { IgxButtonDirective } from '../../../projects/igniteui-angular/src/lib/directives/button/button.directive';
import { IgxSwitchComponent } from '../../../projects/igniteui-angular/src/lib/switch/switch.component';

@Component({
    selector: 'app-grid-selection-sample',
    templateUrl: 'grid-selection.sample.html',
    styleUrls: ['grid-selection.sample.scss'],
    standalone: true,
    imports: [IgxSwitchComponent, FormsModule, IgxButtonDirective, IgxToggleActionDirective, IgxDropDownItemNavigationDirective, IgxDropDownComponent, NgFor, IgxDropDownItemComponent, IgxGridComponent, IgxColumnComponent, NgIf, IgxRippleDirective, AsyncPipe]
})
export class GridSelectionComponent implements AfterViewInit {
    @ViewChild('grid1', { static: true })
    private grid1: IgxGridComponent;

    public remote: Observable<any[]>;
    public selection = true;
    public selectionModes = ['none', 'single', 'multiple'];

    constructor(private remoteService: RemoteService, private cdr: ChangeDetectorRef) {
        this.remoteService.urlBuilder = () => this.remoteService.url;
     }

     public ngAfterViewInit() {
        this.remote = this.remoteService.remoteData;
        this.remoteService.getData(this.grid1.data);
        this.cdr.detectChanges();
    }

    public onRowSelection(event) {
        this.grid1.rowSelection = event.newSelection.element.nativeElement.textContent.trim();
    }

    public onSelection(event) {
        this.grid1.cellSelection = event.newSelection.element.nativeElement.textContent.trim();
    }

    public scrScrollTo(index) {
        this.grid1.verticalScrollContainer.scrollTo(parseInt(index, 10));
    }

    public handleRowSelection() {
        console.log('ONSELECTIONEVENTFIRED');
/*         const targetCell = args.cell as IgxGridCellComponent;
        if  (!this.selection) {
            this.grid1.selectRows([targetCell.row.key], true);
        } */
    }

    public selectCells() {
        this.grid1.selectRange({rowStart: 1, rowEnd: 3, columnStart: 0, columnEnd: 2});
    }

    public selectCell() {
        this.grid1.getCellByColumn(1, 'ProductName').selected = this.grid1.getCellByColumn(1, 'ProductName').selected ?
        false : true;
        this.grid1.cdr.detectChanges();
    }

    public toggle() {
        const currentSelection = this.grid1.selectedRows;
        if (currentSelection !== undefined) {
            const currentSelectionSet = new Set(currentSelection);
            if (currentSelectionSet.has(1) && currentSelectionSet.has(2) && currentSelectionSet.has(5)) {
                this.grid1.deselectRows([1, 2, 5]);
                return;
            }
        }
        this.grid1.selectRows([1, 2, 5], false);
    }

    public toggleAll() {
        if ((this.grid1.selectedRows || []).length === 0) {
            this.grid1.selectAllRows();
        } else {
            this.grid1.deselectAllRows();
        }
    }

    public log(args) {
        console.log(args);
    }

    public callSelectAll() {
        this.grid1.selectAllRows();
    }

    public selectRow() {
        this.grid1.selectRows(['abc']);
    }

    public selectThirdRow() {
        const row = this.grid1.getRowByIndex(2);
        row.selected = !row.selected;
        this.grid1.cdr.detectChanges();
    }

    public deleteSelectedRow() {
        const r = this.grid1.selectedRows[0];
        this.grid1.deleteRow(r);

    }
}
