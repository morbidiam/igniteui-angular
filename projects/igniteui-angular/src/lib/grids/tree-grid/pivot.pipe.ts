import { Pipe, PipeTransform } from '@angular/core';
import { FilteringExpressionsTree } from '../../data-operations/filtering-expressions-tree';
import { IGroupingExpression } from '../../data-operations/grouping-expression.interface';
import { IgxTreeGridComponent } from './tree-grid.component';
import { IgxTreeGridGroupingPipe, ITreeGridAggregation } from './tree-grid.grouping.pipe';

/** @hidden */
@Pipe({
    name: 'pivot'
})
export class IgxPivotPipe extends IgxTreeGridGroupingPipe implements PipeTransform {
    public transform(collection: any[],
        groupingExpressions: IGroupingExpression[],
        groupKey: string,
        childDataKey: string,
        grid: IgxTreeGridComponent,
        aggregations?: ITreeGridAggregation[],
        columns?: string[],
        filter?: FilteringExpressionsTree
    ) {
        const result = super.transform(collection, groupingExpressions, groupKey, childDataKey, grid, aggregations);

        const aggregation = aggregations[0];
        for (const column of columns) {
            for (const row of result) {
                for (const child of row[childDataKey]) {

                    if (Object.keys(row).indexOf((child[column])) !== -1) {
                        // do the aggregation
                        row[child[column]] += child[aggregation.field];
                    } else {
                        row[child[column]] = child[aggregation.field];
                    }
                }
                delete row[childDataKey];
            }
        }

        return result;
    }
}
