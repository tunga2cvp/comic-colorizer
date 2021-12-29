from flask import Flask, send_file, request, flash
from werkzeug.datastructures import FileStorage
from werkzeug.utils import secure_filename
from flask_restx import Resource, Api

import numpy as np # linear algebra
import pandas as pd # data processing, CSV file I/O (e.g. pd.read_csv)
import os
import cv2
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from keras import backend as K
from keras.layers import Conv2D,MaxPooling2D,UpSampling2D,Input,BatchNormalization,LeakyReLU
from keras.layers.merge import concatenate
from keras.models import Model
from keras.preprocessing.image import ImageDataGenerator, array_to_img, img_to_array, load_img
import tensorflow as tf
from tensorflow.keras.applications.inception_resnet_v2 import preprocess_input
from skimage.color import rgb2lab, lab2rgb, rgb2gray, gray2rgb
from skimage.transform import resize
import math
from utils import colorize_test, display_test, extract_roi, colorize_page, display_page

######################################################## Model

file_name = 'pictures/sample_page.png'
model_name_1 = 'model_unet_resnet_rgb_color'
model_name_2 = 'unet_rgb'
model_name = model_name_1
resnet = tf.keras.applications.resnet50.ResNet50(include_top=True, weights='imagenet', classes=1000)
model = tf.keras.models.load_model(model_name)
roi_ls = extract_roi(file_name, threshold_roi=1/16)

def predict_mode_1(color_mode=True, color_space='rgb', filename=None):
    output, y_img = colorize_page(model, roi_ls, resnet=resnet, color_space=color_space, color_mode=color_mode)
    self_color = display_page(filename, output, y_img, color_space='rgb')
    return self_color


# def predict_mode_2(color_mode=True, color_space='rgb', src_img='pictures/sample_3.jpg'):
def predict_mode_2(color_mode=True, color_space='rgb', src_img=None, filename=None):
    output, y_img = colorize_page(model, roi_ls, resnet=resnet, color_space=color_space, color_mode=color_mode,
                                  src_img=src_img)
    img_color = display_page(filename, output, y_img, color_space='rgb')
    return img_color


# def predict_mode_3(color_mode=True, color_space='rgb', color=[(255, 0, 0, 1), (0, 255, 0, 1), (55, 200, 255, 1)]):
def predict_mode_3(color_mode=True, color_space='rgb', color=None, filename=None):
    output, y_img = colorize_page(model, roi_ls, resnet=resnet, color_space=color_space, color_mode=color_mode, src_color=color)
    palette_color = display_page(filename, output, y_img, color_space='rgb')
    return palette_color


def predict(mode=0, filename=None, src_img=None, color=None):
    color_after = None
    if mode == 1:
        color_after = predict_mode_1(color_mode=True, filename=f'source_images/{filename}')
    elif mode == 2:
        color_after = predict_mode_2(color_mode=True, filename=f'source_images/{filename}', src_img=f'supplement_images/{src_img}')
    elif mode == 3:
        color_after = predict_mode_3(color_mode=True, filename=f'source_images/{filename}', color=color)
    if color_after is not None:
        plt.imsave(f'result_images/{filename}', np.clip(color_after, 0.0, 1.0))

# predict(filename=None)


########################################### Flask app

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
        filename = './test.jpg'
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
    # @api.expect(colorize_param)
    def post(self, mode):
        # args = colorize_param.parse_args()
        files = request.files
        data = request.form
        if mode == 1:
            source_image = files.get('source_image')
            source_image.save(f'source_images/{source_image.filename}')
            predict(mode=1, filename=source_image.filename)
            return send_file(f'result_images/{source_image.filename}', mimetype=source_image.mimetype)
        elif mode == 2:
            source_image = files.get('source_image')
            source_image.save(f'source_images/{source_image.filename}')
            supplement_image = files.get('supplement_image')
            supplement_image.save(f'supplement_images/{supplement_image.filename}')
            predict(mode=2, filename=source_image.filename, src_img=supplement_image.filename)
            return send_file(f'result_images/{source_image.filename}', mimetype=source_image.mimetype)
        elif mode == 3:
            source_image = files.get('source_image')
            source_image.save(f'source_images/{source_image.filename}')
            # supplement_image = files.get('supplement_image')
            # supplement_image.save(f'supplement_images/{supplement_image.filename}')
            color = data.get('color').split(',')
            for c in color:
                c = int(c)
            color = [(color[0], color[1], color[2], color[3]),
                     (color[4], color[5], color[6], color[7]),
                     (color[8], color[9], color[10], color[11])]
            predict(mode=3, filename=source_image.filename, color=color)
            return send_file(f'result_images/{source_image.filename}', mimetype=source_image.mimetype)
        else:
            return {
                'msg': "Sai mode tô màu ảnh."
            }


if __name__ == '__main__':
    app.run(debug=True)
