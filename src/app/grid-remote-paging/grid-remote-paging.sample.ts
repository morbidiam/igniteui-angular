import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GridPagingMode, IgxGridComponent } from 'igniteui-angular';
import { RemoteService } from '../shared/remote.service';
import { Observable } from 'rxjs';
import { IgxSelectItemComponent } from '../../../projects/igniteui-angular/src/lib/select/select-item.component';
import { FormsModule } from '@angular/forms';
import { IgxSelectComponent } from '../../../projects/igniteui-angular/src/lib/select/select.component';
import { IgxButtonDirective } from '../../../projects/igniteui-angular/src/lib/directives/button/button.directive';
import { IgxCardComponent, IgxCardHeaderComponent, IgxCardHeaderTitleDirective, IgxCardContentDirective } from '../../../projects/igniteui-angular/src/lib/card/card.component';
import { IgxPaginatorComponent } from '../../../projects/igniteui-angular/src/lib/paginator/paginator.component';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { IgxColumnComponent } from '../../../projects/igniteui-angular/src/lib/grids/columns/column.component';
import { IgxGridComponent as IgxGridComponent_1 } from '../../../projects/igniteui-angular/src/lib/grids/grid/grid.component';

@Component({
    selector: 'app-grid-remote-paging-sample',
    templateUrl: 'grid-remote-paging.sample.html',
    standalone: true,
    imports: [IgxGridComponent_1, IgxColumnComponent, NgIf, IgxPaginatorComponent, IgxCardComponent, IgxCardHeaderComponent, IgxCardHeaderTitleDirective, IgxCardContentDirective, IgxButtonDirective, IgxSelectComponent, FormsModule, NgFor, IgxSelectItemComponent, AsyncPipe]
})
export class GridRemotePagingSampleComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('grid1', { static: true }) public grid1: IgxGridComponent;

    public mode: GridPagingMode = GridPagingMode.Remote;
    public page = 0;
    public totalCount = 0;
    public pages = [];
    public paging = true;
    public data: Observable<any[]>;
    public selectOptions = [5, 10, 15, 25, 50];
    public areAllRowsSelected: boolean = false;

    private _perPage = 15;
    private _dataLengthSubscriber;

    constructor(private remoteService: RemoteService) {
    }

    public get perPage(): number {
        return this._perPage;
    }

    public set perPage(val: number) {
        this._perPage = val;
        this.paginate(0);
    }

    public ngOnInit() {
        this.data = this.remoteService.remotePagingData.asObservable();

        this._dataLengthSubscriber = this.remoteService.getPagingDataLength().subscribe((data) => {
            this.totalCount = data;
            this.grid1.isLoading = false;
        });

        this.grid1.dataChanged.subscribe(() => {
            if (this.areAllRowsSelected) {
                this.grid1.selectAllRows();
            }
        });

        this.grid1.rowSelectionChanging.subscribe((args) => {
            this.areAllRowsSelected = args.allRowsSelected;
            if (args.allRowsSelected) {
                this.grid1.selectAllRows();
            }
        });
    }

    public ngOnDestroy() {
        if (this._dataLengthSubscriber) {
            this._dataLengthSubscriber.unsubscribe();
        }
    }

    public ngAfterViewInit() {
        this.grid1.isLoading = true;
        this.remoteService.getPagingData(0, this.perPage);
    }

    public paginate(page: number) {
        this.page = page;
        const skip = this.page * this.perPage;
        const top = this.perPage;

        this.remoteService.getPagingData(skip, top);
    }

    public perPageChange(perPage: number) {
        const skip = this.page * perPage;
        const top = perPage;

        this.remoteService.getPagingData(skip, top);
    }
}
