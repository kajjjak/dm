
function startValues (){
    var v = {};
    v['defaults'] = {
        base_class : '',
        type : '',
        range_detection : 30,
        properties:{
            actor_type : 'tank',
            name: "not set",
         damage_now : 0,
         damage_max : 4,
        weapon_damage : 1, weapon_sound : 'gunshot1',
         price_placing : 10, price_corpse : 2, price_building : 2, price_reperation : 2,
        price_removing : 0,
        rotation_offset : 0,
        rotation_transition : true,
        rotation_speed : 500,
        placement_duration: 1000, placement_sound: null, placement_sound_complete: null,
        transition_speed  : 100}
    };
    v['defender_tank1'] = {
        base_class : 'actor_tank1',
        type : 'defender',
        range_detection : 30,
        properties:{
            actor_type : 'tank',
            name: "Tiger tank",
         damage_now : 0,
         damage_max : 4,
        weapon_damage : 1, weapon_sound : 'gunshot1',
         price_placing : 10, price_corpse : 2, price_building : 2, price_reperation : 2,
        price_removing : 0,
        rotation_offset : 0,
        rotation_transition : true,
        rotation_speed : 500,
        placement_duration: 1000, placement_sound: null, placement_sound_complete: null,
        transition_speed  : 100}
    };   
    v['defender_canon1'] = {
        base_class : 'actor_canon1',
        type : 'defender',
        range_detection : 30,
        properties:{
            actor_type : 'canon',
            name: "Canon",
         damage_now : 0,
         damage_max : 4,
        weapon_damage : 1, weapon_sound : 'gunshot5',
        price_placing : 2, price_corpse : 0, price_building : 2, price_reperation : 1,
        price_removing : 0,
        rotation_offset : 0,
        rotation_transition : false,
        rotation_speed : 3000,
        placement_duration: 1000, placement_sound: null, placement_sound_complete: null,
        transition_speed  : 100}
    };        
    v['defender_canon2'] = {
        base_class : 'actor_canon2',
        type : 'defender',
        range_detection : 30,
        properties:{
            actor_type : 'canon',
            name: "Big canon",
         damage_now : 0,
         damage_max : 10,
        weapon_damage : 5, weapon_sound : 'gunshot5',
        price_placing : 5, price_corpse : 2, price_building : 2, price_reperation : 2,
        price_removing : 0,
        rotation_offset : 0,
        rotation_transition : false,
        rotation_speed : 5000,
        placement_duration: 1000, placement_sound: null, placement_sound_complete: null,
        transition_speed  : 100}
    };        

    v['attacker_tank1'] = {
        base_class : 'actor_tank1',
        type : 'attacker',
        range_detection : 30,
        properties:{
            actor_type : 'tank',
         damage_now : 0,
         damage_max : 4,
        weapon_damage : 1, weapon_sound : 'gunshot1',
         price_placing : 10, price_corpse : 2, price_building : 2, price_reperation : 2,
        price_removing : 0,
        rotation_offset : 0,
        rotation_transition : true,
        rotation_speed : 500,
        placement_duration: 1000, placement_sound: null, placement_sound_complete: null,
        transition_speed  : 100}
    }; 
    v['attacker_tank2'] = {
        base_class : 'actor_tank2',
        type : 'attacker',
        range_detection : 30,
        properties:{
            actor_type : 'tank',
         damage_now : 0,
         damage_max : 4,
        weapon_damage : 1, weapon_sound : 'gunshot1',
         price_placing : 10, price_corpse : 2, price_building : 2, price_reperation : 2,
        price_removing : 0,
        rotation_offset : 0,
        rotation_transition : true,
        rotation_speed : 500,
        placement_duration: 1000, placement_sound: null, placement_sound_complete: null,
        transition_speed  : 100}
    };  
    v['attacker_soldier1'] = {
        base_class : 'actor_soldier1',
        
        type : 'attacker',
        range_detection : 30,
        properties:{
            actor_type : 'soldier',
         damage_now : 0,
         damage_max : 4,
        weapon_damage : 1, weapon_sound : 'gunshot1',
         price_placing : 10, price_corpse : 2, price_building : 2, price_reperation : 2,
        price_removing : 0,
        rotation_offset : 0,
        rotation_transition : true,
        rotation_speed : 500,
        placement_duration: 1000, placement_sound: null, placement_sound_complete: null,
        transition_speed  : 100}
    };  
    v['attacker_soldier2'] = {
        base_class : 'actor_soldier2',
        
        type : 'attacker',
        range_detection : 30,
        properties:{
            actor_type : 'soldier',
         damage_now : 0,
         damage_max : 4,
        weapon_damage : 1, weapon_sound : 'gunshot1',
         price_placing : 10, price_corpse : 2, price_building : 2, price_reperation : 2,
        price_removing : 0,
        rotation_offset : 0,
        rotation_transition : true,
        rotation_speed : 500,
        placement_duration: 1000, placement_sound: null, placement_sound_complete: null,
        transition_speed  : 100}
    };      
    v['attacker_truck'] = {
        base_class : 'actor_soldier1',
        type : 'attacker',
        range_detection : 30,
        properties:{
            actor_type : 'soldier',
         damage_now : 0,
         damage_max : 4,
        weapon_damage : 1, weapon_sound : 'gunshot1',
         price_placing : 10, price_corpse : 2, price_building : 2, price_reperation : 2,
        price_removing : 0,
        rotation_offset : 0,
        rotation_transition : true,
        rotation_speed : 500,
        placement_duration: 1000, placement_sound: null, placement_sound_complete: null,
        transition_speed  : 100}
    };      
    v['attacker_chopper'] = {
        base_class : 'actor_chopper',
        type : 'attacker',
        range_detection : 30,
        properties:{
            actor_type : 'chopper',
         damage_now : 0,
         damage_max : 10,
        weapon_damage : 1, weapon_sound : 'gunshot2',
        price_placing : 10, price_corpse : 2, price_building : 2, price_reperation : 2,
        price_removing : 0,
        rotation_offset : 0,
        rotation_transition : true,
        rotation_speed : 500,
        placement_duration: 1000, placement_sound: null, placement_sound_complete: null,
        transition_speed  : 100}
    };          
    v['actor_defend_camp1'] = {
        base_class : 'actor_defend_camp1',
        type : 'defender',
        range_detection : 30,
        properties:{
            actor_type : 'defend_camp',
         damage_now : 0,
         damage_max : 4,
        weapon_damage : 999999999,
         price_placing : 10, price_corpse : 2, price_building : 2, price_reperation : 2,
        price_removing : 0,
        rotation_offset : 0,
        rotation_transition : true,
        rotation_speed : 500,
        placement_duration: 1000, placement_sound: null, placement_sound_complete: null,
        transition_speed  : 100}
    };        
    v['actor_enemy_camp1'] = {
        base_class : 'actor_enemy_camp1',
        type : 'attacker',
        range_detection : 30,
        properties:{
            actor_type : 'enemy_camp',
         damage_now : 0,
         damage_max : 9999999999,
        weapon_damage : 0,
         price_placing : 10, price_corpse : 2, price_building : 2, price_reperation : 2,
        price_removing : 0,
        rotation_offset : 0,
        rotation_transition : true,
        rotation_speed : 500,
        placement_duration: 1000, placement_sound: null, placement_sound_complete: null,
        transition_speed  : 100}
    };
    s = {
        vehicles:v,
        economy:{budget:10}
    };
    var strs = JSON.stringify(s);
    localStorage.setItem('settings', strs);
    return strs;
}