import { HttpClient } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { environment } from '../../environments/environment';
import { retry } from 'rxjs/operators';

@Injectable({ providedIn: 'root'})
export class TestService {
    private num = 2;
    constructor(private http: HttpClient) {
    }

    setMedia(path: string) {
      return path ? path : null;
    }

    getResultEntryAnalysis() {
        return this.http.get<any>(`http://localhost:5052/api/transition/ResultEntryAnalysis`)
            .pipe(retry(this.num));
    }

    updateAdminEmail(email: string, password: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/updateAdminEmail`, '', {params: {email: email, password: password}})
            .pipe(retry(this.num));
    }

    SumWeeklyTest(sessionId: string, term: string) {
        return this.http.post<any>(`${environment.apiUrl}/school/SumWeeklyTest`, '', {params: {sessionId: sessionId, term: term}})
            .pipe(retry(this.num));
    }
}