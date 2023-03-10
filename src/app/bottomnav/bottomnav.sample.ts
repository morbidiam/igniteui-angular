import { AfterViewInit,
        Component,
        ElementRef,
        QueryList,
        Renderer2,
        ViewChildren } from '@angular/core';
import { IgxAvatarComponent } from '../../../projects/igniteui-angular/src/lib/avatar/avatar.component';
import { IgxRippleDirective } from '../../../projects/igniteui-angular/src/lib/directives/ripple/ripple.directive';
import { NgFor } from '@angular/common';
import { IgxListItemComponent } from '../../../projects/igniteui-angular/src/lib/list/list-item.component';
import { IgxListComponent, IgxListThumbnailDirective, IgxListLineTitleDirective, IgxListLineSubTitleDirective, IgxListActionDirective } from '../../../projects/igniteui-angular/src/lib/list/list.component';
import { IgxBottomNavContentComponent } from '../../../projects/igniteui-angular/src/lib/tabs/bottom-nav/bottom-nav-content.component';
import { IgxBottomNavHeaderIconDirective, IgxBottomNavHeaderLabelDirective } from '../../../projects/igniteui-angular/src/lib/tabs/bottom-nav/bottom-nav.directives';
import { IgxIconComponent } from '../../../projects/igniteui-angular/src/lib/icon/icon.component';
import { IgxBottomNavHeaderComponent } from '../../../projects/igniteui-angular/src/lib/tabs/bottom-nav/bottom-nav-header.component';
import { IgxBottomNavItemComponent } from '../../../projects/igniteui-angular/src/lib/tabs/bottom-nav/bottom-nav-item.component';
import { IgxBottomNavComponent } from '../../../projects/igniteui-angular/src/lib/tabs/bottom-nav/bottom-nav.component';

@Component({
    selector: 'app-bottomnav-sample',
    styleUrls: ['bottomnav.sample.scss'],
    templateUrl: 'bottomnav.sample.html',
    standalone: true,
    imports: [IgxBottomNavComponent, IgxBottomNavItemComponent, IgxBottomNavHeaderComponent, IgxIconComponent, IgxBottomNavHeaderIconDirective, IgxBottomNavHeaderLabelDirective, IgxBottomNavContentComponent, IgxListComponent, IgxListItemComponent, NgFor, IgxRippleDirective, IgxAvatarComponent, IgxListThumbnailDirective, IgxListLineTitleDirective, IgxListLineSubTitleDirective, IgxListActionDirective]
})
export class BottomNavSampleComponent implements AfterViewInit {
    @ViewChildren('tabbarEl')
    private tabbar: QueryList<ElementRef>;

    public options = {};

    public contacts = [{
        avatar: 'assets/images/avatar/1.jpg',
        favorite: true,
        key: '1',
        link: '#',
        phone: '770-504-2217',
        text: 'Terrance Orta'
    }, {
        avatar: 'assets/images/avatar/2.jpg',
        favorite: false,
        key: '2',
        link: '#',
        phone: '423-676-2869',
        text: 'Richard Mahoney'
    }, {
        avatar: 'assets/images/avatar/3.jpg',
        favorite: false,
        key: '3',
        link: '#',
        phone: '859-496-2817',
        text: 'Donna Price'
    }, {
        avatar: 'assets/images/avatar/4.jpg',
        favorite: false,
        key: '4',
        link: '#',
        phone: '901-747-3428',
        text: 'Lisa Landers'
    }, {
        avatar: 'assets/images/avatar/12.jpg',
        favorite: true,
        key: '5',
        link: '#',
        phone: '573-394-9254',
        text: 'Dorothy H. Spencer'
    }, {
        avatar: 'assets/images/avatar/13.jpg',
        favorite: false,
        key: '6',
        link: '#',
        phone: '323-668-1482',
        text: 'Stephanie May'
    }, {
        avatar: 'assets/images/avatar/14.jpg',
        favorite: false,
        key: '7',
        link: '#',
        phone: '401-661-3742',
        text: 'Marianne Taylor'
    }];

    constructor(private renderer: Renderer2) { }

    public ngAfterViewInit() {
        this.tabbar.map((e) => {
            const menubar = e.nativeElement.querySelector('.igx-bottom-nav__menu');
            this.renderer.setStyle(menubar, 'position', 'absolute');
        });
    }
}

@Component({
    selector: 'app-custom-content',
    templateUrl: 'template.html',
    standalone: true
})

export class CustomContentComponent {

}
