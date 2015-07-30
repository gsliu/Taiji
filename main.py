import flask
import flask_filetree
import os
import commands

app = flask.Flask(__name__)

ft = flask_filetree.make_blueprint(app=app, register=False)
app.register_blueprint(ft, url_prefix='/filetree')


@app.route('/noderule')
def node_rules():
	#return "hello"
	a,b = commands.getstatusoutput('node ./taiji-noderules/engine.js')
	c = commands.getstatusoutput('./taiji-noderules/shell.sh')
	return str(c)
	#os.system('touch aa')
        #os.system('node ./taiji-noderules/engine.js')


if __name__ == '__main__':
    app.run(debug=True)
