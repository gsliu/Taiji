var RuleEngine = require('node-rules');
var FactUtility = require('./sample_fact.json');
var Rules = require('./rules_cpu.js');
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
for(var i = 0; i < res.length; i++){
   console.log('-----------');
   console.log(res[i]);
   fs.writeFile('../output/' + res[i], '[', {
                     flag: 'a'
                  });

   var file = res[i];
   var file_name = res[i].replace('.json','');
   if(file_name == "cpu" || file_name == "sample")
      continue;
   var path = '../../VisualEsxtopOnline/server/static/data/';
   var file_data = require('./' + path + file);
   var str = JSON.stringify(file_data);
   var keys = Object.keys(file_data);
   var pointStart = file_data["pointStart"];
   var data = file_data["data"];
   var pointInterval = file_data["pointInterval"];
   var dataLength = file_data["dataLength"];

   var str = JSON.stringify(file_data);
   var keys = Object.keys(file_data);
   var pointStart = file_data["pointStart"];
   var data = file_data["data"];
   var pointInterval = file_data["pointInterval"];
   var dataLength = file_data["dataLength"];
   var facts = new Array();
   for(var j = 0; j < dataLength; j++){
      var time = pointStart + pointInterval * j;
      facts[j] = '{"type": "cpu' + '","name": "' + file_name + '","time": "' + time + '","useage": "' + data[j] + '"}';
      facts[j] = JSON.parse(facts[j]);
   }

   //define the rules
   var rules =  Rules.rules;
   //initailize the rule engine
   var R = new RuleEngine(rules);

   // decode the json to get array of each item
   cd('../output');
   for(var j=0; j < dataLength/20; j++){
      var keys = Object.keys(facts[j]);
      //get the fact value of each item
      switch(facts[j][keys[0]]){
         case "cpu":
            //Now pass the fact on the rule engine for result
            facts[j][keys[2]] = parseInt(facts[j][keys[2]])/100;
            //console.log(file_name);
            var re = new Array();
            R.execute(facts[j], function(result){
               if(result.result <=2){
                  //console.log(result);
                  var output = JSON.stringify(result);
                  output += ',\n';
                  console.log(result.length); 
                  fs.writeFile(result.name + '.json', output, {
                     flag: 'a'
                  });
               }

            });
          break;
      }

   }
}
