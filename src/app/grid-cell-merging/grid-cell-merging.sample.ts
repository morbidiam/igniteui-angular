import { Component, ViewChild, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';

import { SAMPLE_DATA } from '../shared/sample-data';

import {
    CellMergingType,
    IChangeSwitchEventArgs,
    IgxColumnComponent,
    IgxGridComponent,
    IgxSwitchComponent
} from 'igniteui-angular';

@Component({
    providers: [],
    selector: 'app-grid-cell-merging-sample',
    styleUrls: ['grid-cell-merging.sample.scss'],
    templateUrl: 'grid-cell-merging.sample.html',
    standalone: true,
    imports: [NgFor, IgxGridComponent, IgxSwitchComponent, IgxColumnComponent]
})
export class GridCellMergingComponent implements OnInit {
    @ViewChild('grid', { static: true }) public grid: IgxGridComponent;

    public data: Array<any>;
    public columns: Array<any>;
    public mergeType = CellMergingType.Visual;

    public ngOnInit(): void {
        this.data = SAMPLE_DATA;

        this.columns = [
            { field: 'ID', groupable: true, type: 'string', hidden: true },
            { field: 'CompanyName',  groupable: true, type: 'string' },
            { field: 'ContactName',  groupable: true, type: 'string' },
            { field: 'ContactTitle',  groupable: true, type: 'string' },
            { field: 'Address',  groupable: true, type: 'string' },
            { field: 'City', groupable: true, type: 'string' },
            { field: 'Region',  groupable: true, type: 'string' },
            { field: 'PostalCode',  groupable: true, type: 'string' },
            { field: 'Phone',  groupable: true, type: 'string' },
            { field: 'Fax',  groupable: true, type: 'string' },
            { field: 'Employees',  groupable: true, type: 'number' },
            { field: 'DateCreated', groupable: true, type: 'time', hidden: true },
            { field: 'Contract',  groupable: true, type: 'boolean' }
        ];
    }

    public changeMergingType($event: IChangeSwitchEventArgs) {
        this.mergeType = $event.checked ? CellMergingType.Physical: CellMergingType.Visual;
        this.grid.cdr.detectChanges();
    }
}
