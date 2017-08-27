import { Component, OnInit } from '@angular/core';
import { SalesforceService } from '../../services/salesforce.service';
import { LoggerService } from '../../services/logger.service';
import {INglDatatableSort, INglDatatableRowClick} from '../lightning/ng-lightning';



@Component({
  moduleId: module.id,
  selector: 'app-table',
  templateUrl: 'table.component.html'
  //styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  loading = true;
  constructor(private sfdc: SalesforceService, private log: LoggerService) { 
      this.sfdc.controller = 'ConfigTableController';
  }

  ngOnInit() {
      this.sfdc.execute('getTableData')
            .then((res) => {
               console.log('Got response', res);
               this.data = res[0].records;
               this.columnsInfo = res[0].columns;
               this.loading = false;
            }); 
  }

  
data = [];
columnsInfo = [];
  // Initial sort
  sort: INglDatatableSort = { key: 'rank', order: 'asc' };

  // Show loading overlay
  

  // Toggle name column
  hideName = false;

  // Custom sort function
  onSort($event: INglDatatableSort) {
    const { key, order } = $event;
    this.data.sort((a: any, b: any) => {
      return (key === 'rank' ? b[key] - a[key] : b[key].localeCompare(a[key])) * (order === 'desc' ? 1 : -1);
    });
  }

  toggleData() {
    //this.data = this.data ? null : DATA;
  }

  onRowClick($event: INglDatatableRowClick) {
    console.log('clicked row', $event.data);
  }

}
