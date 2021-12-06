
import { Component, ViewChild } from '@angular/core';
import { IgxGridComponent } from 'igniteui-angular';
import { Observable } from 'rxjs';
import { FinancialDataService } from '../shared/financialData';


@Component({
    selector: 'app-grid-sample',
    styleUrls: ['grid.sample.css'],
    templateUrl: 'grid.sample.html'
})
export class GridSampleComponent {
    @ViewChild('grid1', { static: true }) public grid1: IgxGridComponent;
    public data: Observable<any[]>;
    constructor(private localService: FinancialDataService) {
        this.localService.getData(1000000);
        this.data = this.localService.records;
    }

    public formatNumber(value: number) {
        return value.toFixed(2);
    }
    public formatCurrency(value: number) {
        return '$' + value.toFixed(2);
    }
}
