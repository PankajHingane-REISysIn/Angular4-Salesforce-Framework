import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import { AppComponent } from './app.component';
import { TableComponent } from './components/table/table.component';
import { GridComponent } from './components/grid/grid.component';
import { MenubarComponent } from './components/menubar/menubar.component';
import { PageBlockComponent } from './components/page-block/page-block.component';
import { FieldComponent } from './components/field/field.component';
import {SalesforceService} from './services/salesforce.service';
import {LoggerService, LOG_LEVEL} from './services/logger.service';
import {SalesforceResolver} from './resolves/salesforce.resolver';
//import  { NglModule } from 'ng-lightning/ng-lightning';
import  { NglModule } from './components/lightning/ng-lightning';
import { LayoutComponent } from './components/layout/layout.component';



const appRoutes: Routes = [
	{
    path: '', 
    component: TableComponent,
    resolve: {
        sfdc: SalesforceResolver
    }
  },
	{
    path: 'view', 
    component: LayoutComponent,
    resolve: {
        sfdc: SalesforceResolver
    } 
  }
];

@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    GridComponent,
    MenubarComponent,
    PageBlockComponent,
    FieldComponent,
    LayoutComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NglModule.forRoot(/*{
      svgPath: 'app/assets'}*/),
    RouterModule.forRoot(appRoutes, { useHash: true })

  ],
  providers: [
        SalesforceService,
        LoggerService,
        SalesforceResolver
    ],
  bootstrap: [AppComponent]
})
export class AppModule { 
	constructor(private sfdc: SalesforceService, private log: LoggerService) {
        this.sfdc.controller = 'RemoteActionController';
        this.log.logLevel = LOG_LEVEL.ALL;
    }
}
