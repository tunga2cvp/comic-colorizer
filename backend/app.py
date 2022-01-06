import os
import backend.config as config
import matplotlib.pyplot as plt
import numpy as np  # linear algebra
import tensorflow as tf
from flask import Flask, send_file, request, flash
from flask_restx import Resource, Api
from werkzeug.utils import secure_filename
from backend.src.utils import extract_roi, colorize_page, display_page
from src.colorizer import predict


app = Flask(__name__)
api = Api(app)


@api.route('/')
class HelloWorld(Resource):
    def get(self):
        return {'hello': 'world'}


@api.route('/api/test')
class Image(Resource):
    def get(self):
        import time
        time.sleep(5)
        filename = 'resources/test.jpg'
        return send_file(filename, mimetype='image/jpg')

    def post(self):
        if 'file' not in request.files:
            flash('No file part')
        file = request.files['file']
        filename = secure_filename(file.filename)
        file.save(filename)
        return send_file(filename, mimetype=file.mimetype)


@api.route('/api/v1/predict/<int:mode>', methods=['POST'])
class ColorizedImage(Resource):
    def post(self, mode):
        # args = colorize_param.parse_args()
        files = request.files
        data = request.form

        source_image = files.get('source_image')
        source_image.save(f'source_images/{source_image.filename}')

        if mode == 1:
            predict(mode=1, filename=source_image.filename)
            return send_file(f'log/result_images/{source_image.filename}', mimetype=source_image.mimetype)
        elif mode == 2:
            supplement_image = files.get('supplement_image')
            supplement_image.save(f'supplement_images/{supplement_image.filename}')
            predict(mode=2, filename=source_image.filename, src_img=supplement_image.filename)
            return send_file(f'log/result_images/{source_image.filename}', mimetype=source_image.mimetype)
        elif mode == 3:
            color = data.get('color').split(',')
            for c in color:
                c = int(c)
            color = [(color[0], color[1], color[2], color[3]),
                     (color[4], color[5], color[6], color[7]),
                     (color[8], color[9], color[10], color[11])]
            predict(mode=3, filename=source_image.filename, color=color)
            return send_file(f'log/result_images/{source_image.filename}', mimetype=source_image.mimetype)
        else:
            return {
                'msg': "Sai mode tô màu ảnh."
            }


if __name__ == '__main__':
    app.run(debug=True)
