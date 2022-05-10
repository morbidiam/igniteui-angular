import { ChangeDetectorRef, Component, OnInit, Renderer2 } from '@angular/core';
import { IDragMoveEventArgs, IDropBaseEventArgs, IDropDroppedEventArgs } from 'igniteui-angular';

declare var $: any;

export interface thumbItem {
    id: string;
    name: string;
    src: string;
    checked: boolean;
    group: string;
    hide?: boolean;
}

export interface docGroup {
    id: string;
    name: string;
    thumbList: thumbItem[];
}

export enum Direction {
    UP = 1,
    DOWN = 2,
    LEFT = 3,
    RIGHT = 4
}

@Component({
    selector: 'app-drag-ghost-mobile',
    styleUrls: ['drag-ghost-mobile.sample.scss'],
    templateUrl: 'drag-ghost-mobile.sample.html'
})
export class DragGhostMobileComponent implements OnInit {
    public docGroupList: docGroup[];
    private dragObj;
    private dummyObj;
    private lastDragEnterGroup: string;
    private currentGroup: string;
    private currentArticle;
    private animationFrameId;
    private scrolling = false;
    private bond = false;
    private eventListener;

    constructor(private renderer: Renderer2, private cdr: ChangeDetectorRef) { }

    public ngOnInit(): void {
        this.docGroupList = [
            {
                id: 'group1',
                name: 'Group1',
                thumbList: [
                    { id: 'IMG-0101', name: 'Image1-1', src: 'image1.jpg', checked: false, group: "group1" },
                    { id: 'IMG-0102', name: 'Image1-2', src: 'image1.jpg', checked: false, group: "group1" },
                    { id: 'IMG-0103', name: 'Image1-3', src: 'image1.jpg', checked: false, group: "group1" },
                    { id: 'IMG-0104', name: 'Image1-4', src: 'image1.jpg', checked: false, group: "group1" },
                    { id: 'IMG-0105', name: 'Image1-5', src: 'image1.jpg', checked: false, group: "group1" },
                    { id: 'IMG-0106', name: 'Image1-6', src: 'image1.jpg', checked: false, group: "group1" }

                ]
            },
            {
                id: 'group2',
                name: 'Group2',
                thumbList: [
                    { id: 'IMG-0201', name: 'Image2-1', src: 'image2.jpg', checked: false, group: "group2" },
                    { id: 'IMG-0202', name: 'Image2-2', src: 'image2.jpg', checked: false, group: "group2" }
                ]
            },
            {
                id: 'group3',
                name: 'Group3',
                thumbList: [
                    { id: 'IMG-0301', name: 'Image3-1', src: 'image1.jpg', checked: false, group: "group3" },
                    { id: 'IMG-0302', name: 'Image3-2', src: 'image1.jpg', checked: false, group: "group3" },
                    { id: 'IMG-0303', name: 'Image3-3', src: 'image1.jpg', checked: false, group: "group3" }
                ]
            }

            ,
            {
                id: 'group4',
                name: 'Group4',
                thumbList: [
                    { id: 'IMG-0401', name: 'Image4-1', src: 'image1.jpg', checked: false, group: "group4" },
                    { id: 'IMG-0402', name: 'Image4-2', src: 'image1.jpg', checked: false, group: "group4" },
                    { id: 'IMG-0403', name: 'Image4-3', src: 'image1.jpg', checked: false, group: "group4" }
                ]
            }
            ,
            {
                id: 'group5',
                name: 'Group5',
                thumbList: [
                    { id: 'IMG-0501', name: 'Image5-1', src: 'image1.jpg', checked: false, group: "group5" },
                    { id: 'IMG-0502', name: 'Image5-2', src: 'image1.jpg', checked: false, group: "group5" },
                    { id: 'IMG-0503', name: 'Image5-3', src: 'image1.jpg', checked: false, group: "group5" }
                ]
            }
            ,
            {
                id: 'group6',
                name: 'Group6',
                thumbList: [
                    { id: 'IMG-0601', name: 'Image6-1', src: 'image1.jpg', checked: false, group: "group6" },
                    { id: 'IMG-0602', name: 'Image6-2', src: 'image1.jpg', checked: false, group: "group6" },
                    { id: 'IMG-0603', name: 'Image6-3', src: 'image1.jpg', checked: false, group: "group6" }
                ]
            }
        ]
    }

