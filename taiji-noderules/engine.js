var RuleEngine = require('node-rules');
var FactUtility = require('./sample_fact.json');
var Rules = require('./rules_cpu.js');

//format Json file to fact
var str = JSON.stringify(FactUtility);
var res = str.substring(1,str.length-1);
var tmp = JSON.parse(res);
var keys = Object.keys(tmp);
var facts= new Array();
var index = 0;
for(i in keys){
   if(keys[i]!="time"){
      var type = keys[i];
      var sub_array = tmp[keys[i]];
      for(j=0; j<sub_array.length; j++){
         for(var k in sub_array[j]){
            //key
            var name = k;
            //value
            var value = sub_array[j][k];
            var json_input = '{"type":"' + type + '","name":"' + name + '","useage":"' + value + '"}';
            result = JSON.parse(json_input);
            facts[index] = result;
            index++;
         }
      }
   }
}

//define the rules
var rules =  Rules.rules;
//initailize the rule engine
var R = new RuleEngine(rules);

// decode the json to get array of each item
for(var i=0; i < index; i++){
   var keys = Object.keys(facts[i])

   //get the fact value of each item
   switch(facts[i][keys[0]]){
      case "proccess time":
         //Now pass the fact on the rule engine for result
         facts[i][keys[2]] = parseInt(facts[i][keys[2]])/100;
         R.execute(facts[i], function(result){
            console.log("The recived para is process time");
            if(result.result){
               console.log(result);
               console.log(result.reason);
            }
            else{
               console.log(result);
               console.log(result.reason);
            }
         });
        break;
   }
}
