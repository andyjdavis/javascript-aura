
function drawRect(context, x, y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

//http://ejohn.org/blog/simple-javascript-inheritance/#postcomment
/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
 
  // The base Class implementation (does nothing)
  this.Class = function(){};
 
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
   
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
   
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
           
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
           
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
           
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
   
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
   
    // Populate our constructed prototype object
    Class.prototype = prototype;
   
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;
 
    // And make this class extendable
    Class.extend = arguments.callee;
   
    return Class;
  };
})();

Aura = Class.extend({
    init: function(pos, color, lifespan) {
        this.pos = pos;
        this.color = color;
        this.lifespan = lifespan;
        
        this.widthRadians = 0.2 * Math.PI;
        this.angle = (1/3) * Math.PI;
        this.age = 0;
    },
    update: function(dt) {
        this.angle -= 2*dt;
        this.age += dt;
        return this.age < this.lifespan;
    },
    draw: function(dt) {
        gContext.fillStyle = this.color;
        var h = gCanvas.width;
        
        var interval = Math.PI/2;
        for (var i = 0; i < 4; i++) {
            var drawAngle = this.angle + (interval*i)
            
            var x1 = h * Math.cos(drawAngle) + this.pos[0];
            var y1 = h * Math.sin(drawAngle) + this.pos[1]
            
            var x2 = h * Math.cos(drawAngle + this.widthRadians) + this.pos[0];
            var y2 = h * Math.sin(drawAngle + this.widthRadians) + this.pos[1];
            
            gContext.beginPath();  
            gContext.moveTo(this.pos[0], this.pos[1]);  
            gContext.lineTo(x1, y2);
            gContext.lineTo(x2, y2);  

            gContext.fill();
        }
    }
});

var gCanvas = document.getElementById('gamecanvas');
var gContext = gCanvas.getContext('2d');

function updateGame() {
    if (gAura) {
        if (!gAura.update(dt)) {
            gAura = null;
        }
    } else {
        var pos = [gCanvas.width*Math.random(), gCanvas.height*Math.random()];
        gAura = new Aura(pos, 'white', 5);
    }
}

function drawGame() {
    gContext.fillStyle = "black";
    gContext.fillRect(0 , 0, gCanvas.width, gCanvas.height);
    //context.clearRect(0, 0, canvas.width, canvas.height);
    
    if (gAura) {
        gAura.draw();
    }
}

var gOldTime = Date.now();
var gNewTime = null;

gAura = null;

//executed 60/second
var mainloop = function() {
    gNewtime = Date.now();
    dt = (gNewtime - gOldTime)/1000;
    gOldTime = gNewtime;
        
    updateGame();
    drawGame();
};

var ONE_FRAME_TIME = 1000 / 60; // 60 per second
setInterval( mainloop, ONE_FRAME_TIME );
