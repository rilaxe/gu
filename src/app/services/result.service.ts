import { Injectable} from '@angular/core';

@Injectable({ providedIn: 'root'})
export class ResultService {
    localUrl: string;
    studentClassAverage = 0;
    

    constructor() { }


    // public get pageIndex(): number {
    //     return (this.selectedPage - 1) * this.sizePerPage;
    // }

    setMedia(path: string) {
      return path ? path : null;
    }
}