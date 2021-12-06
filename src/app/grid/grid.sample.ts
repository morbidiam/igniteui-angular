
import { Component, ViewChild } from '@angular/core';
import { IgxDialogComponent, IgxGridComponent, Transaction } from 'igniteui-angular';
import { FinancialDataService } from '../shared/financialData';


@Component({
    selector: 'app-grid-sample',
    styleUrls: ['grid.sample.css'],
    templateUrl: 'grid.sample.html'
})
export class GridSampleComponent {
    @ViewChild('grid1', { static: true })
    public grid1: IgxGridComponent;

    @ViewChild(IgxDialogComponent, { static: true })
    public dialog: IgxDialogComponent;


    public data: any[];

    public transactionsData: Transaction[] = [];


    constructor(private localService: FinancialDataService) {
        this.localService.getData(1000000);
        this.localService.records.subscribe(data => {
            this.data = data;
        })
    }

    public formatNumber(value: number) {
        return value.toFixed(2);
    }
    public formatCurrency(value: number) {
        return '$' + value.toFixed(2);
    }

    public undo() {
        /* exit edit mode and commit changes */
        this.grid1.endEdit(true);
        this.grid1.transactions.undo();
    }

    public redo() {
        /* exit edit mode and commit changes */
        this.grid1.endEdit(true);
        this.grid1.transactions.redo();
    }

    public openCommitDialog() {
        this.transactionsData = this.grid1.transactions.getAggregatedChanges(true);
        this.dialog.open();
    }

    public commit() {
        this.grid1.transactions.commit(this.data);
        this.dialog.close();
    }

    public discard() {
        this.grid1.transactions.clear();
        this.dialog.close();
    }

    public addRow() {
        this.grid1.addRow({
            'Buy': 27.55,
            'BuyDiff': '-16.31617113850485',
            'CUSIP': "1765866",
            'Category': "Oil",
            'Change': '0.23000000000000043',
            'Change On Year(%)': 9.0119,
            'Change(%)': 0.84,
            'CollatT': "NEW MONEY",
            'Contract': "Forwards",
            'Country': "Israel",
            'Cpn': "7.875",
            'CpnTyp': "FIXED",
            'Curncy': "USD",
            'DBRS': "N.A.",
            "Fitch": "N.A.",
            'High(D)': 27.55,
            'High(D)Diff': "-16.31617113850485",
            'High(Y)': 29.32,
            'High(Y)Diff': 946.3379260333586,
            'ID': -1,
            'IndGrou': "Airlines",
            'IndSect': "Consumer, Cyclical",
            'IndSubg': "Airlines",
            'IssuerN': "AMERICAN AIRLINES GROUP",
            'KRD_1YR': -0.00187,
            'KRD_3YR': 0.00006,
            'KRD_5YR': 0,
            'LastUpdated': 'Wed Apr 21 2021 01:28:53 GMT+0300 (Eastern European Summer Time) {}',
            'Low(D)': '27.55',
            'Low(D)Diff': -16.31617113850485,
            'Low(Y)': 21.28,
            'Low(Y)Diff': -3426.3959390862933,
            'MUNI_SECTOR': "",
            ' Maturity': "7/13/1939",
            'Moodys': "WR",
            'Open Price': 27.55,
            'OpenPriceDiff': -16.31617113850485,
            'PD_WALA': null,
            'Price': 27.81,
            'RISK_COUNTRY': "",
            'Region': "Middle East",
            'SecType': "PUBLIC",
            'Security': "001765866 Pfd",
            'Sell': 27.55,
            'SellDiff': -16.31617113850485,
            'Settlement': "Cash",
            'Spread': 0.02,
            'Start(Y)': 25.3,
            'Start(Y)Diff': -1240.0290065264674,
            'Ticker': "AAL",
            'Type': "Uranium",
            'Volume': 12,
            'ZV_SPREAD': 28.302,
            'sector': "Pfd",
        });


    }
}