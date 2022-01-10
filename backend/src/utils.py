import numpy as np
import os
import cv2
import matplotlib.pyplot as plt
from keras.models import Model
from keras.preprocessing.image import img_to_array, load_img
import tensorflow as tf
from tensorflow.keras.applications.inception_resnet_v2 import preprocess_input
from skimage.color import rgb2lab, lab2rgb, rgb2gray, gray2rgb
from skimage.transform import resize

import config

HEIGHT=256
WIDTH=256
RESNET_H = 224
RESNET_W = 224

MODEL_DICT = {
    'encoder_lab': {
        'color_space': 'lab',
        'color_mode': False
    },
    'encoder_color_lab': {
        'color_space': 'lab',
        'color_mode': True
    },
    'encoder_rgb': {
        'color_space': 'rgb',
        'color_mode': False
    },
    'encoder_color_rgb': {
        'color_space': 'rgb',
        'color_mode': True
    },
    'unet_rgb': {
        'color_space': 'rgb',
        'color_mode': False
    },
    'unet_color_rgb': {
        'color_space': 'rgb',
        'color_mode': True
    },
}


def create_resnet_embedding(grayscaled_rgb, resnet):
    grayscaled_rgb_resized = []
    for i in grayscaled_rgb:
        i = resize(i, (RESNET_H, RESNET_W, 3), mode='constant')
        grayscaled_rgb_resized.append(i)
    grayscaled_rgb_resized = np.array(grayscaled_rgb_resized)
    grayscaled_rgb_resized = preprocess_input(grayscaled_rgb_resized)
    embed = resnet.predict(grayscaled_rgb_resized)
    return embed


def extraction_img_rgb(rgb_batch, src_img):
    img = img_to_array(load_img(src_img))
    img = 1.0/255*img
    img = resize(img, (HEIGHT,WIDTH,3))
    r = cv2.calcHist([img], [0], mask=None, histSize=[256], ranges=[0,1])
    g = cv2.calcHist([img], [1], mask=None, histSize=[256], ranges=[0,1])
    b = cv2.calcHist([img], [2], mask=None, histSize=[256], ranges=[0,1])
    r = np.array(r[:, 0]/(HEIGHT*WIDTH))
    g = np.array(g[:, 0]/(HEIGHT*WIDTH))
    b = np.array(b[:, 0]/(HEIGHT*WIDTH))
    color_r = np.array([r]*len(rgb_batch))
    color_g = np.array([g]*len(rgb_batch))
    color_b = np.array([b]*len(rgb_batch))

    return color_r, color_g, color_b


def extraction_color_rgb(rgb_batch, src_color):
    colors = []
    for item in src_color:
        r, g, b, ratio = item
        colors.append([r,g,b,ratio])
    colors = np.array(colors, dtype=np.float32)
    colors[:,-1] = colors[:,-1]/colors[:,-1].sum()
    r = np.zeros(256)
    g = np.zeros(256)
    b = np.zeros(256)
    for color in colors:
        r_val, g_val, b_val, ratio = color
        r[int(r_val)] += ratio
        g[int(g_val)] += ratio
        b[int(b_val)] += ratio
    color_r = np.array([r]*len(rgb_batch))
    color_g = np.array([g]*len(rgb_batch))
    color_b = np.array([b]*len(rgb_batch))

    return color_r, color_g, color_b


def extraction_self_rgb(rgb_batch):
    color_r = []
    color_g = []
    color_b = []
    for img in rgb_batch:
        r = cv2.calcHist([img], [0], mask=None, histSize=[256], ranges=[0,1])
        g = cv2.calcHist([img], [1], mask=None, histSize=[256], ranges=[0,1])
        b = cv2.calcHist([img], [2], mask=None, histSize=[256], ranges=[0,1])
        r = r[:, 0]/(HEIGHT*WIDTH)
        g = g[:, 0]/(HEIGHT*WIDTH)
        b = b[:, 0]/(HEIGHT*WIDTH)
        color_r.append(r)
        color_g.append(g)
        color_b.append(b)
    color_r = np.array(color_r)
    color_g = np.array(color_g)
    color_b = np.array(color_b)

    return color_r, color_g, color_b


def color_extraction_rgb(rgb_batch, src_img=None, src_color=None):
    if src_img is not None:
        return extraction_img_rgb(rgb_batch=rgb_batch, src_img=src_img)
    elif src_color is not None:
        return extraction_color_rgb(rgb_batch=rgb_batch, src_color=src_color)
    else:
        return extraction_self_rgb(rgb_batch=rgb_batch)


