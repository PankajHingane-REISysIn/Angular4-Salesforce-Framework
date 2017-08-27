import { Component, OnInit } from '@angular/core';
import { SalesforceService } from '../../services/salesforce.service';
import { LoggerService } from '../../services/logger.service';
import {SalesforceResolver} from '../../resolves/salesforce.resolver';


@Component({
	moduleId: module.id,
  selector: 'app-menubar',
  templateUrl: 'menubar.component.html'
  //styleUrls: ['./menubar.component.css']
})
export class MenubarComponent implements OnInit {
	menuOptions = [];
  constructor(private sfdc: SalesforceService, private log: LoggerService) { 
  }

  ngOnInit() {
  	let isLocal =  (<any>window).local;
     if(isLocal != true) {
        this.getConfigData();
      }
  	
  }

  getConfigData() {
     
       let class1Instance = new SalesforceResolver(this.sfdc);
        class1Instance.resolveFunction().subscribe();
        this.sfdc.controller = 'ConfigMenuController';
        this.sfdc.execute('getMenuOption')
                .then((res) => {
                   console.log('Got response', res);
                   this.menuOptions = res;
                }); 
    
  }

  	delay(ms: number) {
    	return new Promise(resolve => setTimeout(resolve, ms));
	}

}
