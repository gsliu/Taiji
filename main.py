from flask import request
import flask
import flask_filetree
import os
import commands, json

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

@app.route('/realtime_noderule/', methods=['POST'])
def realtime_noderule():
	print "data: " , request.data
	print "type: " , type(request.data)
	print "test: " , type(json.loads(request.data))
	print list2str(json.loads(request.data))
	# print "json: " , request.get_json()
	command = 'node ./taiji-noderules/realtime_engine.js ' + list2str(json.loads(request.data))
	# print command
	a, b = commands.getstatusoutput(command)
	# print b
	return b


def list2str(datas):
	tmp = []
	for data in datas:
		tmp.append(data[1])
	return ','.join(str(e) for e in tmp)

if __name__ == '__main__':
    app.run(debug=True)
