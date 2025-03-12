import { Injectable} from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserData {
    private emodalcom = new Subject<boolean>();
    public emodal = this.emodalcom.asObservable();
    private loadercom = new Subject<boolean>();
    public loader = this.loadercom.asObservable();
    private loaderOnlycom = new Subject<boolean>();
    public loaderOnly = this.loaderOnlycom.asObservable();
    private appcover = new Subject<boolean>();
    public cover = this.appcover.asObservable();
    public head: any;
    public body: any;
    public loadingBody: any;

    public logEmodal(body: any, head: any) {
        this.head = head;
        this.body = body;
        this.emodalcom.next(true);
    }

    public loading(body: any) {
        this.loadingBody = body;
        this.loadercom.next(true);
    }

    public loadingOnly() {
        this.loaderOnlycom.next(true);
    }

    public togLoadingOnly() {
        this.loaderOnlycom.next(false);
    }

    public logCover(body?: any) {
      this.body = body;
      this.appcover.next(true);
    }

    public togEmodal() {
        this.emodalcom.next(false);
    }

    
}