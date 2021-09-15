import { Pipe, PipeTransform } from '@angular/core';
import { DefaultSortingStrategy, IgxDataRecordSorting, SortingDirection } from 'igniteui-angular';
import { cloneArray } from '../../core/utils';
import { DataUtil } from '../../data-operations/data-util';
import { FilteringExpressionsTree, IFilteringExpressionsTree } from '../../data-operations/filtering-expressions-tree';
import { IFilteringStrategy } from '../../data-operations/filtering-strategy';
import { IGroupingExpression } from '../../data-operations/grouping-expression.interface';
import { IGroupByResult } from '../../data-operations/grouping-result.interface';

export interface IPivotDimension {
    name: string;
    // allow defining a hierarchy when multiple sub groups need to be extracted from single value
    childLevels?: IPivotDimension[];
    // field name which to use to extract value or function that extract the value.
    member: ((data: any) => any);
}

export interface IPivotValue {
    name: string;
    // aggregate function - can use one of the predefined like IgxNumberSummaryOperand.sum(data) etc.
    aggregate: (data: any[]) => any;
}

@Pipe({
    name: 'pivotFiltering'
})
export class IgxPivotFilterPipe implements PipeTransform {
    public transform(collection: any[], expressionsTree: IFilteringExpressionsTree,
        filterStrategy: IFilteringStrategy,
        advancedExpressionsTree: IFilteringExpressionsTree) {

        const state = {
            expressionsTree,
            strategy: filterStrategy,
            advancedExpressionsTree
        };

        if (FilteringExpressionsTree.empty(state.expressionsTree) && FilteringExpressionsTree.empty(state.advancedExpressionsTree)) {
            return collection;
        }

        const result = DataUtil.filter(cloneArray(collection), state);

        return result;
    }
}

/** @hidden */
@Pipe({
    name: 'pivotRow'
})
export class IgxPivotRowPipe implements PipeTransform {
    public transform(collection: any[],
        rows: IPivotDimension [],
        values?: IPivotValue[]
    ) {
        const result: any[] = collection.slice();
        let groupingExpressions: IGroupingExpression[] = [];

        // group the data in a way using the rows.member declarations in a groupingComparer
        for (const row of rows) {
            groupingExpressions = groupingExpressions.concat(this.buildGroupingExpressions(row));
        }

        const sorted = DataUtil.sort(result, groupingExpressions);
        const groupResult = DataUtil
            .group(sorted, {defaultExpanded: true, expansion: [], expressions: groupingExpressions});

        // go around the data and aggregate by the specified values, aggregations should be
        // stored into the groups
        for (const val of values) {
            this.applyAggregation(groupResult.data, val);
        }

        return groupResult.data;
    }

    private buildGroupingExpressions(row: IPivotDimension): IGroupingExpression[] {
        let groupingExpressions: IGroupingExpression[] = [{
            fieldName: row.name,
            dir: SortingDirection.Asc,
            groupingComparer: (a, b) => DefaultSortingStrategy.instance()
                .compareValues(row.member.call(this, a), row.member.call(this, b))
        }];
        if (row.childLevels) {
            for (const childRow of row.childLevels) {
                groupingExpressions = groupingExpressions.concat(this.buildGroupingExpressions(childRow));
            }
        }
        return groupingExpressions;
    }

    private applyAggregation(data: any[], val: IPivotValue): void {
        for (const record of data) {
            if (record.groups) {
                this.applyAggregation(record.groups, val);
                record[val.name] = val.aggregate(record.records.map(r => r[val.name]));
            } else if (record.records) {
                record[val.name] = val.aggregate(record.records.map(r => r[val.name]));
            }
        }
    }
}


@Pipe({
    name: 'pivotColumn'
})
export class IgxPivotColumnPipe implements PipeTransform {
    public transform(collection: any[],
        columns: IPivotDimension [],
        values?: IPivotValue[]
    ) {
        const result: any[] = [];
        return result;
    }
}
