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
////////////////////////////////////////////////////////////////////////////

 

    // http://blogs.msdn.com/b/davrous/archive/2011/07/21/html5-gaming-animating-sprites-in-canvas-with-easeljs.aspx
    // http://craftyjs.com/
    // http://code.createjs.com/
    // http://nokarma.org/2011/02/02/javascript-game-development-the-game-loop/index.html
    // http://jsfiddle.net/simurai/CGmCe/
STATIC_RETAIL_TAX = 0.25;
STATIC_BUILDDEFENSE_DELAY = 5000;
window.game_bounty_contract = null;

function globalGame(state, amount){
    if(!document.game_state){ document.game_state = {}; }
    if(state == "money"){
        if(!document.game_state.money){document.game_state.money = amount;}
        else{document.game_state.money = document.game_state.money + amount;}
        setTimeout(function(){updateDefenseVehicleMenu();}, 10);
    }
    if(state == "camps"){
        document.game_state.player_camps = [{id:"defend_base_camp", position:[64.137184,-21.854356], actor:"actor_defend_camp1", type:"defender", infowindow:"base camp"}, {id:"defend_base_camp_2", position:[64.133184,-21.824356], actor:"actor_defend_camp1", type:"defender", infowindow:"secondary base camp"}];
        return document.game_state.player_camps;
    }
    $("#player-money").html("$" + document.game_state.money);
}

function getAnyDefenseBaseCamp(){
    return mmgr.actors["defend_base_camp"];
}
function hideBender(){
    var bender = mmgr.actors["bender"];
    if(bender){
        bender.marker.closePopup();
    }
    bender.translate({lat:99999999999,lng:99999999999});
}
function toggleBender(options){
    var bender = mmgr.actors["bender"];
    if(!bender){
        bender = mmgr.createActor("bender", {
            className: "map_bender",
            latitude: options.position.lat,
            longitude: options.position.lng,
            type: undefined
        });
    }else{
        bender.translate(options.position);
    }
    if(window.game_bounty_contract){
        bender.setPopup("<a href='javascript:amgr.requestAction(\"contract_locate_source\", {})'>landing</a><br><a href='javascript:amgr.requestAction(\"contract_locate_target\", {})'>capture</a><br>");
    }else{
        bender.setPopup("Purchase these defence weapons<hr><div class='defense_placement_menu'></div>");
    }
    bender.show(true);
    bender.marker.openPopup();
    updateDefenseVehicleMenu();
    return bender;
}

function updateDefenseVehicleMenu(){
    var a, btn, label, html = "";
    for (var i in settings.vehicles){
        a = settings.vehicles[i];
        if ((a.type == "defender") && (a.properties.actor_type != "defend_camp")){
            label = a.properties.name+" price $"+a.properties.price_placing;
            if (document.game_state.money >= a.properties.price_placing){
                btn = "<a href='javascript:amgr.requestAction(\"build_defend_actor\",{actor:\""+i+"\"})'>"+label+"</a><br>";
            }else{
                btn = label+"<br>";
            }
            html = html + btn;
        }
    }
    $(".defense_placement_menu").html(html);
}

function routeFetch(latlng1, latlng2){
    //mapquest api
    var mapquestkey = "Fmjtd%7Cluur296b25%2C7a%3Do5-90r55r";
    //var url = "http://www.mapquestapi.com/directions/v2/route?key="+mapquestkey+"&ambiguities=ignore&callback=handleRouteResponse&avoidTimedConditions=false&outFormat=json&routeType=fastest&enhancedNarrative=false&shapeFormat=raw&generalize=0&locale=en_US&unit=k&from=64.13543584028008,-21.896068453788757&to=64.13233584028008,-21.896368453788757"
    var url = "http://www.mapquestapi.com/directions/v2/route?key=Fmjtd%7Cluur296b25%2C7a%3Do5-90r55r&ambiguities=ignore&avoidTimedConditions=false&outFormat=json&routeType=fastest&enhancedNarrative=false&shapeFormat=raw&generalize=0&locale=en_US&unit=k&from="+latlng1[0]+","+latlng1[1]+"&to="+latlng2[0]+","+latlng2[1];
    $.getJSON(url, function(data){
        window.path = [];
        var shape = data.route.shape.shapePoints;
        for (var i = 0; i < shape.length; i = i + 2){
            path.push({
                latlng:{
                    lat:shape[i],
                    lng:shape[i+1]
                }
            });
        }
        mmgr.createPath("route", path);  //draw the path
    });
}

