import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { WindowRef } from './windowRef';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { NotificationService } from './services/notification.service';

@Component({
    selector: 'menu',
    templateUrl: 'menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
    public isRegistered: Observable<boolean> = this.ns.isSubscribed();
    public isSafari: boolean = false;
    public subscribeText: Subject<string> = new ReplaySubject();
    public menuElements: MenuElement[] = [
        {link: '/', icon: 'home', text: 'Home'},
        {link: '/lazy', icon: 'free_breakfast', text: 'Lazy module'},
        {link: '/external', icon: 'call_merge', text: 'External module'},
        {link: 'https://github.com/maciejtreder/angular-universal-serverless', icon: 'code', text: 'Fork on github'},
        ];
    @Input('contextual')
    @HostBinding('class.contextual')
    public contextual: boolean = false;

    private _isRegistered: boolean;

    constructor(private ns: NotificationService, private window: WindowRef) {}

    public ngOnInit(): void {
        this.isSafari = !!this.window.nativeWindow['safari'];
        this.ns.isSubscribed().subscribe((registered: boolean) => {
            registered ? this.subscribeText.next('Unsubscribe from push') : this.subscribeText.next('Subscribe to push');
            this._isRegistered = registered;
        });
    }

    public isRegistrationAvailable(): Observable<boolean> {
        if (this.isSafari) {
            return this.ns.isSubscribed().map((registered) => !registered);
        } else if (this.ns.isPushAvailable()) {
            return Observable.of(true);
        }
        return Observable.of(false);
    }

    public toggleSubscription(): void {
        if (this._isRegistered) {
            this.ns.unsubscribeFromPush().subscribe();
        } else {
            this.ns.subscribeToPush().subscribe();
        }
    }
}

interface MenuElement {
    link: string;
    icon: string;
    text: string;
}
