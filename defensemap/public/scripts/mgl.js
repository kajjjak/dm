/** Copyright 2012 kajjjak
 
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 
     http://www.apache.org/licenses/LICENSE-2.0
 
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

function MapActor(id, options){
    //Map Game Library Actor properties    
    /* create a fixed div id then setLayers of HTML using $.append() */
    this.base_class = options.base_class || "actor_base";
    var html = "\
    <div class='" + this.base_class + "' id='" + id + "'>\
        <div class='body'></div>\
        <div class='label'></div>\
    </div>";
    this.rotation = {undefined:0};
    this.id = id;
    this.properties = {};
    this.map = options.map;
    this.cds = {}; //collision list
    this.range_detection = options.range_detection || 30;
    this.type = options.type;
    this.marker = L.marker([
        options.latitude || 0,
        options.longitude || 0
    ], {
        icon: L.divIcon({
            className: options.className,
            html: html,
            iconSize: options.iconSize || [120, 120]
        })
    });
}; 

MapActor.prototype.destroy = function(){
    mmgr.map.removeLayer(this.marker);  
    if(mmgr.actors[this.id]){
        delete mmgr.actors[this.id];
    }
    if(this.callback_destroyed){this.callback_destroyed(this);}
};

MapActor.prototype.setPopup = function(html_content, options){
    /*
        https://www.mapbox.com/mapbox.js/example/v1.0.0/custom-marker-tooltip/
        Some options are
        -   closeButton: false
        -   minWidth:50
    */
    this.marker.bindPopup(html_content, options);
}

MapActor.prototype.setLabel = function(html){
    $("#" + this.id + " .label").html(html);
}

MapActor.prototype.setLayer = function(class_name, html){
    var body_name = "#" + this.id + " .body";
    var el_name = "#" + this.id + " .body ." + class_name;
    if(this.rotation[class_name] == undefined){
        $(body_name).append("<div class='" + class_name + "'>" + html + "</div>");
    }else{
        $(body_name).html(html);
    }
    
    this.rotation[class_name] = 0.0;
    return el_name;
};

MapActor.prototype.animate = function(){
    if(this.__animate){
        var p = this.__animate.translate.start;
        var t = this.__animate.translate.etime - this.__animate.translate.stime;
        var n = new Date().getTime();
        var d = (n-this.__animate.translate.stime)/t;
        this.translate([p[0] + (this.__animate.translate.delta[0]*d), p[1] + (this.__animate.translate.delta[1]*d)]);
        if (d >= 1.0){
            this.translate([p[0] + (this.__animate.translate.delta[0]*1), p[1] + (this.__animate.translate.delta[1]*1)]);
            if(this.__animate.translate.completed){ this.__animate.translate.completed(); }
            this.__animate = null;
        }
        this.runCollisionDetection(this.range_detection);
    }
};
MapActor.prototype.getGameProperty = function(attribute, value){
    if (!attribute){ return this.properties; }
    return this.properties[attribute];
};

MapActor.prototype.setGameProperty = function(attribute, value, delta){
    if(typeof(attribute)=="string"){
        if(!this.properties[attribute]){this.properties[attribute] = 0;}
        if(delta){this.properties[attribute] = this.properties[attribute] + value;}
        else{this.properties[attribute] = value;}
    }else{
        this.properties = attribute;
    }
    if(this.callback_property_changed){this.callback_property_changed(this.properties);}
};

MapActor.prototype.isMoving = function(){
    return this.__animate != undefined;
};

MapActor.prototype.show = function(b){
    if (b == undefined){ b = true; }
    if (b){this.marker.addTo(this.map); }
    else{this.marker.addTo(undefined);}
};

MapActor.prototype.getPosition = function(){
    return this.marker.getLatLng();  
};

MapActor.prototype.setPosition = function(p){
    this.translate(p);
};

