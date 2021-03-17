// imports
importScripts( 'assets/js/sw-utils.js' )

const STATIC_CACHE      = 'static-v2';
const DYNAMIC_CACHE     = 'dynamic-v1';
const INMUTABLE_CACHE   = 'inmutable-v1';

const APP_SHELL = [
    '/',
    '/index.html',
    '/assets/css/style.css',
    '/assets/img/favicon.ico',
    '/assets/img/avatars/hulk.jpg',
    '/assets/img/avatars/ironman.jpg',
    '/assets/img/avatars/spiderman.jpg',
    '/assets/img/avatars/thor.jpg',
    '/assets/img/avatars/wolverine.jpg',
    '/assets/js/app.js',
    '/assets/js/sw-utils.js'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'assets/css/animate.css',
    'assets/js/libs/jquery.js'
];

self.addEventListener( 'install', e => {
    const cacheStatic = caches.open( STATIC_CACHE )
        .then( cache => cache.addAll( APP_SHELL ) );
    
    const cacheInmutable = caches.open( INMUTABLE_CACHE )
        .then( cache => cache.addAll( APP_SHELL_INMUTABLE ) );

    e.waitUntil( Promise.all( [ cacheStatic, cacheInmutable ] ) );
} );

self.addEventListener( 'activate', e => {
    const resp = caches.keys()
        .then( keys => {
            keys.forEach( key => {
                if ( key !== STATIC_CACHE && key.includes( 'static' ) ) return caches.delete(key);
            } );
        } );
    e.waitUntil( resp );
} );

self.addEventListener('fetch', e => {
    const resp = caches.match( e.request )
        .then( resp => {
            if( resp ) {
                return resp;
            } else {
                return fetch( e.request )
                    .then( newResp => {
                        return actualizaCacheDinamico( DYNAMIC_CACHE, e.request, newResp );
                    } );
            }
        });
    e.respondWith( resp );
});