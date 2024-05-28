let cacheData ="appV1";
this.addEventListener("install",(event)=>{
    event.waitUntil(
        caches.open(cacheData).then((cache)=>{
            cache.addAll([
                '/static/js/bundle.js',
                '/index.html',
                '/manifest.json',
                '/iMOVExLogo.ico',                
                '/AppLogo.png',
                '/settings',
                '/schedule',
            ])
        })
    )
}) 

this.addEventListener("fetch", (event)=>{
    if(!navigator.onLine) 
    {
        event.respondWith(
            caches.match(event.request).then((resp)=>{
                if(resp)
                {
                    return resp;
                }
            })
        )
    }
})

this.addEventListener('push', (e) => {
    
    console.log(e.data);
    const data = e.data.json();    
    console.log(data);
    this.registration.showNotification(data.title, {
        body: data.body,
        icon: data.icon,
    });
});

// this.addEventListener('push', event => {  
//     event.waitUntil(
//       this.registration.showNotification('Fälliges Event')
//     );
// });