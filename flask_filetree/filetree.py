#!/usr/bin/env python
from flask import Flask,request
import logging
import os
import urllib

import flask
import shutil
import requests

def get_files(d, fnfilter, dfilter, rel=True):
    d = os.path.expanduser(d)
    dirs = []
    fns = []
    for fn in sorted(os.listdir(d)):
        ffn = os.path.join(d, fn)
        if not rel:
            fn = ffn
        if os.path.isdir(ffn):
            if dfilter(ffn):
                dirs.append(fn)
        else:
            if fnfilter(ffn):
                fns.append(fn)
    return fns, dirs


def make_blueprint(app=None, register=True, fnfilter=None, dfilter=None):
    if fnfilter is None:
        fnfilter = lambda fn: True
    if dfilter is None:
        dfilter = lambda d: True
    main_dir = os.path.dirname(os.path.abspath(__file__))
    template_folder = os.path.join(main_dir, 'templates')
    static_folder = os.path.join(main_dir, 'static')
    logging.debug('filetree main_dir: %s' % main_dir)
    logging.debug('filetree template_folder: %s' % template_folder)
    logging.debug('filetree static_folder: %s' % static_folder)
    filetree = flask.Blueprint('filetree', 'filetree', \
            template_folder=template_folder, static_folder=static_folder)

    @filetree.route('/json')
    def dirlist():
        try:
            d = urllib.unquote(flask.request.args.get('dir', './'))
            fns, dirs = get_files(d, fnfilter, dfilter, rel=False)
            error = ""
        except Exception as E:
            fns = []
            dirs = []
            error = "PY: %s" % E
        return flask.jsonify(fns=fns, dirs=dirs, error=error)

    @filetree.route('/sfiles', methods=['POST'])
    def sfiles():
        r = []
        try:
            d = urllib.unquote(flask.request.form.get('dir', './'))
            fns, dirs = get_files(d, fnfilter, dfilter, rel=True)
            r = ['<ul class="jqueryFileTree" style="display: none;">']
            for f in dirs:
                ff = os.path.join(d, f)
                r.append('<li class="directory collapsed">' \
                        '<a href="#" rel="%s/">%s</a></li>' % (ff, f))
            for f in fns:
                ff = os.path.join(d, f)
                e = os.path.splitext(f)[1][1:]  # get .ext and remove dot
                r.append('<li class="file ext_%s">' \
                '<a href="#" rel="%s">%s</a></li>' % (e, ff, f))
            r.append('</ul>')
        except Exception as E:
            r.append('Could not load directory: %s' % (str(E)))
        return ''.join(r)

    @filetree.route('/test')
    def test():
        return flask.render_template('filetree_test.html')

    @filetree.route('/deletefile')
    def deletefile():
        if request.method == 'GET':
            path = request.values['path']
            if path and os.path.exists(path):
                if os.path.isfile(path):
                    os.remove(path)
                if os.path.isdir(path):
                    shutil.rmtree(path)
                return flask.render_template('filetree_test.html')
        return flask.render_template('filetree_test.html')

    @filetree.route('/newfile')
    def newfile():
        if request.method == 'GET':
            filepath = request.values['filepath']
            filename = request.values['filename']
            if filepath and filename and not os.path.exists(filepath+filename):
                if os.path.isfile(filepath):
                    filepath1, filepath2 = os.path.split(filepath)
                    f = open(filepath1 +'/'+ filename, 'w')
                if os.path.isdir(filepath):
                    f = open(filepath + filename, 'w')
                f.close()
                return flask.render_template('filetree_test.html')
        return flask.render_template('filetree_test.html')

    @filetree.route('/newfolder')
    def newfolder():
        if request.method == 'GET':
            filepath = request.values['filepath']
            filename = request.values['filename']
            if filepath and filename:
                if os.path.isfile(filepath):
                    filepath1, filepath2 = os.path.split(filepath)
                    if not os.path.exists(filepath1 +'/'+ filename):
                        os.makedirs(filepath1 +'/'+ filename)
                if os.path.isdir(filepath):
                    if not os.path.exists(filepath + filename):                    
                        os.makedirs(filepath + filename)
                return flask.render_template('filetree_test.html')
        return flask.render_template('filetree_test.html')


    @filetree.route('/demo')
    def demo():
        return flask.render_template('demo.html')

    @filetree.route('/noderule')
    def noderule():
        return flask.render_template('filetree_test.html')

    # dirty fix for flask static bug
    @filetree.route('/files/<path:path>')
    def files(path):
        return filetree.send_static_file(path)

    if register:
        if app is None:
            app = flask.Flask('filetree')
        app.register_blueprint(filetree, url_prefix='/filetree')
        return filetree, app
    return filetree


def test(**kwargs):
    ft, app = make_blueprint(register=True)
    logging.debug(app.url_map)
    app.run(**kwargs)


if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
    test()