MapActor.prototype.runCollisionDetection = function(distance, type){
    /*
        FIXME: optimize by estimating cd distance of actors not moving
    */
    var a, distance = distance || 30;
    var p = this.getPosition();
    if (distance <= 0){ return; } //collision distance is 0 (disabled)
    if (this.callback_collision_detected || this.callback_collision_distant){
        for (var i in mmgr.actors){
            a = mmgr.actors[i];
            if ((type != undefined) && (a.type != type)) { continue; }
            if (a.id != this.id){ //ignore self
                if (a.distanceTo(p) < distance){
                    if (!this.cds[a.id]){
                        this.cds[a.id] = a;
                        if (this.callback_collision_detected){this.callback_collision_detected(a);}
                        //if the other actor is not moving it is not doing any detection. lets help out and trigger a CD
                        if (!a.isMoving()){ if (a.callback_collision_detected){
                                var self = this;
                                var A = a;
                                setTimeout(function(){A.callback_collision_detected(self);}, 10);
                            }
                        }
                        //console.info("Collision detected between " + a.id + " and me " + this.id)
                    } 
                }else{
                    if (this.cds[a.id]){
                        delete this.cds[a.id];
                        if (this.callback_collision_distant){this.callback_collision_distant(a);}
                        //if the other actor is not moving it is not doing any detection. lets help out and trigger a CD
                        if(!a.isMoving()){if (a.callback_collision_distant){a.callback_collision_distant(this);}}
                        //console.info("Collision distant between " + a.id + " and me " + this.id)
                    }
                }
            }
        }
    }
};

MapActor.prototype.translate = function(latlng, options){
    options = options || {};
    if(options.duration){
        var p = this.getPosition();
        options.duration = options.duration || 10000;
        this.__animate = {
            translate:{
                stime: new Date().getTime(),
                etime: new Date().getTime() + options.duration,
                delta:[(latlng.lat-p.lat), (latlng.lng-p.lng)],
                start:[p.lat, p.lng],
                completed:options.completed
            }
        };
        this.animate();
    }else{
        this.marker.setLatLng(L.latLng(latlng));
        if(options.completed){
            options.completed();
        }
    }
};

MapActor.prototype.rotate = function(degrees, options){
    options = options || {};
    var layer_name = "#" + this.id + " .body";
    if(options.layer){ layer_name = layer_name + " ." + options.layer; }
    var element_id = "#" + this.id + layer_name;
    if(options.duration){
        $(element_id).animate({rotate: degrees+'deg'}, options.duration, options.completed);
    }else{
        $(element_id).animate({rotate: degrees+'deg'}, 0, options.completed);
    }
    //console.info("rrr ", options.layer, degrees, JSON.stringify(this.rotation))
    this.rotation[options.layer] = degrees; //save off each layer rotation (undefined is the body div)
};

MapActor.prototype.getBearingTo = function(latlng){
    var ab = this.marker.getLatLng();
    var cd = latlng;
    var p1 = new LatLon(ab.lat, ab.lng);
    var p2 = new LatLon(cd.lat, cd.lng);
    return p1.bearingTo(p2);
};

MapActor.prototype.getShortestRotation = function(from, to){
    var r = Math.abs(parseInt(to) - parseInt(from));
    if (r > 180) {return (to - 360);}
    return to;
};

MapActor.prototype.rotateTo = function(latlng, options){
    var d1 = this.getBearingTo(latlng); 
    this.rotate(this.getShortestRotation(this.rotation.undefined, d1), options);
};

MapActor.prototype.moveTo = function(latlng, options){
    var self = this;
    //handles rotation of the object towards the goal
    if (!options.duration){
        var dist = self.distanceTo(latlng);
        var speed = options.speed || 1;
        options.duration = (dist * (speed));
    }
    this.rotateTo(latlng, {duration: (options.rotation || 1000), completed:function(){
        self.translate(latlng, options);
    }});
};

MapActor.prototype.moveHalt = function(){
    if(this.__animate){
        if(this.__animate.translate.completed){ this.__animate.translate.completed(); }
    }
    this.__animate = null;
};

MapActor.prototype.distanceTo = function(dest){
    var from = this.getPosition();
    var a = new LatLon(from.lat, from.lng);
    var b = new LatLon(dest.lat, dest.lng);
    return a.distanceTo(b) * 1000;
};


