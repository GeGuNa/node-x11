var x11 = require('../lib/x11');

var xclient = x11.createClient();
var Exposure = x11.eventMask.Exposure;
var PointerMotion = x11.eventMask.PointerMotion;
var pts = [100, 1000, 10, 20, 10, 0, 0, 3];

var prevPoint;

xclient.on('connect', function(display) {
    var X = this;
    var root = display.screen[0].root;
    var white = display.screen[0].white_pixel;
    var black = display.screen[0].black_pixel;

    var wid = X.AllocID();
    X.CreateWindow(
       wid, root, 
       10, 10, 400, 300, 
       1, 1, 0,
       { 
           backgroundPixel: white, eventMask: Exposure|PointerMotion  
       }
    );
    X.MapWindow(wid);
  
    var gc = X.AllocID();
    X.CreateGC(gc, wid, { foreground: black, background: white } );
    
    X.on('event', function(ev) {
        if (ev.type == 12)
        {
            if (pts.length > 4)
                X.PolyLine(0, wid, gc, pts);
        } else if (ev.type == 6) {
            pts.push(ev.x);
            pts.push(ev.y);
            if (pts.length > 4)
                X.PolyLine(0, wid, gc, pts.slice(-4));
        }
    });

    X.on('error', function(e) {
        console.log(e);
    });
});
