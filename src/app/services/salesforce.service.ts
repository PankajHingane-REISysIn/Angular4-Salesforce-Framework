import { Injectable, NgZone } from '@angular/core';
import { Observable, Scheduler } from 'rxjs/Rx';

import { LoggerService, LOG_LEVEL } from './logger.service';

import { ISObject } from '../shared/sobjects';
import 'rxjs/add/operator/toPromise';

import * as _ from 'lodash';

let jsforce = require('jsforce');
import * as moment from 'moment';

export enum API {
	REST,
	VFR
}

export interface RemotingOptions {
	buffer?: boolean,
	escape?: boolean,
	timeout?: number
}

@Injectable()
export class SalesforceService {

	public conn: any;
	public useRest: boolean = ((location.hostname === "localhost" || location.hostname === "127.0.0.1") ? true : false);
	public apiVersion: string = '34.0'
	private restConnectionType: ['soap', 'oauth'];
	public oauth2: any;
	public controller: string;

	public beforeHook: (controller?: string, method?: string, params?: Object, api?: API) => boolean;
	public afterHook: (error?: string, result?: any) => void;

	get instanceUrl(): string {
		if (this.conn) {
			return this.conn.instanceUrl;
		} else {
			return window.location.origin;
		}
	}

	constructor(private _zone: NgZone, private log: LoggerService) {this.log.debug('contructor of salesforce.');}

	public authenticate(login_url: string,
		username: string,
		password: string,
		oauth2?: any): Promise<any> {
		if (!this.conn) {
			this.log.debug('Authenticating with jsforce.');
			this.conn = new jsforce.Connection({
				proxyUrl: (<any>window).local ? '/proxy/' : undefined
				/*
			  oauth2 : {
			      loginUrl : login_url,
			      clientId : '3MVG9d8..z.hDcPLVwfS0QEs5v6U5MmvUFvdRVPfJarZ3OzuX6XXVLVvPrl9Yzdq044pad_5Z6uUEqIDqMcbo',
			      clientSecret : '8982577371722460517',
			      redirectUri : 'localhost'
			    }*/
			});
				/*{
				loginUrl: login_url,
				version: this.apiVersion,
				proxyUrl: (<any>window).local ? '/proxy/' : undefined,
				//oauth2: oauth2
			});*/
			this.log.debug('username--------' + username);
			this.log.debug('password--------' + password);
			this.log.debug('this.conn --------', this.conn );
			return this.conn.login(username, password , function(err, userInfo) {
								  if (err) { return console.error(err); }
								  // Now you can get the access token and instance URL information.
								  // Save them to establish connection next time.
								  //console.log(this.conn.accessToken);
								  //console.log(this.conn.instanceUrl);
								  // logged in user property
								  console.log("User ID: " + userInfo.id);
								  console.log("Org ID: " + userInfo.organizationId);
								  // ...
								});
		} else {
			this.log.warn('Already authenticated. No need to reauth.');
			return new Promise<any>((resolve, reject) => {
				resolve(this.conn.userInfo);
			});
		}
	}

	/**
	 * @param  {string} controller 	        - The APEX controller to use
	 * @param  {string} method 				- The method to execute on the controller. To use
	 * 						     	          both REST and Visualforce Remoting the methods
	 * 						                  must be tagged with both `@RemoteAction` and `WebService`
	 * @param  {Object} params      		- Parameters to pass to the APEX method as an object with
	 * 							      		  the format `{ parameter_name: value }`
	 * @param  {RemotingOptions} vfrOptions	- An object containing options to pass to the Visualforce
	 * 										  remoting call. 
	 * @return {Promise<any>} 	 Returns a promise with the result or rejects with the
	 * 						     remoting exception. 
	 */
	public execute(method: string, params?: Object, vfrOptions?: RemotingOptions): Promise<any> {
		this.log.group('Executing method: ' + method, LOG_LEVEL.DEBUG);
		this.log.debug('Params:',params);
		this.log.debug('this.useRest:',this.useRest);

		let controller = this.controller;
		let p: Promise<any> = new Promise((resolve, reject) => {
			if (this.useRest) {
				this.log.debug('Using REST API');
				
				let beforeHookResult = this.runBeforeHook(controller, method, params, API.REST);
				this.log.debug('beforeHookResult:' , beforeHookResult);
				if (beforeHookResult) {

                    this._zone.runOutsideAngular(() => {
                        this.execute_rest(controller, method, params)
                            .then((res) => {
                                this.log.debug('Result: ', res);
                                resolve(res);
                                this.runAfterHook(null, res);
                            }, (reason) => {
                                this.log.error(reason);
                                reject(reason);
                                this.runAfterHook(reason, null);
                            })
                            .then(() => {
                                this._zone.run(() => {});
                            });
                    });
					
				} else {
					let reason = 'Before hook failed';
					reject(reason);
					this.runAfterHook(reason, null);
				}

			} else {
				this.log.debug('Using Visualforce Remoting');

				let beforeHookResult = this.runBeforeHook(controller, method, params, API.VFR);

				if (beforeHookResult) {
					let tmp = [];
					for (let i in params) {
						tmp.push(params[i]);
					}

                    this._zone.runOutsideAngular(() => {
                        this.execute_vfr(method, tmp, vfrOptions)
                                .then((res) => {
                                    this.log.debug('Result: ', res);
                                    resolve(res);
                                    this.runAfterHook(null, res);
                                }, (reason) => {
                                    this.log.error(reason);
                                    reject(reason);
                                    this.runAfterHook(reason, null);
                                })
                                .then(() => {
                                    this._zone.run(() => {});
                                });
                    });

				} else {
					let reason = 'Before hook failed';
					reject(reason);
					this.runAfterHook(null, reason);
				}
			}
		});

		this.log.groupEnd(LOG_LEVEL.DEBUG);
		return p;
	}

