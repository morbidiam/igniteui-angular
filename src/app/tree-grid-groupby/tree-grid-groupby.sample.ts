import { Component, ViewChild, OnInit } from '@angular/core';
import {
    IgxTreeGridComponent, IGroupingExpression, GridSelectionMode,
    DisplayDensity, DefaultSortingStrategy, ITreeGridRecord
} from 'igniteui-angular';
import { IgxGroupedTreeGridSorting, ITreeGridAggregation } from 'projects/igniteui-angular/src/lib/grids/tree-grid/tree-grid.grouping.pipe';
import { SAMPLE_DATA } from '../shared/sample-data';

@Component({
    providers: [],
    selector: 'app-tree-grid-groupby-sample',
    styleUrls: ['tree-grid-groupby.sample.css'],
    templateUrl: 'tree-grid-groupby.sample.html'
})

export class TreeGridGroupBySampleComponent implements OnInit {
    @ViewChild('grid1', { static: true }) public grid1: IgxTreeGridComponent;

    public data: Array<any>;
    public columns: Array<any>;
    public columnGroups: Array<any>;
    public selectionMode;
    public density: DisplayDensity = 'comfortable';
    public result;
    public displayDensities;
    public groupingExpressions: IGroupingExpression[] = [
        { fieldName: 'ProductCategory', dir: 1, ignoreCase: true, strategy: DefaultSortingStrategy.instance() }
    ];
    public groupKey = 'Groups';
    public childDataKey = 'Childs';
    public sorting = IgxGroupedTreeGridSorting.instance();
    public pivotCols = ['Country'];

    public employeeAggregations: ITreeGridAggregation[] = [{
        field: 'UnitsSold',
        aggregate: (parent: ITreeGridRecord, children: any[]) => children.map((c) => c.UnitsSold).reduce((sum, n) => sum + n, 0)
    }];

    public ngOnInit(): void {
        this.selectionMode = GridSelectionMode.multiple;
        this.displayDensities = [
            { label: 'compact', selected: this.density === 'compact', togglable: true },
            { label: 'cosy', selected: this.density === 'cosy', togglable: true },
            { label: 'comfortable', selected: this.density === 'comfortable', togglable: true }
        ];

        this.columnGroups = [
            { header: '', collapsible: true, expanded: true, columns: [
                { dataType: 'string', field: 'ProductCategory', width: 200, groupable: true }
            ]},
            { header: 'Bulgaria', collapsible: true, expanded: true, columns: [
                { dataType: 'number', header: 'sum(UnitPrice)', field: 'Bulgaria', width: 300, groupable: true }
            ]},
            { header: 'US', collapsible: true, expanded: true, columns: [
                { dataType: 'number', header: 'sum(UnitPrice)', field: 'USA', width: 300, groupable: true }
            ]},
            { header: 'Uruguay', collapsible: true, expanded: true, columns: [
                { dataType: 'number', header: 'sum(UnitPrice)', field: 'Uruguay', width: 300, groupable: true }
            ]}
        ];

        this.columns = [
            // { dataType: 'string', field: 'ID', width: 100, hidden: true },
            { dataType: 'string', field: 'ProductCategory', width: 200, groupable: true },
            { dataType: 'string', field: 'SellerName', width: 200, groupable: true },
            { dataType: 'number', field: 'UnitPrice', width: 300, groupable: true }
        ];
        this.data = [
            { ProductCategory: 'Clothing', UnitPrice: 12.81, SellerName: 'Stanley',
             Country: 'Bulgaria', Date: '01/01/2012', UnitsSold: 282 },
            { ProductCategory: 'Clothing', UnitPrice: 49.57, SellerName: 'Elisa', Country: 'USA', Date: '01/05/2019', UnitsSold: 296 },
            { ProductCategory: 'Bikes', UnitPrice: 3.56, SellerName: 'Lydia', Country: 'Uruguay', Date: '01/06/2020', UnitsSold: 68 },
            { ProductCategory: 'Accessories', UnitPrice: 85.58, SellerName: 'David', Country: 'USA', Date: '04/07/2021', UnitsSold: 293 },
            { ProductCategory: 'Components', UnitPrice: 18.13, SellerName: 'John', Country: 'USA', Date: '12/08/2021', UnitsSold: 240 },
            { ProductCategory: 'Clothing', UnitPrice: 68.33, SellerName: 'Larry', Country: 'Uruguay', Date: '05/12/2020', UnitsSold: 456 },
            { ProductCategory: 'Clothing', UnitPrice: 16.05, SellerName: 'Walter', Country: 'Bulgaria', Date: '02/19/2020', UnitsSold: 492 }
        ];

        this.result = [
            { ProductCategory: 'Clothing', Bulgaria: 774, USA: 296, Uruguay: 456 },
            { ProductCategory: 'Bikes', Uruguay: 68 },
            { ProductCategory: 'Accessories', USA: 293 },
            { ProductCategory: 'Components', USA: 240 }
        ];

    }

    public selectDensity(event) {
        this.density = this.displayDensities[event.index].label;
    }

    public cellEditDone(event: any) {
        this.groupingExpressions = [...this.groupingExpressions]; // will trigger grouping pipe
    }
}
