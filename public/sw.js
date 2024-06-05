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
    
    let data = e.data ? e.data.json() : null; // Überprüfen, ob e.data null ist, bevor json() aufgerufen wird

    if (data === null) {
        data = {title: 'iMOVEx', body: 'Time for an activity!', icon: 'https://imovex.github.io/iMOVExLogo.ico', tag: 'thesis-activity'};
    }

    this.registration.showNotification(data.title, {
        body: data.body,
        icon: data.icon,
    });
});
