import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {Observable, range} from 'rxjs';
import { map, filter, toArray } from 'rxjs/operators';


@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {
  @Input() offset: number; // current offset
  @Input() limit: number; // record per page
  @Input() size: number; // total records
  @Input() range: number = 3;


  @Output() pageChange: EventEmitter<any>;
  currentPage: number;
  totalPages: number;
  pages: Observable<number[]>;
  constructor() { 
    this.pageChange = new EventEmitter<any>()
  }

 ngOnInit() {
  this.getPages(this.offset, this.limit, this.size);
}

ngOnChanges() {
  this.getPages(this.offset, this.limit, this.size);
}


  getCurrentPage(offset: number, limit: number): number {
    return Math.floor(offset / limit) + 1;
  }

  getTotalPages(limit: number, size: number): number {
   return Math.ceil(Math.max(size, 1) / Math.max(limit, 1));
  }

//   getPages(offset: number, limit: number, size: number) {
//     this.currentPage = this.getCurrentPage(offset, limit);
//     this.totalPages = this.getTotalPages(limit, size);
//     this.pages =  Observable.range(-this.range, this.range * 2 + 1)
//       .map(offset => this.currentPage + offset)
//       .filter(page => this.isValidPageNumber(page, this.totalPages))
//       .toArray();
//   }

  getPages(offset: number, limit: number, size: number) {
    this.currentPage = this.getCurrentPage(offset, limit);
    this.totalPages = this.getTotalPages(limit, size);
    this.pages = range(-this.range, this.range * 2 + 1).pipe(
      map(offset => this.currentPage + offset),
      filter(page => this.isValidPageNumber(page, this.totalPages)),
      toArray()
    )
    //.subscribe(pages => this.pages = pages);
  }


  isValidPageNumber(page: number, totalPages: number): boolean {
  return page > 0 && page <= totalPages;
}

selectPage(page: number, event: any) {
  event.preventDefault();
  if (this.isValidPageNumber(page, this.totalPages)) {
    this.pageChange.emit((page - 1) * this.limit);
  }
}

cancelEvent(event) {
  event.preventDefault();
}

}