def extraction_img_lab(lab_batch, src_img):
    img = img_to_array(load_img(src_img))
    img = 1.0/255*img
    img = resize(img, (HEIGHT,WIDTH,3))
    img = rgb2lab(img)
    a = cv2.calcHist([img], [1], mask=None, histSize=[256], ranges=[-127, 128])
    b = cv2.calcHist([img], [2], mask=None, histSize=[256], ranges=[-128, 127])
    a = np.array(a[:, 0]/(HEIGHT*WIDTH))
    b = np.array(b[:, 0]/(HEIGHT*WIDTH))
    color_a = np.array([a]*len(lab_batch))
    color_b = np.array([b]*len(lab_batch))

    return color_a, color_b


def extraction_color_lab(lab_batch, src_color):
    colors = []
    for item in src_color:
        r, g, b, ratio = item
        l, a, b = rgb2lab((r/255.0,g/255.0,b/255.0))
        colors.append([l,a,b,ratio])
    colors = np.array(colors, dtype=np.float32)
    colors[:,-1] = colors[:,-1]/colors[:,-1].sum()
    a = np.zeros(256)
    b = np.zeros(256)
    for color in colors:
        l_val, a_val, b_val, ratio = color
        a[int(a_val)+127] += ratio
        b[int(b_val)+128] += ratio
    color_a = np.array([a]*len(lab_batch))
    color_b = np.array([b]*len(lab_batch))

    return color_a, color_b


def extraction_self_lab(lab_batch):
    color_a = []
    color_b = []
    for img in lab_batch:
        a = cv2.calcHist([img], [1], mask=None, histSize=[256], ranges=[-128, 128])
        b = cv2.calcHist([img], [2], mask=None, histSize=[256], ranges=[-128, 128])
        a = a[:, 0]/(HEIGHT*WIDTH)
        b = b[:, 0]/(HEIGHT*WIDTH)
        color_a.append(a)
        color_b.append(b)
    color_a = np.array(color_a)
    color_b = np.array(color_b)

    return color_a, color_b
    


def color_extraction_lab(lab_batch, src_img=None, src_color=None):
    if src_img is not None:
        return extraction_img_lab(lab_batch=lab_batch, src_img=src_img)
    elif src_color is not None:
        return extraction_color_lab(lab_batch=lab_batch, src_color=src_color)
    else:
        return extraction_self_lab(lab_batch=lab_batch)


def extractTest(testPath, resnet, color_space, color_mode=False, num_img=5, randomize=True, margin=0):
    testImgs = os.listdir(testPath)
    if randomize:
        np.random.shuffle(testImgs)
    X = []
    y = []
    for i in range(num_img):
        image = testImgs[margin + i]
        path = os.path.join(testPath, image)
        y.append(path)
        img = img_to_array(load_img(path))
        img = resize(img, (HEIGHT,WIDTH,3))
        X.append(img)
    X = np.array(X, dtype=np.float32)
    Xtrain = 1.0/255*X
    return make_input(Xtrain=Xtrain, y=y, resnet=resnet, color_space=color_space, color_mode=color_mode)


def make_input(Xtrain, y, resnet, color_space, color_mode, src_img=None, src_color=None):
    grayscaled_rgb = gray2rgb(rgb2gray(Xtrain))
    embed = create_resnet_embedding(grayscaled_rgb, resnet)
    if color_space == 'lab':
        lab_batch = rgb2lab(Xtrain)
        X_batch = lab_batch[:,:,:,0]
        X_batch = X_batch.reshape(X_batch.shape+(1,))
        if color_mode == True:
            color_a, color_b = color_extraction_lab(lab_batch, src_img=src_img, src_color=src_color)
            return ([X_batch, embed, color_a, color_b], y)
        else:
            return ([X_batch, embed], y)
    elif color_space == 'rgb':
        X_batch = grayscaled_rgb[:,:,:,0]
        X_batch = X_batch.reshape(X_batch.shape+(1,))
        if color_mode == True:
            color_r, color_g, color_b = color_extraction_rgb(Xtrain, src_img=src_img, src_color=src_color)
            return ([X_batch, embed, color_r, color_g, color_b], y)
        else:
            return ([X_batch, embed], y)
    else:
        raise ValueError('This function currently only accept \'lab\' or \'rgb\' color space')


def colorize_test(model, testPath, resnet, color_space, color_mode=False, num_img=5, randomize=True, margin=0):
    X_img, y_img = extractTest(testPath=testPath, resnet=resnet, color_space=color_space,
                                color_mode=color_mode, num_img=num_img, randomize=randomize, margin=margin)
    output = model.predict(X_img)
    if color_space == 'lab':
        X_batch = X_img[0]
        output = output*128
        output = np.concatenate((X_batch, output), axis=-1)
        output = lab2rgb(output)
    return output, y_img


