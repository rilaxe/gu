import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, EMPTY, throwError } from 'rxjs';
import { catchError, retry} from 'rxjs/operators';

import { AuthenticationService, GenericService, UserData } from '../services';
import { Router} from '@angular/router';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService,
        private genk: GenericService,
        private userdat: UserData,
        private locate: Location,
        private router: Router) {
            
        }


    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(retry(0), catchError(err => {
            if (err.status === 401 || err.status === 403) {
                //this.authenticationService.logout();
                let returl = this.router.routerState.snapshot.url;
                this.authenticationService.logout();
                if (returl != "/") {
                    this.router.navigate(['/'], { queryParams: { returnUrl: returl }});
                }
                
                //this.router.navigate(['/' + this.genk.auth, 'login'], { queryParams: { returnUrl: returl } });
            }
            if (err.status === 400) {
                const head = 'An error occurred';
                Swal.fire({
                    icon: 'error',
                    title: 'An error occurred',
                    text: err.error.message,
                    showConfirmButton: false,
                    timer: 3000
                  });
                this.userdat.logEmodal(err.error.message, head);
                throwError;
            }
            throw err;
        }))
    }
}