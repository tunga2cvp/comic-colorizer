import os
import config
import matplotlib.pyplot as plt
import numpy as np  # linear algebra
import tensorflow as tf
from flask import Flask, send_file, request, flash
from flask_restx import Resource, Api
from werkzeug.utils import secure_filename
from .utils import extract_roi, colorize_page, display_page, clean_image_folder_after

# file_name = config.ROOT_DIR + '/resources/pictures/sample_page.png'
resnet = tf.keras.applications.resnet50.ResNet50(include_top=True, weights='imagenet', classes=1000)
model_rgb = tf.keras.models.load_model(config.MODEL_1_PATH)
model_color_rgb = tf.keras.models.load_model(config.MODEL_2_PATH)
# roi_ls = extract_roi(file_name, threshold_roi=1 / 16)


def predict_mode_1(color_mode=False, color_space='rgb', filename=None, roi_ls=None):
    output, y_img = colorize_page(model_color_rgb, roi_ls, resnet=resnet, color_space=color_space, color_mode=color_mode)
    self_color = display_page(filename, output, y_img)
    return self_color


# def predict_mode_2(color_mode=True, color_space='rgb', src_img='pictures/sample_3.jpg'):
def predict_mode_2(color_mode=True, color_space='rgb', src_img=None, filename=None, roi_ls=None):
    output, y_img = colorize_page(model_color_rgb, roi_ls, resnet=resnet, color_space=color_space,
                                  color_mode=color_mode,
                                  src_img=src_img)
    img_color = display_page(filename, output, y_img)
    return img_color


# def predict_mode_3(color_mode=True, color_space='rgb', color=[(255, 0, 0, 1), (0, 255, 0, 1), (55, 200, 255, 1)]):
def predict_mode_3(color_mode=True, color_space='rgb', color=None, filename=None, roi_ls=None):
    output, y_img = colorize_page(model_color_rgb, roi_ls, resnet=resnet, color_space=color_space,
                                  color_mode=color_mode, src_color=color)
    palette_color = display_page(filename, output, y_img)
    return palette_color


def predict(mode=0, filename=None, src_img=None, color=None, threshold=0):
    if not threshold:
        threshold = 1/16
    roi_ls = extract_roi(f'{config.SOURCE_IMAGES_PATH}/{filename}', threshold_roi=threshold)
    color_after = None
    if mode == 1:
        color_after = predict_mode_1(color_mode=True, filename=f'{config.SOURCE_IMAGES_PATH}/{filename}',
                                     roi_ls=roi_ls)
    elif mode == 2:
        color_after = predict_mode_2(color_mode=True, filename=f'{config.SOURCE_IMAGES_PATH}/{filename}',
                                     src_img=f'{config.SUPPLEMENT_IMAGES_PATH}/{src_img}', roi_ls=roi_ls)
    elif mode == 3:
        color_after = predict_mode_3(color_mode=True, filename=f'{config.SOURCE_IMAGES_PATH}/{filename}', color=color,
                                     roi_ls=roi_ls)
    elif mode == 4:
        extract_roi(f'{config.SOURCE_IMAGES_PATH}/{filename}', threshold_roi=threshold,
                             savefile=f'{config.PREVIEW_IMAGES_PATH}/{filename}')
    if color_after is not None:
        plt.imsave(f'{config.RESULT_IMAGES_PATH}/{filename}', np.clip(color_after, 0.0, 1.0))

    clean_image_folder_after(100)