def display_test(output, y_img, save_path='result/panel', is_save=None):
    fig, axs = plt.subplots(len(output), 3)
    fig.set_size_inches(30,10)
    for i in range(len(output)):
        image = output[i]

        img = img_to_array(load_img(y_img[i]))
        img = 1.0/255*img
        img_gray = gray2rgb(rgb2gray(img))
        axs[i, 0].imshow(img_gray)

        axs[i, 1].imshow(resize(image, (img.shape)))

        axs[i, 2].imshow(img)

        if is_save is not None:
            root_name = y_img[i].split('/')[-1]
            gray_name = f'gray_{root_name}'
            origin_name = f'origin_{root_name}'
            if not os.path.exists(os.path.join(save_path, gray_name)):
                plt.imsave(os.path.join(save_path, gray_name), np.clip(img_gray, 0.0, 1.0))
            if not os.path.exists(os.path.join(save_path, origin_name)):
                plt.imsave(os.path.join(save_path, origin_name), np.clip(img, 0.0, 1.0))
            cnt = 0
            name_model = f'model_panel_{is_save}_{cnt}.jpg'
            while os.path.exists(os.path.join(save_path, name_model)):
                cnt += 1
                name_model = f'model_panel_{is_save}_{cnt}.jpg'
            plt.imsave(os.path.join(save_path, name_model), np.clip(resize(image, (img.shape)), 0.0, 1.0))


def sort_rect(rect):
    return rect[4]


def detect_overlap(rect1, rect2, threshold_iou=0.2):
    x1, y1, w1, h1 = rect1[0], rect1[1], rect1[2], rect1[3]
    x2, y2, w2, h2 = rect2[0], rect2[1], rect2[2], rect2[3]

    #check if rect 2 inside rect 1
    if ((x2+w2) <= (x1+w1)) and (x2 >= x1) and ((y2+h2) <= (y1+h1)) and (y2 >= y1):
        return True

    #check percentage of iou for rect 2 and rect 1
    xa = max(x1,x2)
    ya = max(y1,y2)
    xb = min(x1+w1, x2+w2)
    yb = min(y1+h1, y2+h2)

    interArea = max(0, xb-xa+1)*max(0,yb-ya+1)

    rect1Area = w1*h1
    rect2Area = w2*h2

    iou = interArea/(rect1Area + rect2Area - interArea)
    if iou > threshold_iou:
        return True
    return False


