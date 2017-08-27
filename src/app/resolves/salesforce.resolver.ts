import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, Observer } from 'rxjs/Rx';
import { SalesforceService } from '../services/salesforce.service';
let jsforce = require('jsforce');

@Injectable()
export class SalesforceResolver implements Resolve<any> {
    
    constructor(private salesforceService: SalesforceService) {
        console.log('resolver constructor');
    }

    resolve(route: ActivatedRouteSnapshot): Observable<SalesforceService> {
        return this.resolveFunction();
    }

    resolveFunction() {
        console.log('into resolver', (<any>window)._sf);
        let sf = (<any>window)._sf
        return Observable.create((observer: Observer<SalesforceService>) => {
            console.log('Into observablr');
            if (this.salesforceService.conn) {
                console.log('First If');
                observer.next(this.salesforceService);
                observer.complete();
            } else if (sf.api) {
                console.log('Second If');
                this.salesforceService.conn = new jsforce.Connection({
                    sessionId: sf.api,
                    serverUrl: `${window.location.protocol}//${window.location.hostname}`
                });
                observer.next(this.salesforceService);
                observer.complete();
            } else if (sf.auth) {
                console.log('Third If');
                this.salesforceService.authenticate(sf.auth.login_url, sf.auth.username, sf.auth.password, sf.auth.oauth2)
                    .then((res) => {
                        console.log('Success-->>', res);
                        observer.next(this.salesforceService);
                        observer.complete();
                    }, (reason) => {
                        console.log('reason-->>', reason);
                        observer.error(reason);
                        observer.complete();
                    });
            }
        });
    }
}