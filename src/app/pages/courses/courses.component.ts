import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {

  loader: boolean = false;

  constructor(
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
  }

  openCourseModal(modalRef: any): void {
    this.modalService.open(modalRef, {
      size: 'lg'
    });
  }
}