def extract_roi(img_path, threshold_roi=1/16, threshold_iou=0.2, savefile=None):
    # Load image, grayscale, Gaussian blur, Canny edge detection
    image = cv2.imread(img_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (3,3), 0)
    canny = cv2.Canny(blurred, 100, 200, 1)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    # Find contours
    cnts = cv2.findContours(canny, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
    cnts = cnts[0] if len(cnts) == 2 else cnts[1]
    # cnts, _ = contours.sort_contours(cnts, method="left-to-right")
    cnts = sorted(cnts, key = cv2.contourArea, reverse = True)

    (img_x, img_y, img_c) = image.shape
    threshold_lower = img_x*img_y*threshold_roi
    vertices = []
    for i in range(len(cnts)):
        c = cnts[i]
        # Obtain bounding rectangle for each contour
        x,y,w,h = cv2.boundingRect(c)

        if ((w*h) > threshold_lower):
            vertices.append((x,y,w,h, w*h))
            # Find ROI of the contour

    vertices = sorted(vertices, key=sort_rect, reverse=True)
    overlapped = np.array([0]*len(vertices))
    for i in range(len(vertices)):
        rect1 = vertices[i]
        for j in range(i+1, len(vertices)):
            rect2 = vertices[j]
            if detect_overlap(rect1, rect2, threshold_iou=threshold_iou):
                overlapped[j] = 1

    true_bound = []
    for i in range(len(vertices)):
        if overlapped[i] == 0:
            true_bound.append(vertices[i])

    roi_ls = []
    for rect in true_bound:
        x,y,w,h = rect[0], rect[1], rect[2], rect[3]

        roi = image[y:y+h, x:x+w, :]
        roi_ls.append((x,y,w,h,roi))
        cv2.rectangle(image,(x,y),(x+w,y+h),(0,255,0),2)

    plt.figure(figsize = (15,15))
    plt.imshow(image)
    if savefile is not None:
        plt.imsave(savefile, image)

    return roi_ls


def extract_page(roi_ls, resnet, color_space, color_mode=False, src_img=None, src_color=None):
    X = []
    y = []
    for i in range(len(roi_ls)):
        img = roi_ls[i][4]
        img = resize(img, (HEIGHT,WIDTH,3))
        X.append(img)
        y.append(roi_ls[i][:4])
    X = np.array(X, dtype=np.float32)
    # Xtrain = 1.0/255*X
    Xtrain = X
    return make_input(Xtrain=Xtrain, y=y, resnet=resnet, color_space=color_space, color_mode=color_mode, src_img=src_img, src_color=src_color)


def colorize_page(model, roi_ls, resnet, color_space, color_mode=False, src_img=None, src_color=None):
    X_img, y_img = extract_page(roi_ls=roi_ls, resnet=resnet, color_space=color_space,
                                color_mode=color_mode, src_img=src_img, src_color=src_color)
    output = model.predict(X_img)
    if color_space == 'lab':
        X_batch = X_img[0]
        output = output*128
        output = np.concatenate((X_batch, output), axis=-1)
        output = lab2rgb(output)
    return output, y_img


def display_page(img_path, output, y_img, save_path='result/page', is_save=None):
    fig, axs = plt.subplots(1,3)
    fig.set_size_inches(50,50)
    origin_img = img_to_array(load_img(img_path))
    origin_img = np.array(origin_img, dtype=np.float32)
    origin_img = 1.0/255*origin_img
    grayscaled_img = gray2rgb(rgb2gray(origin_img))
    
    axs[0].imshow(grayscaled_img)

    model_img = grayscaled_img.copy()

    for i in range(len(output)):
        x,y,w,h = y_img[i][0], y_img[i][1], y_img[i][2], y_img[i][3]
        image = output[i]
        image = resize(image, (h, w))
        model_img[y:y+h, x:x+w, :] = image
    
    axs[1].imshow(model_img)

    axs[2].imshow(origin_img)

    if is_save is not None:
        root_name = img_path.split('/')[-1]
        gray_name = f'gray_{root_name}'
        origin_name = f'origin_{root_name}'
        if not os.path.exists(os.path.join(save_path, gray_name)):
            plt.imsave(os.path.join(save_path, gray_name), np.clip(grayscaled_img, 0.0, 1.0))
        if not os.path.exists(os.path.join(save_path, origin_name)):
            plt.imsave(os.path.join(save_path, origin_name), np.clip(origin_img, 0.0, 1.0))
        cnt = 0
        name_model = f'model_{is_save}_{cnt}.jpg'
        while os.path.exists(os.path.join(save_path, name_model)):
            cnt += 1
            name_model = f'model_{is_save}_{cnt}.jpg'
        plt.imsave(os.path.join(save_path, name_model), np.clip(model_img, 0.0, 1.0))

    # return [grayscaled_img, model_img, origin_img]
    return model_img


class ColorModel():

    def __init__(self, model_name, model_folder='models'):
        if model_name not in MODEL_DICT.keys():
            raise ValueError('No model with such name')
        self.model = tf.keras.models.load_model(model_folder + '/' + model_name)
        self.color_space = MODEL_DICT[model_name]['color_space']
        self.color_mode = MODEL_DICT[model_name]['color_mode']

    
    def pred_test(self, testPath, resnet, num_img=5, randomize=True, margin=0, save_path='result/panel', is_save=None):
        output, y_img = colorize_test(
                                    model = self.model,
                                    testPath=testPath, resnet=resnet,
                                    color_space=self.color_space,
                                    color_mode=self.color_mode,
                                    num_img=num_img,
                                    randomize=randomize,
                                    margin=margin
                                    )
        display_test(output, y_img, save_path=save_path, is_save=is_save)

    
    def pred_page(self, img_path, resnet, threshold_roi=1/16, threshold_iou=0.2, savefile=None,
                    src_img=None, src_color=None, save_path='result/page', is_save=None):
        roi_ls = extract_roi(
                            img_path=img_path,
                            threshold_roi=threshold_roi,
                            threshold_iou=threshold_iou,
                            savefile=savefile
                            )
        output, y_img = colorize_page(
                                    model=self.model,
                                    roi_ls=roi_ls,
                                    resnet=resnet,
                                    color_space=self.color_space,
                                    color_mode=self.color_mode,
                                    src_img=src_img,
                                    src_color=src_color
                                    )
        colored_page = display_page(
                                    img_path=img_path,
                                    output=output,
                                    y_img=y_img,
                                    save_path=save_path,
                                    is_save=is_save
                                    )
        return colored_page

def clean_image_folder(s):
    import os, shutil
    import time
    time.sleep(s)
    for folder in [config.SOURCE_IMAGES_PATH, config.RESULT_IMAGES_PATH, config.SUPPLEMENT_IMAGES_PATH]:
        for filename in os.listdir(folder):
            file_path = os.path.join(folder, filename)
            try:
                if os.path.isfile(file_path) or os.path.islink(file_path):
                    os.unlink(file_path)
                elif os.path.isdir(file_path):
                    shutil.rmtree(file_path)
            except Exception as e:
                print('Failed to delete %s. Reason: %s' % (file_path, e))

def clean_image_folder_after(s):
    import threading

    try:
        t1 = threading.Thread(target=clean_image_folder)
        t1.start()
        t1.join()
    except:
        print("Error cleaning image folder.")


    
    
    

    
    