import { FilteringLogic, IFilteringExpression } from './filtering-expression.interface';
import { FilteringExpressionsTree, IFilteringExpressionsTree } from './filtering-expressions-tree';
import { resolveNestedPath, parseDate } from '../core/utils';
import { GridType, PivotGridType } from '../grids/common/grid.interface';
import { PivotUtil } from '../grids/pivot-grid/pivot-util';

const DateType = 'date';
const DateTimeType = 'dateTime';
const TimeType = 'time';

export interface IFilteringStrategy {
    filter(data: any[], expressionsTree: IFilteringExpressionsTree, advancedExpressionsTree?: IFilteringExpressionsTree,
        valueExtractor?: (obj: any, key: string) => any): any[];
}

export class NoopFilteringStrategy implements IFilteringStrategy {
    private static _instance: NoopFilteringStrategy = null;

    private constructor() {  }

    public static instance() {
        return this._instance || (this._instance = new NoopFilteringStrategy());
    }

    public filter(data: any[], _: IFilteringExpressionsTree, __?: IFilteringExpressionsTree): any[] {
        return data;
    }
}

export abstract class BaseFilteringStrategy implements IFilteringStrategy  {
    public findMatchByExpression(rec: any, expr: IFilteringExpression, isDate?: boolean, isTime?: boolean, valueExtractor?: (obj: any, key: string) => any): boolean {
        const cond = expr.condition;
        const val = valueExtractor ? valueExtractor.call(this, rec, expr.fieldName) : this.getFieldValue(rec, expr.fieldName, isDate, isTime);
        return cond.logic(val, expr.searchVal, expr.ignoreCase);
    }

    public matchRecord(rec: any, expressions: IFilteringExpressionsTree | IFilteringExpression, valueExtractor?: (obj: any, key: string) => any): boolean {
        if (expressions) {
            if (expressions instanceof FilteringExpressionsTree) {
                const expressionsTree = expressions as IFilteringExpressionsTree;
                const operator = expressionsTree.operator as FilteringLogic;
                let matchOperand;

                if (expressionsTree.filteringOperands && expressionsTree.filteringOperands.length) {
                    for (const operand of expressionsTree.filteringOperands) {
                        matchOperand = this.matchRecord(rec, operand, valueExtractor);

                        // Return false if at least one operand does not match and the filtering logic is And
                        if (!matchOperand && operator === FilteringLogic.And) {
                            return false;
                        }

                        // Return true if at least one operand matches and the filtering logic is Or
                        if (matchOperand && operator === FilteringLogic.Or) {
                            return true;
                        }
                    }

                    return matchOperand;
                }

                return true;
            } else {
                const expression = expressions as IFilteringExpression;
                const isDate = expression.dataType === DateType;
                const isTime = expression.dataType === TimeType;
                return this.findMatchByExpression(rec, expression, isDate, isTime, valueExtractor);
            }
        }

        return true;
    }

    public abstract filter(data: any[], expressionsTree: IFilteringExpressionsTree,
        advancedExpressionsTree?: IFilteringExpressionsTree, valueExtractor?: (obj: any, key: string) => any): any[];

    protected abstract getFieldValue(rec: any, fieldName: string, isDate?: boolean, isTime?: boolean): any;
}

export class FilteringStrategy extends BaseFilteringStrategy {
    private static _instace: FilteringStrategy = null;

    constructor() {
        super();
    }

    public static instance() {
        return this._instace || (this._instace = new this());
    }

    public filter<T>(data: T[], expressionsTree: IFilteringExpressionsTree, advancedExpressionsTree: IFilteringExpressionsTree, valueExtractor?: (obj: any, key: string) => any): T[] {
        let i;
        let rec;
        const len = data.length;
        const res: T[] = [];

        if ((FilteringExpressionsTree.empty(expressionsTree) && FilteringExpressionsTree.empty(advancedExpressionsTree)) || !len) {
            return data;
        }
        for (i = 0; i < len; i++) {
            rec = data[i];
            if (this.matchRecord(rec, expressionsTree, valueExtractor) && this.matchRecord(rec, advancedExpressionsTree, valueExtractor)) {
                res.push(rec);
            }
        }
        return res;
    }

    protected getFieldValue(rec: any, fieldName: string, isDate: boolean = false, isTime: boolean = false): any {
        let value = resolveNestedPath(rec, fieldName);
        value = value && (isDate || isTime) ? parseDate(value) : value;
        return value;
    }
}
export class FormattedValuesFilteringStrategy extends FilteringStrategy {
    /**
     * Creates a new instance of FormattedValuesFilteringStrategy.
     *
     * @param fields An array of column field names that should be formatted.
     * If omitted the values of all columns which has formatter will be formatted.
     */
    constructor(private fields?: string[]) {
        super();
    }

    /** @hidden */
    public shouldApplyFormatter(fieldName: string): boolean {
        return !this.fields || this.fields.length === 0 || this.fields.some(f => f === fieldName);
    }

    protected getFieldValue(rec: any, fieldName: string, isDate: boolean = false, isTime: boolean = false, grid?: GridType): any {
        const column = grid.getColumnByName(fieldName);
        let value = resolveNestedPath(rec, fieldName);

        value = column.formatter && this.shouldApplyFormatter(fieldName) ?
            column.formatter(value, rec) : value && (isDate || isTime) ? parseDate(value) : value;

        return value;
    }
}
