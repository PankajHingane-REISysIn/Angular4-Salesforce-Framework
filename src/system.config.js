(function(global) {

    // map tells the System loader where to look for things
    var map= {
      // our app is within the app folder
      app: '',
//      'ng-lightning/ng-lightning': 'node_modules/ng-lightning/bundles/ng-lightning.umd.js',

      // angular bundles
      '@angular/core': 'node_modules/@angular/core/bundles/core.umd.js',
      '@angular/common': 'node_modules/@angular/common/bundles/common.umd.js',
      '@angular/compiler': 'node_modules/@angular/compiler/bundles/compiler.umd.js',
      '@angular/platform-browser': 'node_modules/@angular/platform-browser/bundles/platform-browser.umd.js',
      '@angular/platform-browser-dynamic': 'node_modules/@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
      '@angular/http': 'node_modules/@angular/http/bundles/http.umd.js',
      '@angular/router': 'node_modules/@angular/router/bundles/router.umd.js',
      '@angular/forms': 'node_modules/@angular/forms/bundles/forms.umd.js',

      // angular testing umd bundles
      /*'@angular/core/testing': 'node_modules/@angular/core/bundles/core-testing.umd.js',
      '@angular/common/testing': 'node_modules/@angular/common/bundles/common-testing.umd.js',
      '@angular/compiler/testing': 'node_modules/@angular/compiler/bundles/compiler-testing.umd.js',
      '@angular/platform-browser/testing': 'node_modules/@angular/platform-browser/bundles/platform-browser-testing.umd.js',
      '@angular/platform-browser-dynamic/testing': 'node_modules/@angular/platform-browser-dynamic/bundles/platform-browser-dynamic-testing.umd.js',
      '@angular/http/testing': 'node_modules/@angular/http/bundles/http-testing.umd.js',
      '@angular/router/testing': 'node_modules/@angular/router/bundles/router-testing.umd.js',
      '@angular/forms/testing': 'node_modules/@angular/forms/bundles/forms-testing.umd.js',*/

      // other libraries
      'rxjs': 'node_modules/rxjs',
      'jsforce': 'node_modules/jsforce/build/jsforce.min.js',
      //'jsforce' : 'https://github.com/PankajHingane-REISysIn/jsforce/blob/PankajHingane-REISysIn-patch-1/build/jsforce.min.js',
      //'tether': 'node_modules/tether/dist/js/tether.min.js',
      'tether': 'node_modules/tether/dist/js/tether.min.js',
      
      'moment': 'node_modules/moment/min/moment.min.js',
      'crypto-js': 'node_modules/crypto-js/crypto-js.js',
      'lodash': 'node_modules/lodash/lodash.min.js'

    };

    // packages tells the System loader how to load when no filename and/or no extension
    var packages= {
      app: {
        main: './main.js',
        defaultExtension: 'js'
      },
      rxjs: {
        defaultExtension: 'js' 
      },
      'ng-lightning': {
        defaultExtension: 'js'
      }
    };

    /*var packageNames = [
        '@angular/common',
        '@angular/compiler',
        '@angular/core',
        '@angular/http',
        '@angular/platform-browser',
        '@angular/platform-browser-dynamic',
        '@angular/router', // I still use "router-deprecated", haven't yet modified my code to use the new router that came with rc.0
        //'@angular/router-deprecated',
        '@angular/http',
        //'@angular/testing',
        //'@angular/upgrade'
    ];

    // add package entries for angular packages in the form '@angular/common': { main: 'index.js', defaultExtension: 'js' }
    packageNames.forEach(function(pkgName) {
        packages[pkgName] = { main: 'index.js', defaultExtension: 'js' };
    });*/

    var config = {
        map: map,
        packages: packages
    };

    // filterSystemConfig - index.html's chance to modify config before we register it.
    if (global.filterSystemConfig) { global.filterSystemConfig(config); }

    System.config(config);
})(this);