    public onStateContainerEnter(event: IDropBaseEventArgs) {
        // If we have entered another list container, we have to remove the 'dummy' object from the previous one
        if (this.currentGroup !== event.owner.element.nativeElement.id) {
            this.getDocGroup(this.currentGroup).thumbList = this.getDocGroup(this.currentGroup).thumbList.filter(
                item => item.id !== 'dummy'
            );
            // this.currentList = this.currentList.filter(
            //   item => item.id !== 'dummy'
            // );
            this.cdr.detectChanges();
            this.currentGroup = event.owner.element.nativeElement.id;
            this.dummyObj = null;
        }
        // Add the blue container hightlight when an item starts being dragged
        this.renderer.addClass(event.owner.element.nativeElement, 'active');
        this.currentArticle = event.owner.element.nativeElement;
    }

    public onStateContainerLeave(event: IDropBaseEventArgs) {
        // This event also gets raised when the user drags a task over another task tile.
        // That means we have to re-apply the 'active' class in the `onItemEnter` event handler
        this.renderer.removeClass(event.owner.element.nativeElement, 'active');
        this.currentArticle = null;
    }

    public dragStartHandler(event) {
        // We have to save the dragStartList so we could remove the dragged item from it later, when it gets dropped
        this.currentGroup = event.owner.element.nativeElement.dataset.group;
        this.lastDragEnterGroup = this.currentGroup;
        const group = this.getDocGroup(this.currentGroup);
        this.dragObj = group.thumbList.filter(
            elem => elem.id === event.owner.element.nativeElement.id
        )[0];
    }

    public dragEndHandler(event) {
        this.cleanInterval();
        window.removeEventListener('pointermove', this.eventListener);
        this.bond = false;
        this.docGroupList.forEach((group) => {
            group.thumbList = group.thumbList.filter(x => x.id !== 'dummy');
        })
        // this.toDoList = this.toDoList.filter(x => x.id !== 'dummy');
        // this.inProgressList = this.inProgressList.filter(x => x.id !== 'dummy');
        // this.doneList = this.doneList.filter(x => x.id !== 'dummy');
        if (this.dragObj) {
            this.dragObj.hide = false;
        }
    }

    public onItemEnter(event: IDropBaseEventArgs) {
        if (event.owner.element.nativeElement.id == "dummy") {
            return;
        }
        // Applying the container highlighting again
        const elem = document.getElementById(event.owner.element.nativeElement.dataset.group);
        // const group = event.owner.element.nativeElement.dataset.group;
        this.renderer.addClass(elem, 'active');

        const currentGroup = event.owner.element.nativeElement.dataset.group;
        const group = this.getDocGroup(currentGroup);

        const currentItemIndex = group.thumbList.findIndex(
            item => item.id === event.owner.element.nativeElement.id
        );
        // Checking if items in the same list are being reordered
        if (this.lastDragEnterGroup === currentGroup) {
            const draggedItemIndex = group.thumbList.findIndex(
                item => item.id === this.dragObj.id
            );
            this.swapTiles(draggedItemIndex, currentItemIndex, group.thumbList);
        } else {
            // We need a hidden dummy object that would make an empty space for the dragged element in the list
            if (!this.dummyObj) {
                this.dummyObj = {
                    id: 'dummy',
                    text: '',
                    group: event.owner.element.nativeElement.dataset.group
                };
                const newCurrentList = [
                    ...group.thumbList.slice(0, currentItemIndex),
                    this.dummyObj,
                    ...group.thumbList.slice(currentItemIndex)
                ];

                this.getDocGroup(currentGroup).thumbList = newCurrentList;
                this.cdr.detectChanges();
            } else {
                const dummyObjIndex = group.thumbList.findIndex(
                    item => item.id === 'dummy'
                );
                if (dummyObjIndex !== -1) {
                    this.swapTiles(dummyObjIndex, currentItemIndex, group.thumbList);
                }
            }
        }
    }

