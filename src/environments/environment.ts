// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyDRiHrFLubf7mqQoykAl216RPOh4lnzGP0',
    authDomain: 'confidu-app.firebaseapp.com',
    databaseURL: 'https://confidu-app.firebaseio.com',
    projectId: 'confidu-app',
    storageBucket: 'confidu-app.appspot.com',
    messagingSenderId: '944987547095',
    appId: '1:944987547095:web:73f32524698d702a0f1792',
    measurementId: 'G-XZB7VR6BZ3',
    vapidKey: 'BMqCmorVeDKwwwQzRVEVSXU5UVnWkzZfB1k-cMr6acpoIhjJ3Q3S8c-VC_PDZtr7VUj_PW6Mev4ucRs6t50YCe4'
  },
  logo: '../assets/icons/logo_confid.svg',
  baseUrl: 'https://confidu-proxy-develop-dot-confidu-app.appspot.com',
  homeButton: '../../assets/icons/home-button.svg',
  iconPath: '../assets/icons',
  shopware: {
    accessKey: 'SWSCTEPMOXFBVKO1BKPDDEJQCA'
  },
  storefrontUrl: 'https://confidu-app.firebaseapp.com'
};

// baseUrl: 'https://confidu-proxy-dot-confidu-app.appspot.com',

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