function showMessage(msg, timeout){
    $("#label_message").html(msg);
    setTimeout(function(){
        $("#label_message").html("");
    }, timeout);
}

function setGameStatusMessage (msg){
    $("#label_status").html(msg);
}

function getBountyList(){
    var bounty1 = {"hunter":{"name":"NSA"}, "reward":10000, "cost": 1000, "distance": 1000};
    bounty1.route = [{"latlng":{"lat":64.135185,"lng":-21.895694}},{"latlng":{"lat":64.134963,"lng":-21.894384}},{"latlng":{"lat":64.134941,"lng":-21.89426}},{"latlng":{"lat":64.134941,"lng":-21.89426}},{"latlng":{"lat":64.135452,"lng":-21.893831}},{"latlng":{"lat":64.135597,"lng":-21.893711}},{"latlng":{"lat":64.135597,"lng":-21.893711}},{"latlng":{"lat":64.135437,"lng":-21.892629}},{"latlng":{"lat":64.135406,"lng":-21.892339}},{"latlng":{"lat":64.135391,"lng":-21.891687}},{"latlng":{"lat":64.135452,"lng":-21.890823}},{"latlng":{"lat":64.135452,"lng":-21.890823}},{"latlng":{"lat":64.135559,"lng":-21.890878}},{"latlng":{"lat":64.135726,"lng":-21.890932}},{"latlng":{"lat":64.135948,"lng":-21.890949}},{"latlng":{"lat":64.136047,"lng":-21.890941}},{"latlng":{"lat":64.136199,"lng":-21.890892}},{"latlng":{"lat":64.136474,"lng":-21.890739}},{"latlng":{"lat":64.136672,"lng":-21.890544}},{"latlng":{"lat":64.136848,"lng":-21.890325}},{"latlng":{"lat":64.13713,"lng":-21.889888}},{"latlng":{"lat":64.137359,"lng":-21.889425}},{"latlng":{"lat":64.137474,"lng":-21.889213}},{"latlng":{"lat":64.137474,"lng":-21.889213}},{"latlng":{"lat":64.137664,"lng":-21.890047}},{"latlng":{"lat":64.13771,"lng":-21.890331}},{"latlng":{"lat":64.138031,"lng":-21.892316}},{"latlng":{"lat":64.138137,"lng":-21.89298}},{"latlng":{"lat":64.138137,"lng":-21.89298}},{"latlng":{"lat":64.138275,"lng":-21.893329}},{"latlng":{"lat":64.138359,"lng":-21.893493}},{"latlng":{"lat":64.138412,"lng":-21.893531}},{"latlng":{"lat":64.138473,"lng":-21.893552}},{"latlng":{"lat":64.138862,"lng":-21.893362}},{"latlng":{"lat":64.139518,"lng":-21.893119}},{"latlng":{"lat":64.139648,"lng":-21.893083}},{"latlng":{"lat":64.139648,"lng":-21.893083}},{"latlng":{"lat":64.139808,"lng":-21.892883}},{"latlng":{"lat":64.139892,"lng":-21.892747}},{"latlng":{"lat":64.139945,"lng":-21.892599}},{"latlng":{"lat":64.139999,"lng":-21.89232}},{"latlng":{"lat":64.139991,"lng":-21.891937}},{"latlng":{"lat":64.14006,"lng":-21.890829}},{"latlng":{"lat":64.140174,"lng":-21.889238}},{"latlng":{"lat":64.140205,"lng":-21.888336}},{"latlng":{"lat":64.140205,"lng":-21.887376}},{"latlng":{"lat":64.140197,"lng":-21.885082}},{"latlng":{"lat":64.140174,"lng":-21.88467}},{"latlng":{"lat":64.140075,"lng":-21.883644}},{"latlng":{"lat":64.139953,"lng":-21.882896}},{"latlng":{"lat":64.139778,"lng":-21.882047}},{"latlng":{"lat":64.139541,"lng":-21.88116}},{"latlng":{"lat":64.139404,"lng":-21.880706}},{"latlng":{"lat":64.139106,"lng":-21.879892}},{"latlng":{"lat":64.138786,"lng":-21.87907}},{"latlng":{"lat":64.138626,"lng":-21.878732}},{"latlng":{"lat":64.138549,"lng":-21.878568}},{"latlng":{"lat":64.138465,"lng":-21.878383}},{"latlng":{"lat":64.138389,"lng":-21.878223}},{"latlng":{"lat":64.138221,"lng":-21.877853}},{"latlng":{"lat":64.137939,"lng":-21.877321}},{"latlng":{"lat":64.137893,"lng":-21.87722}},{"latlng":{"lat":64.136711,"lng":-21.875171}},{"latlng":{"lat":64.135986,"lng":-21.873899}},{"latlng":{"lat":64.13552,"lng":-21.873098}},{"latlng":{"lat":64.134552,"lng":-21.871431}},{"latlng":{"lat":64.1343,"lng":-21.871004}},{"latlng":{"lat":64.134246,"lng":-21.870908}},{"latlng":{"lat":64.134162,"lng":-21.870769}},{"latlng":{"lat":64.134094,"lng":-21.870645}},{"latlng":{"lat":64.133934,"lng":-21.870361}},{"latlng":{"lat":64.132965,"lng":-21.868671}},{"latlng":{"lat":64.132865,"lng":-21.868505}},{"latlng":{"lat":64.132865,"lng":-21.868505}},{"latlng":{"lat":64.132942,"lng":-21.868318}},{"latlng":{"lat":64.13298,"lng":-21.868202}},{"latlng":{"lat":64.133148,"lng":-21.867784}},{"latlng":{"lat":64.133193,"lng":-21.867664}},{"latlng":{"lat":64.133613,"lng":-21.866525}},{"latlng":{"lat":64.133872,"lng":-21.865819}},{"latlng":{"lat":64.134086,"lng":-21.865228}},{"latlng":{"lat":64.134201,"lng":-21.864923}},{"latlng":{"lat":64.13446,"lng":-21.864282}},{"latlng":{"lat":64.134605,"lng":-21.863979}},{"latlng":{"lat":64.134826,"lng":-21.863618}},{"latlng":{"lat":64.135131,"lng":-21.863229}},{"latlng":{"lat":64.135627,"lng":-21.86272}},{"latlng":{"lat":64.135864,"lng":-21.862472}},{"latlng":{"lat":64.136024,"lng":-21.862266}},{"latlng":{"lat":64.136207,"lng":-21.862007}},{"latlng":{"lat":64.136375,"lng":-21.861707}},{"latlng":{"lat":64.136566,"lng":-21.861324}},{"latlng":{"lat":64.136672,"lng":-21.861042}},{"latlng":{"lat":64.136764,"lng":-21.860811}},{"latlng":{"lat":64.136901,"lng":-21.860374}},{"latlng":{"lat":64.137046,"lng":-21.859855}},{"latlng":{"lat":64.1371,"lng":-21.859609}},{"latlng":{"lat":64.137191,"lng":-21.859214}},{"latlng":{"lat":64.137229,"lng":-21.858997}},{"latlng":{"lat":64.13739,"lng":-21.85815}},{"latlng":{"lat":64.137428,"lng":-21.85794}},{"latlng":{"lat":64.137428,"lng":-21.85794}},{"latlng":{"lat":64.137336,"lng":-21.857843}},{"latlng":{"lat":64.136177,"lng":-21.856685}},{"latlng":{"lat":64.136177,"lng":-21.856685}},{"latlng":{"lat":64.136375,"lng":-21.855171}},{"latlng":{"lat":64.136543,"lng":-21.853712}},{"latlng":{"lat":64.136543,"lng":-21.853712}},{"latlng":{"lat":64.137184,"lng":-21.854356}}];
    bounty1.target = [64.13701543201262,-21.854529082775116];
    bounty1.source = [64.13543584028008,-21.896068453788757];
    bounty1.waves = [
        [{actor:"attacker_chopper", delay:1000}],
        [{message:"Darnnit here is next wave in", delay:1000}, {actor:"attacker_chopper", delay:3000}, {actor:"attacker_tank2", delay:3000}]
    ];
    var bounty2 = {"hunter":{"name":"NSA"}, "reward": 1000, "cost": 100, "distance":100};
    bounty2.target = [64.1371,-21.854272];
    bounty2.source = [64.133407,-21.853879];
    bounty2.route = [{"latlng":{"lat":64.133407,"lng":-21.853879}},{"latlng":{"lat":64.133445,"lng":-21.853918}},{"latlng":{"lat":64.136177,"lng":-21.856685}},{"latlng":{"lat":64.136177,"lng":-21.856685}},{"latlng":{"lat":64.136375,"lng":-21.855171}},{"latlng":{"lat":64.136543,"lng":-21.853712}},{"latlng":{"lat":64.136543,"lng":-21.853712}},{"latlng":{"lat":64.1371,"lng":-21.854272}}];
    bounty2.waves = [
        [{message:"I will get you now", delay:1000}, {actor:"attacker_soldier1", delay:3000}, {actor:"attacker_soldier2", delay:3000}, {actor:"attacker_truck", delay:3000}, {actor:"attacker_tank1", delay:3000}, {actor:"attacker_tank2", delay:3000}, {actor:"attacker_chopper", delay:3000}],
        [{message:"I will get you now", delay:1000}, {actor:"attacker_soldier1", delay:200}, {actor:"attacker_soldier2", delay:100},{actor:"attacker_soldier1", delay:300}, {actor:"attacker_soldier2", delay:3000},{actor:"attacker_soldier1", delay:3000}, {actor:"attacker_soldier2", delay:3000}]

    ];
    return [bounty1, bounty2];
}

