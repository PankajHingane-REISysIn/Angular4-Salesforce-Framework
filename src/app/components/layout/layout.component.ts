import { Component, OnInit, OnDestroy } from '@angular/core';
import { SalesforceService } from '../../services/salesforce.service';
import { LoggerService } from '../../services/logger.service';
import { RouterModule, ActivatedRoute, Routes, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  
	moduleId: module.id,
  selector: 'app-layout',
  templateUrl: 'layout.component.html'
  //styleUrls: ['layout.component.css']
})
export class LayoutComponent implements OnInit, OnDestroy {
	layout = {};
	record = {};
  private recordId: String;
  private layoutId: String;
  private sub: Subscription;
  private queryParams;
  constructor(private sfdc: SalesforceService, private log: LoggerService, private route: ActivatedRoute) { 

    this.queryParams = this.route.snapshot.queryParams;

  }

  ngOnInit() {

    // assign the subscription to a variable so we can unsubscribe to prevent memory leaks
    /*this.sub = this.route.queryParams.subscribe((params: Params) => {
      this.recordId = params['layoutId'];
      this.layoutId = params['id'];
      console.log(this.recordId, this.layoutId);
    });*/
    this.layoutId = this.queryParams.layoutId;
    console.log('------this.queryParams---', this.queryParams);
  	this.sfdc.controller = 'ConfigLayoutController';
    if(this.layoutId == undefined) {
      this.layoutId = '';
    }
    if(this.recordId == undefined) {
      this.recordId = '';
    }
  	this.sfdc.execute('getRecordData' , { layoutId: this.layoutId, recordId: this.recordId })
            .then((res) => {
               console.log('Got response', res);
               this.layout = res[0].Metadata;
               this.record = res[0].Record;
               //this.menuOptions = res;
            }); 
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
