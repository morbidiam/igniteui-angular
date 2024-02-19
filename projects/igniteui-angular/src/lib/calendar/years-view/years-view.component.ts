import {
    Component,
    Input,
    HostBinding,
    ElementRef,
    Inject,
} from "@angular/core";
import { IgxCalendarYearDirective } from "../calendar.directives";
import { NgFor } from "@angular/common";
import {
    IgxCalendarViewDirective,
    DAY_INTERVAL_TOKEN,
} from "../common/calendar-view.directive";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { CalendarDay, DayInterval } from "../common/model";
import { calendarRange } from "../common/helpers";

@Component({
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: IgxYearsViewComponent,
            multi: true,
        },
        {
            provide: DAY_INTERVAL_TOKEN,
            useValue: "year",
        },
    ],
    selector: "igx-years-view",
    templateUrl: "years-view.component.html",
    standalone: true,
    imports: [NgFor, IgxCalendarYearDirective],
})
export class IgxYearsViewComponent
    extends IgxCalendarViewDirective
    implements ControlValueAccessor {
    /**
     * @hidden
     * @internal
     */
    protected tagName = "igx-years-view";

    /**
     * The default css class applied to the component.
     *
     * @hidden
     */
    @HostBinding("class.igx-years-view")
    public readonly viewClass = true;

    /**
     * @hidden
     */
    private _yearFormat = "numeric";

    /**
     * @hidden
     */
    private _yearsPerPage = 15;

    /**
     * Gets the year format option of the years view.
     * ```typescript
     * let yearFormat = this.yearsView.yearFormat.
     * ```
     */
    @Input()
    public get yearFormat(): any {
        return this._yearFormat;
    }

    /**
     * Sets the year format option of the years view.
     * ```html
     * <igx-years-view [yearFormat]="numeric"></igx-years-view>
     * ```
     *
     * @memberof IgxYearsViewComponent
     */
    public set yearFormat(value: any) {
        this._yearFormat = value;
        this.initFormatter();
    }

    /**
     * Returns an array of date objects which are then used to properly
     * render the years.
     *
     * Used in the template of the component.
     *
     * @hidden @internal
     */
    public get range(): Date[] {
        const year = this.date.getFullYear();
        const start = new CalendarDay({
            year: Math.floor(year / this._yearsPerPage) * this._yearsPerPage,
            month: this.date.getMonth(),
        });
        const end = start.add(this.dayInterval, this._yearsPerPage);

        return Array.from(calendarRange({ start, end, unit: this.dayInterval })).map(
            (m) => m.native,
        );
    }

    constructor(
        public el: ElementRef,
        @Inject(DAY_INTERVAL_TOKEN) dayInterval: DayInterval,
    ) {
        super(dayInterval);
    }

    /**
     * Returns the locale representation of the year in the years view.
     *
     * @hidden
     */
    public formattedYear(value: Date): string {
        if (this.formatView) {
            return this._formatter.format(value);
        }

        return `${value.getFullYear()}`;
    }

    /**
     * @hidden
     */
    public yearTracker(_: number, item: Date): string {
        return `${item.getFullYear()}}`;
    }

    /**
     * @hidden
     */
    protected initFormatter() {
        this._formatter = new Intl.DateTimeFormat(this._locale, {
            year: this.yearFormat,
        });
    }
}
