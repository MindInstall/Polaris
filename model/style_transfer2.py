from __future__ import print_function,division
from builtins import range,input

from keras.models import Model,Sequential
from keras.applications.vgg16 import preprocess_input
from keras.preprocessing import image
from keras.applications.vgg16 import VGG16

from style_transfer1 import VGG16_AvgPool,unpreprocess,scale_img

from scipy.optimize import fmin_l_bfgs_b
from datetime import datetime

import numpy as np
import matplotlib.pyplot as plt
import keras.backend as k

def gram_matrix(img):
    
    X = k.batch_flatten(k.permute_dimensions(img,(2,0,1)))
    
    G = k.dot(X,k.transpose(X))/img.get_shape().num_elements()
    return G


def style_loss(y,t):
    return k.mean(k.square(gram_matrix(y)-gram_matrix(t)))

def minimize(fn,epochs,batch_shape):
    t0=datetime.now()
    losses = []
    x = np.random.randn(np.prod(batch_shape))
    for i in range(epochs):
        x,l,_=fmin_l_bfgs_b(
            func=fn,
            x0=x,
            maxfun=20
            )
        x = np.clip(x,-127,127)
        print("iter=%s,loss=%s"%(i,l))
        losses.append(l)
        
    print("duration:",datetime.now()-t0)
    plt.plot(losses)
    plt.show()
    
    newing = x.reshape(*batch_shape)
    final_img = unpreprocess(newing)
    
    plt.imshow(scale_img(final_img[0]))
    plt.show()    
    
if __name__=='main': 
    
    path='download.jpg'
    
    img = image.load_image(path)
    
    x = image.img_to_array(img)
    
    x = np.expand_dims(x,axis=0)
    
    x = preprocess_input(x)
    
    batch_shape = x.shape
    shape = x.shape[1:]
    
    vgg = VGG16_AvgPool(shape)
    
    symbolic_conv_outputs = [
        layer.get_output_at(1) for layer in vgg.layers \
        if layer.name.endswith('conv1')
        ]
        
    multi_model_output = Model(vgg.input,symbolic_conv_outputs)
    
    style_layers_outputs = [k.variable(y) for y in multi_model_output.predict(x)]
    loss=0
    
    for symbolic,actual in zip(symbolic_conv_outputs,style_layers_outputs):
        loss+=style_loss(symbolic[0],actual[0])
        
    grads = k.gradients(loss,multi_model_output.input)
    
    get_loss_and_grads = k.functioin(
        inputs = [multi_model_output.input],
        outputs = [loss]+grads 
        )
    
    def get_loss_and_grads_wrapper(x_vec):
        l,g = get_loss_and_grads([x_vec.reshape(*batch_shape)])
        return l.astype(np.float64),g.flatten().astype(np.float64)
    
    final_img = minimize(get_loss_and_grads_wrapper,10,batch_shape)
    plt.imshow(scale_img(final_img))
    plt.show()
        
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    