function SceneManager(){
    if (!window.L){ throw "Mapbox library required"; }
    
    this.simulating = false;
    this.map = null;
    this.actors = {};
    this._tick_fps = {fps:30, interval:1000/30};
    
    this.init = function(map){
        if (!map){ throw "Mapbox map instance required"; }
        this.map = map;
    };


    this.viewActors = function(type){
        var arrayOfLatLngs = [];
        for (var i in this.actors){
            var a = this.actors[i];
            if(type){
                if (a.type == type){
                    arrayOfLatLngs.push(a.getPosition());
                }
            }else{
                arrayOfLatLngs.push(a.getPosition());
            }
        }
        var bounds = new L.LatLngBounds(arrayOfLatLngs);
        this.map.fitBounds(bounds);
    };


    this.createActor = function(id, options){
        options = options || {};
        options.map = options.map || this.map;
        if (!this.actors[id]){
            this.actors[id] = new MapActor(id, options);
        }else{//todo: overrite
            throw "Actor with this id already exists";
        }
        return this.actors[id];
    };
    
    this.createPath = function(id, path, options){
        //path should be a array with objects {latlng:{lat:x, lng:y}, ...}
        var line_points = [];
        for (var i = 0; i < path.length; i++){
            var p = path[i];
            line_points.push([p.latlng.lat, p.latlng.lng]);
        }
        // http://leafletjs.com/reference.html#polyline
        var polyline_options = {
            color: '#000'
        };
        L.polyline(line_points, polyline_options).addTo(this.map);
    };
    
    this.setLegend = function(options, callback_success){
        if(options.element_id){
            element_id = options.element_id;
            this.map.legendControl.addLegend(document.getElementById(element_id).innerHTML);
        }else{
            this.map.legendControl.addLegend(options.html);
        }
        this.map.legendControl.setPosition(options.position);
        if(callback_success){ callback_success(); }
    };
    
    this.getFPS = function(){
        return this._tick_fps.fps;
    };
    
    this.render = function(){
        var a, p, i;
        for (i in this.actors){
            a = this.actors[i];
            a.animate();
        }
    };
    
    this.enableSimulation = function(b){
        mmgr.simulating = b;
        if(b){
            this._tick_fps.then = undefined;
            mmgr.tickSimulation();
        }
    };

    this.tickSimulation = function(){
        if (mmgr.simulating){
            if(mmgr._tick_fps.then === undefined){ mmgr._tick_fps.then = Date.now(); }
            mmgr._tick_fps.now = Date.now();
            mmgr._tick_fps.delta = mmgr._tick_fps.now - mmgr._tick_fps.then;
            if (mmgr._tick_fps.delta > mmgr._tick_fps.interval){
                mmgr.render();
                mmgr._tick_fps.then = mmgr._tick_fps.now - (mmgr._tick_fps.delta % mmgr._tick_fps.interval);
            }
            window.requestAnimationFrame(mmgr.tickSimulation);
        }
    };
    
    this.loadScene = function(options){
        this.enableSimulation(true);
        return this.scene;
    };
    
}

function ActionManager(logic, render, callback_init){
    if ( arguments.callee._singletonInstance ){return arguments.callee._singletonInstance;}
    arguments.callee._singletonInstance = this;
    
    this.render = render;
    this.logic = logic;
    this.callback_init = callback_init;
    
    this.init = function(){
        this.callback_init();
    };

    this.requestAction = function(action, param){
        this.receaveAction(action, this.validateAction(action, param));
        //send the request to server as well
    };
    
    this.validateAction = function(action, param){
        //this is a helper function
        var fn = this.logic[action];
        if (fn){
            return fn(param);
        }else{
            //console.error("Validating action '"+action+"' failed because validation function was missing");
            return param;
        }
    };
    
    this.receaveAction = function(action, param){
        //this function is both called by clients and servers
        var fn = this.render[action];
        if (fn){ return fn(param); }
        else{
            console.error("Rendering action '"+action+"' failed because action function was missing");
            return param;
        }
    };
}

//initialize global variables
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;