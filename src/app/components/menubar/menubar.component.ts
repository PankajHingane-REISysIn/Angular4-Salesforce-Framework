import { Component, OnInit } from '@angular/core';
import { SalesforceService } from '../../services/salesforce.service';
import { LoggerService } from '../../services/logger.service';
import {SalesforceResolver} from '../../resolves/salesforce.resolver';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
	moduleId: module.id,
  selector: 'app-menubar',
  templateUrl: 'menubar.component.html'
  //styleUrls: ['./menubar.component.css']
})
export class MenubarComponent implements OnInit {
	menuOptions = [];
  constructor(private sfdc: SalesforceService, private log: LoggerService, private route: ActivatedRoute, private router: Router) { 
    
  }

  ngOnInit() {
  	let isLocal =  (<any>window).local;
    
    if(isLocal != true) {
      this.getConfigData();
    }


  	
  }

  navigateTOMenu(layoutId) {
      console.log('layoutId----', layoutId);
      this.router.navigate(['view'], {relativeTo:this.route}); //, { queryParams: { layoutId: layoutId } }
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
