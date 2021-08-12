import { ChangeDetectorRef, Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { GridPagingMode, IGridEditDoneEventArgs, IgxGridComponent, IgxGridRow,
    IgxSnackbarComponent,
    IRowDataEventArgs,
    NoopFilteringStrategy, NoopSortingStrategy } from 'igniteui-angular';
import { Observable, Subject } from 'rxjs';
import { CRUDService } from './crud.service';
import { Invoice } from './invoiceData';

@Component({
    providers: [CRUDService],
    selector: 'app-grid-crud-sample',
    styleUrls: ['./crud-sample.component.scss'],
    templateUrl: './crud-sample.component.html'
})
export class CRUDSampleComponent implements OnInit, OnDestroy {
    @ViewChild('grid', { static: true }) public grid: IgxGridComponent;
    @ViewChild('snackbar', { static: false }) public snackbar: IgxSnackbarComponent;

    public page = 0;
    public totalCount = 0;
    public pages = [];
    public selectOptions = [5, 10, 15, 25, 50];
    public mode = GridPagingMode.Remote;

    public remoteData$: Observable<Invoice[]>;
    public data: Invoice[] = [];
    public noopFilterStrategy = NoopFilteringStrategy.instance();
    public noopSortStrategy = NoopSortingStrategy.instance();

    private _prevRequest: any;
    private destroy$ = new Subject<boolean>();

    private _perPage = 10;

    constructor(private _crudService: CRUDService, public cdr: ChangeDetectorRef) { }

    public ngOnInit(): void {
        this.remoteData$ = this._crudService.data$;
        this._crudService.getData(this.page * this.perPage, this.perPage);
        this._crudService.getDataLength().subscribe((length) => {
            this.totalCount = length;
        });
        this.remoteData$.subscribe((data: any) => {
            this.data = data;
            this.grid.isLoading = false;
        });
    }

    public rowAdded(event: IRowDataEventArgs) {
        this._crudService.add(event.data).subscribe((rec) => {
            // this.snackbar.open(`Row with ID of ${rec.ID} was created.`);
        });
    }

    public rowDeleted(event: IRowDataEventArgs) {
        this.grid.isLoading = true;
        this._crudService.delete(event.data).subscribe({
            next: (data: any) => {
                this.snackbar.open(`Row with ID of ${data.ID} was deleted.`);
            },
            error: err => {
                console.log(err);
            },
            complete: () => {
                this.grid.isLoading = false;
                console.log('Complete notification');
            }
        });
    }

    public rowEditDone(event: IGridEditDoneEventArgs) {
        this.grid.isLoading = true;
        this._crudService.update(event.newValue).subscribe((rec) => {
            this.grid.isLoading = false;
            this.snackbar.open(`Row with ID of ${rec.ID} was edited.`);
        });
    }

    public removeRow(row: IgxGridRow) {
        this.grid.isLoading = true;
        this._crudService.delete(row.data).subscribe((rec) => {
            this.grid.isLoading = false;
            this.snackbar.open(`Row with ID of ${rec.ID} was deleted.`);
        });
    }

    public get perPage(): number {
        return this._perPage;
    }

    public set perPage(val: number) {
        this._perPage = val;
        this.paginate(0);
    }

    public paginate(page: number) {
        this.grid.isLoading = true;
        const skip = this.page * this.perPage;
        const top = this.perPage;

        this._crudService.getData(skip, skip + top);
    }

    public perPageChange(perPage: number) {
        const skip = this.page * perPage;
        const top = perPage;

        this._crudService.getData(skip, skip + top);
    }

    public formatNumber(value: number) {
        return value.toFixed(2);
    }

    public formatCurrency(value: number) {
        return '$' + value.toFixed(2);
    }

    // public get countries(): { 'Country': string; 'CountryFlag': string }[] {
    //     return athletesData.map(r => {
    //         const c = {} as { 'Country': string; 'CountryFlag': string };
    //         c.Country = r.CountryName;
    //         c.CountryFlag = r.CountryFlag;
    //         return c;
    //     });
    // }

    public ngOnDestroy() {
        if (this._prevRequest) {
            this._prevRequest.unsubscribe();
        }
        this.destroy$.next();
        this.destroy$.complete();
    }
}