function getMostWantedList(){
    var p1 = {"level":10, "reward":100000, "picture":"https://graph.facebook.com/735946179/picture?type=large", "name": "Kjartan Akil Jónsson", "hometown":"Reykjavik, Iceland", "camps":[{"name":"base", "position":[64.13701543201262,-21.854529082775116]}]};
    var p2 = {"level":44, "reward":100000, "picture":"https://graph.facebook.com/753420134/picture?type=large", "name": "Tryggvi Hákonarsson", "hometown":"Reykjavik, Iceland", "camps":[{"name":"base", "position":[64.13301543201262,-21.151529082775116]}]};
    var p3 = {"level":23, "reward":100000, "picture":"https://graph.facebook.com/1089640449/picture?type=large", "name": "Halldór Gretar", "hometown":"Akureyri, Iceland", "camps":[{"name":"base", "position":[65.6838680000,-18.11045999999999]}]};
    
    return [p1,p2,p3];
}

function addEnemyBountyHunter(bounty, wave_index, hunter_index){
    var wave = bounty.waves[wave_index][hunter_index];
    if (wave.actor){
        amgr.requestAction("create_enemy_actor", {actor:wave.actor, attack:true, position:bounty.source});
    }
    if (wave.message){
        showMessage(wave.message, wave.delay);
    }
    hunter_index = hunter_index + 1;
    if (bounty.waves[wave_index].length > (hunter_index)){
        setTimeout(function() {addEnemyBountyHunter(bounty, wave_index, hunter_index);}, wave.delay);
    }
}

