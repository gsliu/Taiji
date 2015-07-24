from flask import Flask
import os, commands

app = Flask(__name__)

@app.route('/noderule')
def node_rules():
	#return "hello"
	a,b = commands.getstatusoutput('node ./taiji-noderules/engine.js')
	return b
	#os.system('touch aa')
        #os.system('node ./taiji-noderules/engine.js')

if __name__ == '__main__':
	app.run(debug=True)
