import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError} from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from '../_models';
import { UserData } from './user.service';
//import * as CryptoJS from 'crypto-js';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    private num = 2;
    public code = '6x0x5x1x';
    public isLoggedIn: boolean;

    Email: string;
    myPassword: string;
    myConfirmPassword: string;
    name = '';
    surname = '';
    gender = 'Male';
    loading = false;
    submitted = false;


    constructor(private http: HttpClient, private userdat: UserData) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }


    login(username: string, password: string, schoolId: number) {
        return this.http.post<any>(`${environment.apiUrl}/account/login`, { email: username, password: password, schoolId: schoolId})
            .pipe(retry(this.num), map(user => {
                if (user.code === 1) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    localStorage.setItem('iden', user.id);
                    this.currentUserSubject.next(user);
                    this.isLoggedIn = true;
                    return user;
                }
                return user;
            }));
    }

    loginStudent(username: string, password: string, schoolId: number) {
        return this.http.post<any>(`${environment.apiUrl}/account/loginStudent`, { email: username, password: password, schoolId: schoolId})
            .pipe(retry(this.num), map(user => {
                if (user.code === 1) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    localStorage.setItem('iden', user.id);
                    this.currentUserSubject.next(user);
                    this.isLoggedIn = true;
                    return user;
                }
                return user;
            }));
    }

    register(solids: any) {
        return this.http.post<any>(`${environment.apiUrl}/account/register`, solids)
            .pipe(retry(this.num), 
            map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
            }), 
            catchError(err => {
                return throwError(err);
            }
        ));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        localStorage.removeItem('iden');
        this.currentUserSubject.next(null);
        this.isLoggedIn = false;
    }

    getData() {
        return this.http.get<any>(`${environment.apiUrl}/account/getData`)
            .pipe(retry(this.num));
    }

    createSchool(school: any) {
        let met = `${environment.apiUrl}/account/registerSchool/` + school
        return this.http.post<any>(`${environment.apiUrl}/account/registerSchool`, school)
            .pipe(retry(this.num));
    }

    savePersonalInfo(student: any) {
        return this.http.post<any>(`${environment.apiUrl}/school/registerStudent`, student)
            .pipe(retry(this.num));
    }

    

    saveStaff(staff: any) {
        return this.http.post<any>(`${environment.apiUrl}/school/registerStaff`, staff)
            .pipe(retry(this.num));
    }
}