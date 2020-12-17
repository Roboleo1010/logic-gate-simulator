// importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.0.2/workbox-sw.js');

// const offlinePage = '/';
// /**
//  * Pages to cache
//  */
// workbox.routing.registerRoute('/*',
//     async ({ event }) => {
//         try {
//             return await workbox.strategies.staleWhileRevalidate({
//                 cacheName: 'cache-pages'
//             }).handle({ event });
//         } catch (error) {
//             return caches.match(offlinePage);
//         }
//     }
// );