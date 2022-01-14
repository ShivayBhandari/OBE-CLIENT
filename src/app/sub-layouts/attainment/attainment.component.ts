import { Component, OnInit } from '@angular/core';

export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  children?: RouteInfo[];
}

export const ROUTES: RouteInfo[] = [
  { path: 'import-cia-marks', title: 'CIA Data Import', icon: 'import_export', class: '', children: [] },
  { path: 'import-tee-marks', title: 'TEE Data Import', icon: 'import_export', class: '', children: [] },
  { path: 'co-attainment', title: 'CO Attainment', icon: 'functions', class: '', children: [] },
  { path: 'po-attainment', title: 'PO/PSO Attainment', icon: 'functions', class: '', children: [] },
  { path: 'attainment-gap', title: 'Attainment Gap', icon: 'functions', class: '', children: [] },
];

@Component({
  selector: 'app-attainment',
  templateUrl: './attainment.component.html',
  styleUrls: ['./attainment.component.css']
})
export class AttainmentComponent implements OnInit {

  menuItems: RouteInfo[] | undefined;

  constructor() { }

  ngOnInit(): void {
    this.menuItems = ROUTES.map(e => e);
  }

}