function getEnemyCount (){ return $('[id^="enemy_actor_"]').length; }

function initSettings (){
    var settings_string = startValues(); //localStorage.getItem("settings") || startValues();
    window.settings = JSON.parse(settings_string);
}

function game_logic(){
    //these functions go to server
    //idea is that the game developer implmenets all logic here

    initSettings();

    this.rotate_canon = function(param){
        console.info("calculate rotation of canon");
        return param;
    };
    
    this.create_actor = function(param){
        param.properties = param.properties || {};
        //set default values
        var param = $.extend(true, param, settings.vehicles[param.actor]);
        return param;
    }
}

function game_render(){
    //this functions go to clients
    //idea is that the game developer implmenets all vislals here
    this.rotate_canon = function(param){
        var a = mmgr.actors[param.id];
        var r = a.getShortestRotation(a.rotation["cockpit"], param.degrees)
        a.rotate(-a.rotation.undefined + r, {"layer":"cockpit", duration:param.duration, completed:param.completed});
    };
    
    this.create_route = function(param){
        amgr.render.route_start = param.source;
        routeFetch(param.source, param.target);
    };
    
    this.getPathPosition = function(index){
        if (index == "start"){
            return window.path[0].latlng;
        }
        if (index == "stop"){
            return window.path[window.path.length-1].latlng;
        }
    };
    
    this.buildDefendActorShow = function(param){
        var pathend = {lat:amgr.render.route_start[0], lng:amgr.render.route_start[1]}; 
        var ry = Math.floor(Math.random() * 2) ? 1: -1;
        var rx = Math.floor(Math.random() * 2) ? 1: -1;
        var position = {lat:pathend.lat+Math.random()*0.0008*rx, lng:pathend.lng+Math.random()*0.0008*ry};
        param.id = "defend_actor_" + parseInt(Math.random()*1000);
        param.position = [pathend.lat, pathend.lng];
        amgr.requestAction("create_defend_actor", param);
        setTimeout(function(){
            amgr.requestAction("move_to_position", {position:position, id:param.id});
        }, 1000);
    };
    
    this.build_actor = function(param){
        param.base_class = param.base_class || "actor_soldier1";
        amgr.render.buildDefendActorShow(param);
    };
    
    this.attack_route = function(param){
        var a = mmgr.actors[param.id];
        amgr.render.moveAlong(a, 0); //drive the tank along the path
    };
    
    this.move_to_position = function(param){
        var a = mmgr.actors[param.id];
        a.moveHalt();
        a.moveTo(param.position, {speed:100, completed:function(){
            console.info ("I rock!!");
        }});
    };

    this.create_actor = function(param){
        if (!param.id){ throw "Could not create actor because param.id was not set"; }
        var actor = mmgr.createActor(param.id, {
            className: "map_marker",
            latitude: param.position[0],
            longitude: param.position[1],
            type: param.type,
            base_class: param.base_class,
            actor_class: param.actor
        });
        actor.show(true);
        if (param.infowindow){
            actor.setPopup(param.infowindow);
        }
        if (param.properties){
            actor.setGameProperty(param.properties);
        }
        if (param.actor.indexOf("tank") != -1){ //if this is a tank lets add a canon
            actor.setLayer("cockpit", "<div class='canon'></div>");
        }
        if (param.actor.indexOf("chopper") != -1){ //if this is a tank lets add a canon
            actor.setLayer("rotor", "");
        }        
        actor.callback_collision_detected = function(enemy_actor){
            setTimeout(function(){
                amgr.requestAction("attack_enemy", {enemy:enemy_actor.id, defender:actor.id});
            }, 10);
        };
        actor.callback_collision_distant = function(enemy_actor){
            var a = enemy_actor;
            //a.rotate(0, {"layer":"cockpit", duration:3000});
        };
        actor.callback_property_changed = function(prop){
            var progressbar = $( "#" + actor.id + " .label");
            progress_bar_damage = (prop.damage_now/prop.damage_max);
            if (actor.type == "defender"){
                progress_bar_color = "red";
                progress_bar_damage = 1-progress_bar_damage;
                if(progress_bar_damage > 0.95){
                    progress_bar_color = "green";
                }
            }else{
                progress_bar_color = "green";
            }
            progressbar.progressbar({value: progress_bar_damage*100, label:"damage_now"});
            progressbarValue = progressbar.find( ".ui-progressbar-value" );
            progressbarValue.css({
              "background": progress_bar_color
            });
            if (prop.damage_now >= prop.damage_max){
                amgr.requestAction("destroy", {id:actor.id});
                globalGame("money", prop.price_corpse);
            }
        };
        actor.callback_removed = function(){
        };
        actor.callback_destroyed = function(actor){
            var prop = actor.getGameProperty();
            if (prop.actor_type == "defend_camp"){
                setGameStatusMessage("YOU LOOOOSE GAME OVER");
                return;
            }
            setTimeout(function(){
                if(getEnemyCount() == 0){ //start next wave
                    amgr.requestAction("next_wave", {wave_index:amgr.render.wave_index + 1});
                }                
            }, 1000);
        }
    };
    
    this.destroy = function(param){
        var a = mmgr.actors[param.id];
        if(a){a.destroy();}
    };
    
    this.build_defend_actor = function(param){
        if(!param.position){
            var p  = mmgr.actors["bender"].getPosition();
            param.position = [p.lat, p.lng];
        }
        var vehicle_settings = settings.vehicles[param.actor].properties;
        globalGame("money", vehicle_settings.price_placing*(-1));
        hideBender();
        setTimeout(function(){
            amgr.requestAction("create_defend_actor", param);
            smgr.play(vehicle_settings.placement_sound_complete);
        }, vehicle_settings.placement_duration);
        smgr.play(vehicle_settings.placement_sound);
    };
    
    this.upgrade_defend_actor = function(param){
        console.info("upgrade_defend_actor");
        var a = mmgr.actors[param.id];
    };
    
    this.repair_defend_actor = function(param){
        console.info("repair_defend_actor " + JSON.stringify(param));
        var a = mmgr.actors[param.id];
        var d = a.getGameProperty("damage_now");
        var cost_of_repair = d.price_reperation*d.damage_now;
        if(d > 0){
            globalGame("money", d*cost_of_repair);
            a.setGameProperty("damage_now", 0);
        }
    };
    
    this.sell_defend_actor = function(param){
        var a = mmgr.actors[param.id];
        var props = a.getGameProperty();
        var value = props.price_removing*(props.damage_now/props.damage_max);
        if (!props.damage_now){ value = props.price_removing; }
        a.destroy();
        globalGame("money", Math.floor(value*(1-STATIC_RETAIL_TAX)));
    };
    
    this.create_defend_actor = function(param){
        var actor_name = param.id || "defend_actor_" + parseInt(Math.random()*1000);
        var button_upgrade = "<a href='javascript:amgr.requestAction(\"upgrade_defend_actor\",{id:\"" + actor_name + "\",amount:1});'>upgrade</a>";
        var button_repair = "<a href='javascript:amgr.requestAction(\"repair_defend_actor\",{id:\"" + actor_name + "\",amount:1});'>repair</a>";
        var button_sell = "<a href='javascript:amgr.requestAction(\"sell_defend_actor\",{id:\"" + actor_name + "\"});'>sell</a>";
        param.id = actor_name;
        param.type = "defender";
        param.infowindow = "Here is info on defender. <br><br>"+button_upgrade+"<br>"+button_repair+"<br>"+button_sell;
        amgr.requestAction("create_actor", param);
    };
    
    this.create_enemy_actor = function(param){
        var actor_name = param.id || "enemy_actor_" + parseInt(Math.random()*1000);
        param.id = actor_name;
        param.type = "attacker";
        param.actor = param.actor;
        amgr.requestAction("create_actor", param);
        if(param.attack){
            setTimeout(function(){
                amgr.requestAction("attack_route", {id:actor_name});
            }, 1000);
            
        }
    };
    
    this.shoot_enemy = function(param){
        var e = mmgr.actors[param.enemy];
        var d = mmgr.actors[param.defender];
        var eprops = e.getGameProperty();
        var dprops = d.getGameProperty();
        layer = undefined; //base layer
        var rotation_duration = 1;
        var projectile = "rocket";
        if (dprops.actor_type == "tank"){ //game validation
            layer = "cockpit";
            rotation_duration = 1000;
            var projectile = "canon";
        }
        if (dprops.actor_type == "chopper"){ //game validation
            layer = undefined;
            rotation_duration = 2000;
            var projectile = "canon";
        }
        var r = d.getShortestRotation(d.rotation[layer], d.getBearingTo(e.getPosition()));
        d.rotate(-d.rotation.undefined + r + dprops.rotation_offset, {"layer":layer, duration:rotation_duration, completed:function(){
            e.setGameProperty("damage_now", dprops.weapon_damage, true);
            shootProjectile(e.getPosition(), d.getPosition(), projectile, dprops.weapon_sound);
        }});
    }
    
    this.attack_enemy = function(param){
        var e = mmgr.actors[param.enemy];
        var d = mmgr.actors[param.defender];
        if (e.type == d.type){ return; } //validation code
        amgr.requestAction("shoot_enemy", param)
    };    
    
    this.attack_list = function(param){
        $( "#dialog-modal-attack" ).dialog({
            height: 340,
            width: "75%",
            modal: true,
            buttons: {
              Close: function() {
                $(this).dialog("close");
              }
            }            
        });
        var attack, attack_list = getMostWantedList();
        var button, attack_html = "";
        for (var i in attack_list){
            attack = attack_list[i];
            button = "<a href='#' onclick='amgr.requestAction(\"load_contract\", {contract:"+i+"});'>details</a>";
            attack_html = attack_html + "Profile " + attack.name + "  " + button + "<br>";
        }
        $( "#dialog-modal-attack" ).html(attack_html);        
    };

    this.game_editor = function(param){
        document.location.href="editor.html";
    };
        
    this.game_moremoney = function(param){
        globalGame("money", 10);
    };
        
    this.contract_locate_source = function(param){
        var bender = mmgr.actors["bender"];
        game_bounty_contract.source = bender.getPosition();
        if(game_bounty_contract.source && game_bounty_contract.target){
            amgr.requestAction("create_route", {id:"contract", source:[game_bounty_contract.source.lat, game_bounty_contract.source.lng], target:[game_bounty_contract.target.lat, game_bounty_contract.target.lng]});
        }
    };

    this.contract_locate_target = function(param){
        var bender = mmgr.actors["bender"];
        game_bounty_contract.target = bender.getPosition();
        if(game_bounty_contract.source && game_bounty_contract.target){
            amgr.requestAction("create_route", {id:"contract", source:[game_bounty_contract.source.lat, game_bounty_contract.source.lng], target:[game_bounty_contract.target.lat, game_bounty_contract.target.lng]});
        }
    };

    this.bounty_list = function(param){
        $( "#dialog-modal-bounty" ).dialog({
            height: 340,
            width: "75%",
            modal: true,
            buttons: {
              Close: function() {
                $(this).dialog("close");
              }
            }
        });
        var bounty, bounty_list = getBountyList();
        var bounty_html = "";
        for (var i in bounty_list){
            bounty = bounty_list[i];
            bounty_html = bounty_html + "<br>Issued by: " + bounty.hunter.name + " reward $" + bounty.reward + " investing $" + bounty.cost + " distance " + bounty.distance + " meters. <a href='#' onclick='amgr.requestAction(\"load_bounty\", {bounty:"+i+"});'>defend</a><br><br>";
        }
        $( "#dialog-modal-bounty" ).html(bounty_html);
    };
    
    this.next_wave = function(param){
        console.info(param);
        param.bounty = param.bounty || getBountyList()[window.bounty_index];
        if (param.wave_index >= param.bounty.waves.length){
            if (getEnemyCount() === 0){
                setTimeout(function(){ //need this timeout since I loosing game is called first then this is called
                    if (getAnyDefenseBaseCamp()){
                        setGameStatusMessage("WON THE GAME!!");
                    }
                }, 1000);
            }
        }else{
            addEnemyBountyHunter(param.bounty, param.wave_index, 0);
        }
        amgr.render.wave_index = param.wave_index;
    };

    this.load_contract = function(param){
        window.game_bounty_contract = {};
        $("#dialog-modal-attack").dialog("close");
        var contract = getMostWantedList()[param.contract];
        $("#dialog-modal-contract").dialog({
            width: "55%",
            buttons: {
              Capture: function() {
                $(this).dialog("close");
              },
              Close: function() {
                amgr.requestAction("attack_list");
                $(this).dialog("close");
              }
            }
        });
        $("#dialog-modal-contract-content").html("Most wanted" + contract.name+"<br><br>Here is a tutorial and step by step instruction on how to go about adding contract on friend. Perhaps computer adds RPC along the path for simulation.");
    };

    this.load_bounty = function(param){
        window.game_bounty_contract = null;
        var actor, i, bounty = getBountyList()[param.bounty];
        window.bounty_index = param.bounty;
        window.path = bounty.route;
        mmgr.createPath("route", bounty.route);
        //amgr.requestAction("create_route", {id:"attack_route", stop:[64.13701543201262,-21.854529082775116], start:[64.13543584028008,-21.896068453788757]});
        amgr.requestAction("create_actor", {actor:"actor_enemy_camp1", id:"enemy_base_camp", position:bounty.source});
        amgr.render.wave_index = 0;
        amgr.requestAction("next_wave", {bounty:bounty, wave_index:0});
        try{$("#dialog-modal-bounty").dialog("close");}catch(e){}
    };
    
    this.load_scene = function(param){
        amgr.requestAction("display_toolbar", {});
        globalGame("money", settings.economy.budget);
        //place player camps
        var player_camps = globalGame("camps");
        for (var i in player_camps){
            amgr.requestAction("create_actor", player_camps[i]);
        }
        /*
        setTimeout(function(){
            amgr.requestAction("load_bounty", {bounty:0});
        }, 1000);
        */
    };

    this.display_toolbar = function(param){
        mmgr.setLegend({
            element_id:"legend-content",
            position: 'topright'
        }, function(){
            $("#bounty-list").click(function(){
                amgr.requestAction("bounty_list", {});
            });
            $("#attack-list").click(function(){
                amgr.requestAction("attack_list", {});
            });
            $("#game-edit").click(function(){
                amgr.requestAction("game_editor", {});
            });
            $("#game-cash").click(function(){
                amgr.requestAction("game_moremoney", {});
            });
            $("#map-zoom-attack").click(function(){
                mmgr.viewActors("attacker");
            });
            $("#map-zoom-defend").click(function(){
                mmgr.viewActors("defender");
            });

        });
    };
        
    this.moveAlong = function(actor, i, options){
        //handles walking along a path
        //rotation_transition, rotation_speed, transition_speed    
        var self = this;
        if (i > window.path.length){ return; }
        var step = window.path[i];
        if (!step){ return; }
        //handles rotation of the object towards the goal
        var props = actor.getGameProperty();
        var meters = actor.distanceTo(step.latlng);
        if (meters <= 0){ amgr.render.moveAlong(actor, i+1, options); return; }
        var duration = (props.transition_speed || 100) * meters; //ms * meters
        if (props.rotation_transition){
            actor.rotateTo(step.latlng, {duration:(props.rotation_speed || 1000), completed:function(){
                actor.translate(step.latlng, {duration:duration, completed:function(){
                    amgr.render.moveAlong(actor, i+1, options);
                }});
            }});
        }else{ //will stop actor and continue moving when rotation stopped (for tanks and choppers)
            actor.rotateTo(step.latlng, {duration:(props.rotation_speed || 1000), completed:function(){
                actor.translate(step.latlng, {duration:duration, completed:function(){
                    amgr.render.moveAlong(actor, i+1, options);
                }});
            }});
        }
    };
}
function shootProjectile (a, b, projectile, sound){
    smgr.play(sound);
}
function rotateActorTowardsTarget(){
    //enumerate actors looking for moving ones.
    var i, j, a, t;
    for (i in mmgr.actors){
        a = mmgr.actors[i];
        for (j in a.cds){
            t = a.cds[j];
            console.info(t.id + " targetting " + a.id);
        }
    }
    //for those moving we want to get the cds 
    //enumerate those cds making sure they orient towards our moving actor
}

window.smgr = {
    loadSounds: function(){
        lowLag.init({'debug':'both','urlPrefix':'media/sound/'    });
        lowLag.load(['gunshot1.ogg'],'gunshot1');
        lowLag.load(['gunshot2.ogg'],'gunshot2');
        lowLag.load(['gunshot5.ogg'],'gunshot5');
        lowLag.load(['helicopter_loop.ogg'],'helicopter_loop');
        lowLag.load(['jet_loop.ogg'],'jet_loop');

        //lowLag.loadSoundSM2ForReals('helicopter_loop.ogg', 'helicopter_loop');
        //lowLag.playSoundSM2('helicopter_loop', {loops:-1});

    },
    play: function(name){
        try{
            if(name){lowLag.play(name);}
        }catch(e){

        }
        
    }
};

amgr = new ActionManager(new game_logic(), new game_render(), function(){
    smgr.loadSounds();
    mmgr.loadScene();
    mmgr.map.on('click',
        function(e){
            
            //amgr.requestAction("move_to_position", {position:e.latlng, id:"mytank"});
            //amgr.requestAction("create_defend_actor", {position:e.latlng});
            toggleBender({position:e.latlng});
            console.info(JSON.stringify(e.latlng))
        }
    );
});