    public onItemLeave(event: IDropBaseEventArgs) {
        if (event.owner.element.nativeElement.id == "dummy") {
            return;
        }
        const elem = document.getElementById(event.owner.element.nativeElement.dataset.group);
        this.renderer.removeClass(elem, 'active');
    }

    public onItemDropped(event: IDropDroppedEventArgs) {
        const dropListState = event.owner.element.nativeElement.id;
        const dragListState = event.drag.element.nativeElement.dataset.group;
        let dropList = this.getDocGroup(dropListState).thumbList;
        let dragList = this.getDocGroup(dragListState).thumbList;
        const dummyItemIndex = dropList.findIndex(
            item => item.id === 'dummy'
        );
        if (dropListState !== dragListState) {
            // The group of the dragged object should be updated before inserting it in the dropped list
            this.dragObj.group = dropListState;
            this.getDocGroup(dragListState).thumbList = dragList.filter(
                item => item.id !== this.dragObj.id
            );
            // Check if there is a dummy item and replace it with the dragged one
            if (dummyItemIndex !== -1) {
                dropList.splice(dummyItemIndex, 1, this.dragObj);
            } else {
                dropList.push(this.dragObj);
            }
        }
        this.dragObj.hide = false;
        this.dragObj = null;
        // The default browser drag behavior should be cancelled
        event.cancel = true;
    }

    public delete(groupId: string, index: number) {
        for (let i = 0; i < this.docGroupList.length; i++) {
            if (this.docGroupList[i].id === groupId) {
                this.docGroupList[i].thumbList.splice(index, 1);
                break;
            }
        }
    }

    public dragMoveHandler(evt: IDragMoveEventArgs) {
        if (!this.bond) {
            window.addEventListener('pointermove', this.eventListener = (event) => {
                this.bond = true;

                const maxHeight = document.documentElement.offsetHeight;
                const maxWidth = document.documentElement.offsetWidth;

                if (event.pageY + 60 >= maxHeight || event.pageY <= 0 ||
                    event.pageX + 60 >= maxWidth || event.pageX <= 0) {
                    this.scrolling = false;
                    evt.cancel = true;
                    return;
                }

                const dir = this.getScrollingDirection(event.pageX, event.pageY);
                if (typeof dir !== 'undefined' && !this.scrolling) {
                    this.scrolling = true;
                    requestAnimationFrame(() => {
                        this.step(event, dir)
                    })
                } else {
                    if (this.scrolling) {
                        this.scrolling = false;
                    }
                }
            });
        }
    }

    public async step(evt: any, dir: Direction) {
        if (this.checkIfStoppedScrolling(dir, evt.pageX, evt.pageY) || !this.scrolling) {
            this.scrolling = false;
            return;
        }
        await this.customScroll(dir);
        requestAnimationFrame(() => {
            this.step(evt, dir);
        });
    }

    private customScroll(dir: Direction): Promise<void> {
        return new Promise((res) => {
            const scrollCoefX = (dir === Direction.LEFT || dir === Direction.RIGHT) ? this.determineHorizontalScrollCoef(dir) : 0;
            const scrollCoefY = (dir === Direction.UP || dir === Direction.DOWN) ? this.determineVerticalScrollCoef(dir) : 0;

            window.scrollBy({
                top: scrollCoefY,
                left: scrollCoefX
            });

            setTimeout(() => {
                res();
            }, 40);
        });
    }

