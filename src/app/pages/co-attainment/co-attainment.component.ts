import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-co-attainment',
  templateUrl: './co-attainment.component.html',
  styleUrls: ['./co-attainment.component.css']
})
export class CoAttainmentComponent implements OnInit {

  tempFile: any = null;

  title: string | undefined;

  constructor(
    private toast: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.title = this.router.url.replace('/', "").split("/")[1].split("-").map(e => e.toUpperCase()).join(" ");
  }


}
