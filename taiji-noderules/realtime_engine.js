var datas = process.argv.slice(2);
var array = JSON.parse("[" + datas + "]");

var facts = [];
for (var i = 0; i < array.length; i++) {
    var fact = {
        "name" : "cpu" + i,
        "usage" : array[i]
    };
    facts.push(fact);
};

var RuleEngine = require('./node_modules/node-rules/index');
var rule = {
    "condition": function(R) {
        R.when(this.usage > 1);
    },
    "consequence": function(R) {
        this.result = false;
        this.reason = this.name + " was blocked as it was bigger than 1";
        R.stop();
    }
};

var rulus = [
    {
        "condition": function(R) {
            R.when(this.usage > 0.5 && this.usage < 1);
        },
        "consequence": function(R) {
            this.result = false;
            this.reason = "Warning: " + this.name + " usage is bigger than 0.5";
            R.stop();
        }
    },
    {
        "condition": function(R) {
            R.when(this.usage >= 1);
        },
        "consequence": function(R) {
            this.result = false;
            this.reason = "Danger: " + this.name + " usage is bigger than 1.0";
            R.stop();
        }  
    }
];
/* Creating Rule Engine instance and registering rule */
var R = new RuleEngine();
R.register(rulus);


for (var i = 0; i < facts.length; i++) {
    execute_rule(facts[i]);
};


function execute_rule (fact) {
    R.execute(fact, function(data) {
        if (data.result) {
            // console.log("Valid transaction");
        } else {
            console.log(data.reason);
        }
    });
}


// console.log(process.argv.slice(2));
// console.log(process.argv);