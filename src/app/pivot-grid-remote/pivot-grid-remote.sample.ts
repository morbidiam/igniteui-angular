import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
    IFilteringExpressionsTree,
    IgxColumnComponent,
    IgxPivotGridComponent, IgxPivotNumericAggregate, IPivotConfiguration, IPivotDimension,
    IPivotValue,
    NoopFilteringStrategy,
    NoopPivotDimensionsStrategy
} from 'igniteui-angular';
import { NoopSortingStrategy } from 'projects/igniteui-angular/src/lib/grids/common/strategy';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { RemoteFilteringService } from './remoteService.service';



@Component({
    providers: [RemoteFilteringService],
    selector: 'app-tree-grid-sample',
    styleUrls: ['pivot-grid-remote.sample.scss'],
    templateUrl: 'pivot-grid-remote.sample.html'
})

export class PivotGridRemoteSampleComponent implements OnInit, AfterViewInit, OnDestroy {
    private DEBOUNCE_TIME = 300;
    public data: any;
    private destroy$ = new Subject<boolean>();
    private _chunkSize: number;
    private _prevRequest: any;
    @ViewChild('grid1', { static: true }) public grid: IgxPivotGridComponent;


    public noopFilterStrategy = NoopFilteringStrategy.instance();
    public noopSortStrategy = NoopSortingStrategy.instance();

    public columnValuesStrategy = (column: IgxColumnComponent,
        columnExprTree: IFilteringExpressionsTree,
        done: (uniqueValues: any[]) => void) => {
        // Get specific column data.
        this._remoteService.getColumnData(column, columnExprTree, uniqueValues => done(uniqueValues));
    };

    public pivotConfigHierarchy: IPivotConfiguration = {
        columns: [
            {
                memberName: 'CategoryName',
                enabled: true
            }
        ]
        ,
        rows: [{

            memberName: "All products",
            memberFunction: () => 'All products',
            enabled: true,
            childLevel:
            {
                memberName: 'ProductName',
                enabled: true
            }
        }
        ],
        values: [
            {
                member: 'UnitsInStock',
                aggregate: {
                    aggregator: IgxPivotNumericAggregate.sum,
                    key: 'sum',
                    label: 'Sum'
                },
                enabled: true
            },
        ],
        filters: null
    };

    constructor(private _remoteService: RemoteFilteringService, public cdr: ChangeDetectorRef) { }

    public ngAfterViewInit(): void {
        const filteringExpr = this.grid.filteringExpressionsTree.filteringOperands;
        const sortingExpr = this.grid.sortingExpressions[0];
        this._remoteService.getData(
            filteringExpr,
            sortingExpr,
            (data) => {
                this.grid.isLoading = false;
            });
        this.grid.filteringExpressionsTreeChange.pipe(
            debounceTime(300),
            takeUntil(this.destroy$)
        ).subscribe(() => {
            this.processData(true);
        });

        this.grid.sortingExpressionsChange.pipe(
            debounceTime(300),
            takeUntil(this.destroy$)
        ).subscribe(() => {
            this.processData();
        });
    }

    public ngOnInit(): void {
        this.data = this._remoteService.remoteData;
    }

    public processData(isFiltering: boolean = false) {
        if (this._prevRequest) {
            this._prevRequest.unsubscribe();
        }

        const filteringExpr = this.grid.filteringExpressionsTree.filteringOperands;
        const sortingExpr = this.grid.sortingExpressions[0];

        this._prevRequest = this._remoteService.getData(
            filteringExpr,
            sortingExpr,
            (data) => {
                this.grid.data = data.value;
                console.log(data);
                this.grid.notifyDimensionChange(true);
            });
    }

    public ngOnDestroy() {
        if (this._prevRequest) {
            this._prevRequest.unsubscribe();
        }
        this.destroy$.next();
        this.destroy$.complete();
    }
}
