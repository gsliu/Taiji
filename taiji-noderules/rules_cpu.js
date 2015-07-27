exports.rules =[{

   "condition": function(R){
      R.when(this.useage < 70);
   },

   "consequence": function(R){
      this.result = 3;
      this.reason = "The CPU used is less than 70%, it works well.(Maybe don't need to warn)\n";
      //if not matched, jump to next rule
      R.next();
   }
},{
   //the second rules
   "name": "warning1",
   "condition": function(R){
      R.when(this.useage >= 70 && this.useage < 90);
   },

   "consequence": function(R){
      this.result = 2;
      this.reason = "The CPU used is between 70% and 90%\n";
      //if not matched, jump to next rule
      R.stop();
   }
},{
   //the third rules
   "name": "warning2",
   "condition": function(R){
      R.when(this.useage >= 90);
   },

   "consequence": function(R){
      this.result = 1;
      this.reason = 'Warning!!! The CPU used is upper than 90%!';
      R.stop();//end of the matching work
   }
}
];
