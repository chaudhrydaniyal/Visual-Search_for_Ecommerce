# -*- coding: utf-8 -*-
import io
import random
import shutil
import sys
from multiprocessing.pool import ThreadPool
import pathlib
import requests
import time
from absl import logging
import matplotlib.pyplot as plt
import numpy as np
from PIL import Image, ImageOps
from scipy.spatial import cKDTree
from skimage.feature import plot_matches
from skimage.measure import ransac
from skimage.transform import AffineTransform
from six import BytesIO
import tensorflow as tf
import tensorflow_hub as hub
from six.moves.urllib.request import urlopen
import sys
import os

os.environ['CUDA_VISIBLE_DEVICES'] = '-1'
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

tf.get_logger().setLevel(logging.ERROR)
arr = sys.argv[2].split(',')
arr2 = sys.argv[3].split(',')
arr3 = []
max1=0

# arr = ['https://m.media-amazon.com/images/I/91dpdYoEcfL._AC_UL320_.jpg',
#   'https://m.media-amazon.com/images/I/91FpKm8aKiL._AC_UL320_.jpg',
#   'https://m.media-amazon.com/images/I/71VjVPr8nTL._AC_UL320_.jpg',
#   'https://m.media-amazon.com/images/I/71YxuT6wwUS._AC_UL320_.jpg',
#   'https://m.media-amazon.com/images/I/81c4cxsbXwS._AC_UL320_.jpg']

def get_download_location():
    # try:
    #     url_input = sys.argv[1]
    # except IndexError:
    #     print('ERROR: Please provide the txt file\n$python image_downloader.py cats.txt')
    # name = url_input.split('.')[0]
    pathlib.Path('name').mkdir(parents=True, exist_ok=True)
    return 'name'


def image_downloader(img_url: str):
    """
    Input:
    param: img_url  str (Image url)
    Tries to download the image url and use name provided in headers. Else it randomly picks a name
    """
    print(f'Downloading: {img_url}')
    res = requests.get(img_url, stream=True)
    count = 1
    while res.status_code != 200 and count <= 5:
        res = requests.get(img_url, stream=True)
        print(f'Retry: {count} {img_url}')
        count += 1
    # checking the type for image
    if 'image' not in res.headers.get("content-type", ''):
        print('ERROR: URL doesnot appear to be an image')
        return False
    try:
      image_name = str(img_url[(img_url.rfind('/')) + 1:])
      if '?' in image_name:
        image_name = image_name[:image_name.find('?')]
    except:
        image_name = str(random.randint(11111, 99999))+'.jpg'

    i = Image.open(io.BytesIO(res.content))
    download_location = get_download_location()
    i.save(download_location + '/'+image_name)
    return f'Download complete: {img_url}'


def run_downloader(process: int, images_url: list):
    """
    Inputs:
        process: (int) number of process to run
        images_url:(list) list of images url
    """
    print(f'MESSAGE: Running {process} process')
    results = ThreadPool(process).imap_unordered(image_downloader, images_url)
    for r in results:
        print(r)


try:
    num_process = int(sys.argv[2])
except:
    num_process = 10

images_url = arr
run_downloader(num_process, images_url)


# print('Time taken to download {}'.format(len(get_urls())))





delf = hub.load('https://tfhub.dev/google/delf/1').signatures['default']

start = time.time()

IMAGE_1_URL = '81VTEH3nF7L._AC_UL320_.jpg'

def download_and_resize2(url, new_width=256, new_height=256):
    image = Image.open(url)
    image = ImageOps.fit(image, (new_width, new_height), Image.ANTIALIAS)
    return image


image1 = download_and_resize2(IMAGE_1_URL)


def run_delf(image):
  np_image = np.array(image)
  float_image = tf.image.convert_image_dtype(np_image, tf.float32)

  return delf(
    image=float_image,
    score_threshold=tf.constant(100.0),
    image_scales=tf.constant([0.25, 0.3536, 0.5, 0.7071, 1.0, 1.4142, 2.0]),
    max_feature_num=tf.constant(1000))


result1 = run_delf(image1)

index=0

for x in arr:

  #print (x)
  image_name = str(x[(x.rfind('/')) + 1:])
  if '?' in image_name:
    image_name = image_name[:image_name.find('?')]

  IMAGE_2_URL = 'name/' + image_name

  def download_and_resize2(url, new_width=256, new_height=256):
    image = Image.open(url)
    image = ImageOps.fit(image, (new_width, new_height), Image.ANTIALIAS)
    return image






  image2 = download_and_resize2(IMAGE_2_URL)



  result2 = run_delf(image2)



  def match_images(image1, image2, result1, result2):
    distance_threshold = 0.8

    num_features_1 = result1['locations'].shape[0]
    #print("Loaded image 1's %d features" % num_features_1)

    num_features_2 = result2['locations'].shape[0]
    #print("Loaded image 2's %d features" % num_features_2)

    d1_tree = cKDTree(result1['descriptors'])
    _, indices = d1_tree.query(
      result2['descriptors'],
      distance_upper_bound=distance_threshold)

    locations_2_to_use = np.array([
      result2['locations'][i,]
      for i in range(num_features_2)
        if indices[i] != num_features_1
    ])
    locations_1_to_use = np.array([
      result1['locations'][indices[i],]
      for i in range(num_features_2)
      if indices[i] != num_features_1
    ])

    _, inliers = ransac(
      (locations_1_to_use, locations_2_to_use),
      AffineTransform,
      min_samples=3,
      residual_threshold=20,
      max_trials=1000)

    print('Found %d inliers' % sum(inliers))
    count = sum(inliers)
    arr3.append(count)


  try: match_images(image1, image2, result1, result2)
  except: 
    print ('e')
    arr3.append(0)
    
 
  # print(arr2[index])
  index=index+1

print('new')
print(arr3)
max_value=max(arr3)
max1=arr3.index(max_value)
print(max1)
print('https://www.amazon.com/' + arr2[max1])

end = time.time()



print(end - start)





