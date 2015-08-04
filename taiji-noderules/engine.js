var RuleEngine = require('node-rules');
var FactUtility = require('./sample_fact.json');
var Rules_cpu = require('./rules_cpu.js');
var Rules_memory = require('./rules_memory.js');
var fs = require('fs')
require('shelljs/global');

if (!which('git')) {
  echo('Sorry, this script requires git');
  exit(1);
}
var path = '../VisualEsxtopOnline/server/static/';
rm('-rf', path + 'output')
mkdir(path + 'output');
// Copy files to release dir
cd(path + 'data');

// for each .json file, run rules engine to every data and output the issued data
var res = ls('*.json');
console.log(res);
//write the start to logs.json
fs.writeFile('../output/logs.json', '{"records":[ ', {
                     flag: 'a'
                  });

fs.writeFile('../output/cpu.json', '{"records":[ ', {
                     flag: 'a'
                  });
fs.writeFile('../output/memory.json', '{"records":[ ', {
                     flag: 'a'
                  });

for(var i = 0; i < res.length; i++){
   console.log('-----------');
   console.log(res[i]);
   
   var file = res[i];
   var file_name = res[i].replace('.json','');
   if(file_name == "cpu" || file_name == "sample")
      continue;
   var path = '../../VisualEsxtopOnline/server/static/data/';
   var file_data = require('./' + path + file);
   //var str = JSON.stringify(file_data);
   var keys = Object.keys(file_data);
   var pointStart = file_data["pointStart"];
   var data = file_data["data"];
   var pointInterval = file_data["pointInterval"];
   var dataLength = file_data["dataLength"];

   var facts = new Array();
   for(var j = 0; j < dataLength; j++){
      var time = pointStart + pointInterval * j;
      var name = "";
      var type = "";
      if(file_name.indexOf('cpu')>=0){
         type = "cpu";
         if(file_name.indexOf('1')>=0)
	    name = "cpu2"
         else
            name = "cpu1"
         facts[j] = '{"level": 0, "type": "' + type  + '","name": "' + name + '","time": "' + time + '","useage": "' + data[j] + '%"}';
      }
      else if(file_name.indexOf('memory')>=0){
         type = "memory";
         facts[j] = '{"level": 0, "type": "' + type + '","name": "' + file_name + '","time": "' + time + '","useage": "' + data[j] + '"}';
      }
      else{
	}
      facts[j] = JSON.parse(facts[j]);
   }

   //define the rules
   var rules_cpu =  Rules_cpu.rules;
   var rules_memory = Rules_memory.rules;
   //initailize the rule engine
   var R_cpu = new RuleEngine(rules_cpu);
   var R_memory = new RuleEngine(rules_memory);

   // decode the json to get array of each item
   cd('../output');
   for(var j=0; j < dataLength; j++){
      var keys = Object.keys(facts[j]);
      //get the fact value of each item
      switch(facts[j][keys[1]]){
         case "cpu":
            //Now pass the fact on the rule engine for result
            facts[j][keys[4]] = parseInt(facts[j][keys[4]]);
            //console.log(file_name);
            var re = new Array();
            //console.log(facts[j]);
            R_cpu.execute(facts[j], function(result){
               if(result.result<=2){
                  //console.log(result);
		  result["level"] = result["result"];
                  delete result["result"];
                  var output = JSON.stringify(result);
                  output += ',';
                  console.log(result);
                  fs.writeFile('cpu.json', output, {
                     flag: 'a'
                  });
                  fs.writeFile('logs.json', output,{
		     flag: 'a'
		  });
               }

            });
          break;
	case "memory":
	    //Now pass the fact on the rule engine for result
            facts[j][keys[3]] = parseInt(facts[j][keys[3]]);
            //console.log(file_name);
            var re = new Array();
            R_memory.execute(facts[j], function(result){
               if(result.result <=2){
                  //console.log(typeof(result.result));
                  result["level"] = result["result"];
                  delete result["result"];
                  var output = JSON.stringify(result);
                  output += ',';
                  //console.log(result);
                  fs.writeFile('memory.json', output, {
                     flag: 'a'
                  });
                  fs.writeFile('logs.json', output,{
                     flag: 'a'
                  });
               }

            });
          break;

      }

   }
}
