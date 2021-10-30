import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DEPARTMENTS, ROLES, TITLES } from 'src/app/models/constants';
import { User } from 'src/app/models/user';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  userForm: FormGroup | undefined;
  userList: User[] = [];

  updation: boolean = false;

  titles: any[] = [];
  departments: any[] = [];
  designations: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private httpClient: HttpClient,
    private modalService: NgbModal,
    private toast: ToastrService
  ) { }

  ngOnInit(): void { 
    this.titles = TITLES;
    this.departments = DEPARTMENTS;
    this.designations = ROLES    
  }

  initialisedForm(userObj?: User | undefined): void {
    if (userObj === undefined) this.updation = false; else this.updation = true;
    this.userForm = this.fb.group({
      _id: [userObj?._id || null],
      firstName: [userObj?.firstName || null],
      lastName: [userObj?.lastName || null],
      password: [userObj?.password || null],
      email: [userObj?.email || null],
      title: [userObj?.title || null],
      department: [userObj?.department || null],
      designation: [userObj?.designation || null],
      mobile: [userObj?.mobile || null],
      createdAt: [userObj?.createdAt || null],
      updatedAt: [userObj?.updatedAt || null],         
    });
  }

  openUserModal(modalRef: any, assessmentObj?: User | undefined) {
    this.initialisedForm(assessmentObj);
    this.modalService.open(modalRef, {
      size: 'lg',
      keyboard: false,
      backdrop: 'static'
    });
  }

}
