import { Pipe, PipeTransform } from '@angular/core';
import { cloneArray } from '../../core/utils';
import { DataUtil } from '../../data-operations/data-util';
import { FilteringExpressionsTree, IFilteringExpressionsTree } from '../../data-operations/filtering-expressions-tree';
import { IFilteringStrategy } from '../../data-operations/filtering-strategy';

export interface IPivotDimension {
    name: string;
    // allow defining a hierarchy when multiple sub groups need to be extracted from single value
    childLevels: IPivotDimension[];
    // field name which to use to extract value or function that extract the value.
    member: string | ((data: any) => any);
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
        const result: any[] = [];
        return result;
    }
}


@Pipe({
    name: 'pivotColumn'
})
export class IgxPivotPipe implements PipeTransform {
    public transform(collection: any[],
        columns: IPivotDimension [],
        values?: IPivotValue[]
    ) {
        const result: any[] = [];
        return result;
    }
}
