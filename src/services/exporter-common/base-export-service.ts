import {
    EventEmitter,
    Output
} from "@angular/core";

import { IgxGridComponent } from "../../grid/grid.component";

import { ExportUtilities } from "./export-utilities";
import { IgxExporterOptionsBase } from "./exporter-options-base";

export interface IRowExportingEventArgs {
    rowData: any;
    rowIndex: number;
    cancel: boolean;
}

export interface IColumnExportingEventArgs {
    header: string;
    columnIndex: number;
    cancel: boolean;
}

export abstract class IgxBaseExporter {
    private _columnList: any[];
    protected _indexOfLastPinnedColumn = -1;

    @Output()
    public onRowExport = new EventEmitter<IRowExportingEventArgs>();

    @Output()
    public onColumnExport = new EventEmitter<IColumnExportingEventArgs>();

    public export(grid: IgxGridComponent, options: IgxExporterOptionsBase): void {
        if (options === undefined || options === null) {
            throw Error("No options provided!");
        }

        const columns = grid.columnList.toArray();
        this._columnList = new Array<any>(columns.length);

        const hiddenColumns = [];
        let lastVisbleColumnIndex = -1;

        columns.forEach((column) => {
            const columnHeader = column.header !== "" ? column.header : column.field;
            const exportColumn = !column.hidden || options.ignoreColumnsVisibility;
            const index = options.ignoreColumnsOrder ? column.index : column.visibleIndex;

            const columnInfo = {
                header: columnHeader,
                field: column.field,
                skip: !exportColumn
            };

            if (index !== -1) {
                this._columnList[index] = columnInfo;
                lastVisbleColumnIndex = Math.max(lastVisbleColumnIndex, index);
            } else {
                hiddenColumns.push(columnInfo);
            }

            if (column.pinned && exportColumn) {
                this._indexOfLastPinnedColumn = index;
            }
        });

        // Append the hidden columns to the end of the list
        hiddenColumns.forEach((hiddenColumn) => {
           this._columnList[++lastVisbleColumnIndex] = hiddenColumn;
        });

        const useRowList = !options.ignoreFiltering &&
                            grid.filteringExpressions !== undefined &&
                            grid.filteringExpressions.length > 0;

        const data = useRowList ? grid.rowList.toArray().sort((r) => r.index).
                                                        map((r) => r.rowData) : grid.data;
        this.exportData(data, options);
    }

    public exportData(data: any[], options: IgxExporterOptionsBase): void {
        if (options === undefined || options === null) {
            throw Error("No options provided!");
        }

        if (!this._columnList || this._columnList.length === 0) {
            const keys = ExportUtilities.getKeysFromData(data);
            this._columnList = keys.map((k) => ({ header: k, field: k, skip: false}));
        }

        let skippedPinnedColumnsCount = 0;
        this._columnList.forEach((column, index) => {
            if (!column.skip) {
                const columnExportArgs = {
                    header: column.header,
                    columnIndex: index,
                    cancel: false
                };
                this.onColumnExport.emit(columnExportArgs);

                column.header = columnExportArgs.header;
                column.skip = columnExportArgs.cancel;

                if (column.skip && index <= this._indexOfLastPinnedColumn) {
                    skippedPinnedColumnsCount++;
                }
            }
        });

        this._indexOfLastPinnedColumn -= skippedPinnedColumnsCount;

        const dataToExport = new Array<any>();
        const isSpecialData = ExportUtilities.isSpecialData(data);

        data.forEach((row, index) => {
            this.exportRow(dataToExport, row, index, isSpecialData);
        });

        this.exportDataImplementation(dataToExport, options);
        this.resetDefaults();
    }

    protected abstract exportDataImplementation(data: any[], options: IgxExporterOptionsBase): void;

    private exportRow(data: any[], rowData: any, index: number, isSpecialData: boolean) {
        let row;

        if (!isSpecialData) {
            row = this._columnList.reduce((a, e) => {
                if (!e.skip) {
                    a[e.header] = rowData[e.field];
                }
                return a;
            }, {});
        } else {
            row = rowData;
        }

        const rowArgs = {
            rowData: row,
            rowIndex: index,
            cancel: false
        };
        this.onRowExport.emit(rowArgs);

        if (!rowArgs.cancel) {
            data.push(rowArgs.rowData);
        }
    }

    private resetDefaults() {
        this._columnList = [];
        this._indexOfLastPinnedColumn = -1;
    }
}