    public droppedHandler(event) {
        const dropListState = event.owner.element.nativeElement.id;
        if (dropListState == "dummy") {
            const dragListState = event.drag.element.nativeElement.dataset.group;
            let parentGroup = event.owner.element.nativeElement.dataset.group;
            let dragList = this.getDocGroup(dragListState).thumbList;
            let dropList = this.getDocGroup(parentGroup).thumbList;
            const dummyItemIndex = dropList.findIndex(
                item => item.id === 'dummy'
            );

            if (dropListState !== dragListState) {
                // The group of the dragged object should be updated before inserting it in the dropped listf
                //this.dragObj.group = dropListState;
                this.dragObj.group = parentGroup;
                this.getDocGroup(dragListState).thumbList = dragList.filter(
                    item => item.id !== this.dragObj.id
                );

                // Check if there is a dummy item and replace it with the dragged one
                if (dummyItemIndex !== -1) {
                    dropList.splice(dummyItemIndex, 1, this.dragObj);
                } else {
                    dropList.push(this.dragObj);
                }
            }
            this.dragObj.hide = false;
            this.dragObj = null;
            // The default browser drag behavior should be cancelled
            event.cancel = true;
        }
    }

    private getDocGroup(id: string) {
        const groups = this.docGroupList.filter(elem => elem.id === id)
        return groups[0];
    }

    private swapTiles(currentIndex: number, targetIndex: number, itemList: thumbItem[]): void {
        const tempObj = itemList[currentIndex];
        itemList.splice(currentIndex, 1);
        itemList.splice(targetIndex, 0, tempObj);
        this.cdr.detectChanges();
    }

    private cleanInterval() {
        if (this.scrolling) {
            this.scrolling = false;
        }
    }

    private getScrollingDirection(eventPageX: number, eventPageY: number): Direction | undefined {
        const viewportHeight = document.documentElement.clientHeight + window.scrollY;
        const viewportWidth = document.documentElement.clientWidth + window.scrollX;

        if (eventPageY + 100 >= viewportHeight) {
            return Direction.DOWN;
        }

        if (eventPageY - 10 <= window.scrollY) {
            return Direction.UP;
        }

        if (eventPageX + 100 >= viewportWidth) {
            return Direction.RIGHT;
        }

        if (eventPageX - 10 <= 0) {
            return Direction.LEFT;
        }

        return undefined;
    }

    private checkIfStoppedScrolling(dir: Direction, pageX: number, pageY: number): boolean {
        const viewportHeight = document.documentElement.clientHeight + window.scrollY;
        const viewportWidth = document.documentElement.clientWidth + window.scrollX;

        switch (dir) {
            case Direction.DOWN:
                return pageY + 100 < viewportHeight;
            case Direction.UP:
                return pageY - 100 > window.scrollY;
            case Direction.LEFT:
                return pageX - 100 > window.scrollX;
            case Direction.RIGHT:
                return pageX + 100 < viewportWidth;
        }
    }

    private determineHorizontalScrollCoef(dir: Direction): number {
        const maxWidth = document.documentElement.offsetWidth;
        if (dir === Direction.RIGHT) {
            return document.documentElement.scrollLeft + 10 > maxWidth ? maxWidth - document.documentElement.scrollLeft : 10;
        }
        // left
        return document.documentElement.scrollLeft - 10 < 0 ? 0 - document.documentElement.scrollLeft : -10;
    }

    private determineVerticalScrollCoef(dir: Direction): number {
        const maxHeight = document.documentElement.offsetHeight;
        if (dir === Direction.DOWN) {
            return document.documentElement.scrollTop + 30 > maxHeight ? maxHeight - document.documentElement.scrollTop : 10;
        }
        // up
        return document.documentElement.scrollTop - 30 < 0 ? 0 - document.documentElement.scrollTop : -10;
    }
}
