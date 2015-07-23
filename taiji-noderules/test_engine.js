var RuleEngine = require('node-rules');
var FactUtility = require('./sample_fact.json');

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
            //console.log(result);
            facts[index] = result;
            //console.log(facts[index]);
            index++;
         }
      }
   }
}

//define the rules
var rules = [{
   //the first rule
   "condition": function(R){
      R.when(this.useage < 0.7);
   },

   "consequence": function(R){
      this.result = false;
      this.reason = "The CPU used is less than 70%, it works well.(Maybe don't need to warn)\n";
      //if not matched, jump to next rule
      R.next();
   }
},{
   //the second rules
   "name": "warning1",
   "condition": function(R){
      R.when(this.useage >= 0.7 && this.useage < 0.9);
   },

   "consequence": function(R){
      this.result = false;
      this.reason = "The CPU used is between 70% and 90%\n";
      //if not matched, jump to next rule
      R.stop();
   }
},{
   //the third rules
   "name": "warning2",
   "condition": function(R){
      R.when(this.useage >= 0.9);
   },

   "consequence": function(R){
      this.result = false;
      this.reason = 'Warning!!! The CPU used is upper than 90%!';
      R.stop();//end of the matching work
   }
}
];

//initailize the rule engine
var R = new RuleEngine(rules)

console.log("--------RUN RUELS-----------");
// decode the json to get array of each item
for(var i=0; i < index; i++){
   var keys = Object.keys(facts[i])

   //get the fact value of each item
   switch(facts[i][keys[0]]){
      case "proccess time":
         //Now pass the fact on the rule engine for result
         facts[i][keys[2]] = parseInt(facts[i][keys[2]])/100;
         R.execute(facts[i], function(result){
            //console.log("The recived para is process time");
            if(result.result){
               console.log(result);
               console.log(result.reason);
            }
            else{
               console.log(result);
               console.log(result.reason);
            }
            //console.log(facts[i]);
         });
        break;
   }
}