	public execute_rest(pkg: string, method: string, params: Object): Promise<any> {
		let self = this;
		console.log('self:', self);
		for (let key in params) {
			if (typeof(params[key]) === 'object' && !Array.isArray(params[key])) {
				params[key] = this.processSobject(params[key]);
			}
		}

		return new Promise((resolve, reject) => {
			console.log('self.conn:', self.conn);
			console.log('pkg:', pkg);
			console.log('method:', method);
			console.log('params:', params);
			
			self.conn.execute(pkg, method, params, null)
			//self.conn.apex.post(pkg, method, params, null)
				.then((res) => {
					res = this.parseResult(res);
					resolve(res);
				}, (reason) => {
					reject(reason);
				});
		});
	}

	private execute_vfr(method: string, params: Array<any>, config?: RemotingOptions): Promise<any> {
		// Set ctrl to the Visualforce Remoting controller
		let controller = this.controller;
		let ctrl: any = window[controller] || {};
		let self = this;

		config = config || { escape: false }

		// Make sure the controller has the method we're attempting to call
		if (ctrl.hasOwnProperty(method)) {

			let methodFunc = ctrl[method];
			let directCfg = methodFunc.directCfg;

			return new Promise((resolve, reject) => {
				// The wrong number of parameters were included
				if (params.length !== directCfg.method.len) {
					reject('Wrong number of parameters included');
					return;
				}

				let callback = function(res, err) {
					if (res) {
						res = self.parseResult(res);
						resolve(res);
					} else {
						reject(err.message);
					}
				}

				params.push(callback);
				params.push(config);
				ctrl[method].apply(null, params);
			});
		} else {
			return new Promise((resolve, reject) => {
				reject('The requested method does not exist on ' + controller);
			});
		}
	}

	public convertDate(date: string|number, dateTime: boolean = false): string|number {
		if (this.useRest) {
			if (dateTime) {
				return moment(date).toISOString();
			} else {
				return moment(date).format('YYYY-MM-DD');
			}
		} else {
			return moment(date).unix();
		}
	}

	private processSobject(obj: ISObject) {
		let nullables: string[] = [];
		let tmp: ISObject = JSON.parse(JSON.stringify(obj));
		for (let key in tmp) {
			if (!tmp[key]) {
				tmp[key] = undefined;
				nullables.push(key);
			}
		}
		tmp.fieldsToNull = nullables;
		return tmp;
	}

	private runBeforeHook(method: string, controller: string, params: Object, api: API): boolean {
		let beforeHookResult = true;
		this.log.debug('Executing before hook:', this.beforeHook);
		if (this.beforeHook) {
			this.log.debug('Executing before hook');
			beforeHookResult = this.beforeHook.apply(this, [controller, method, params, API.REST]);
			this.log.debug('Before hook completed with status: ', beforeHookResult);
		}
		return beforeHookResult;
	}

	private runAfterHook(error: string, result: any): void {
		this.log.debug('Executing after hook:', this.afterHook);
		if (this.afterHook) {
			this.log.debug('Executing after hook');
			this.afterHook.apply(this, [error, result]);
			this.log.debug('After hook completed');
		}
	}

	private parseResult(result: any): Array<Object> {
		if (!result) { return []; }
		result = this.stripNamespace(result);
		if (result.result) { result = result.result; }
		return this.arrayify(result);
	}

	private arrayify(obj: any): Array<any> {
		if (!Array.isArray(obj)) { return [obj]; }
		else { return obj; }
	}

	private normalizeType(val: any): any {

		let dateRegex = /[0-9]{2,4}-[0-9]{1,2}-[0-9]{1,2}/i;

		if (!isNaN(val)) {
			return +val;
		} else if (val == 'true' || val == 'false' || this.isJsonString(val)) {
			return JSON.parse(val);
		} else if (dateRegex.test(val)) {
			return Date.parse(val);
		} else {
			return val;
		}
	}

	private isJsonString(str) {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}
		return true;
	}

	private stripNamespace(obj: any): any {
		if (Array.isArray(obj)) {
			return obj.map((v) => {
				return this.stripNamespace(v);
			});
		} else if(typeof(obj) === 'object' && !Array.isArray(obj)) {
			if (obj.$ && obj.$['xsi:nil'] === 'true') {
		      return null;
		    } else {
		    	for (let i of Object.keys(obj)) {
		    		if (i.indexOf(':') > -1) {
		    			let t = i.substr(i.indexOf(":") + 1);
		    			obj[t] = this.stripNamespace(obj[i]);
		    			delete obj[i];
		    		} else if (i === '$') {
		    			delete obj[i];
		    		} else {
		    			obj[i] = this.stripNamespace(obj[i]);
		    		}
		    	}
		    	return obj;
		    }
		} else {
			return this.normalizeType(obj);
		}
	}
}

interface SOQL_ORDER {
	field: string,
	direction?: 'ASC' | 'DESC'
}