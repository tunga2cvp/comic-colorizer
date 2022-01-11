# Manga Colorization - Dataset and Model training

This directory contains the source code for preparing data and training the model. Note that since this process is mainly done on Google Colab, many of the notebooks begin with a few line of code to move into the directory. Those can be ignored if you're running this on a local machine.

Most of the notebooks can function on themselves. However, all the functions and methods used (and more) are collected and refined in the file **utils.py**. For an overview of this project, please refer to the documentation. You will not find that here.


# Dataset

The notebook **train_test_split** deal with the process of creating dataset.

Your dataset should be a colored manga with the following path structure:
```{python}
MangaName
|
| - Chapter 1
|		|
|		| - page1.png
|		| - page2.png
|		| ....
| - Chapter 2
|
...
```
The notebook **train_test_split** will split the dataset into **Train/Validation/Test**, each folder containing extracted panels from the manga pages.
Meanwhile, the notebook **coverage_area** shows the percentage of total area covered by the extracted panels.

# Model training

The two notebooks **model_encoder_lab** and **model_unet_rgb** details the training of an encoder-decoder model using Lab color space and a u-net model using RGB color space. Since the method of color extraction is independent of the model architecture, one can easily build an encoder-decoder model using RGB color space and a u-net model using Lab color space by swapping the color extraction methods.

Note that there are several steps in preprocessing images for Lab and RGB color space model, and readers should concentrate on the methods of the class DataSequence in each notebook. These preprocessing steps can also be found in the **utils.py**.

# Testing

The testing methods are mainly implemented in the file **utils.py**. The notebook **image_test** utilizes these methods extensively. Inside you can find several example to get used to the testing process.

The two main modes of testing are: using the panels extracted in the **Test** folder (panel level testing) and page level testing. Page level testing then contains three additional modes:

-	self-testing, load in a colored manga page to compare the output with the original page.
-	source image color transfer, load in a grayscale manga page and a source image to transfer color from.
-	color palette color transfer, load in a grayscale manga page and several colors in the form of (R-value, G-value, B-value, ratio) to color the manga page in this palette (ratio refers to the ratios between multiple colors in the case several colors are used, it DOES NOT refers to the strength of the color on the manga page).