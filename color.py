from PIL import Image
import numpy as np
from numpy import *
from scikits.samplerate import resample
from collections import Counter
import random
import sys

def metallic(arr):
    for i in range(0, len(arr)):
        if (i % 128 > 63):
            arr[i] = 0
    return arr

def reverse(arr):
    return array([arr[i:i+4] for i in range(0, len(arr), 4)])[::-1].flatten()

def shuffle(arr):
    arr = array([arr[i:i+3584] for i in range(0, len(arr), 3584)])

    random.shuffle(arr)
    return arr.flatten()

def redshift(arr):
    i = 0
    while i < len(arr):
        arr[i] = 255
        arr[i + 3] = 255
        i += 12

    return arr

def greenshift(arr):
    i = 0
    while i < len(arr):
        arr[i + 4] = 255
        arr[i + 1] = 255
        i += 12
    return arr

def blueshift(arr):
    i = 0
    while i < len(arr):
        arr[i + 8] = 255
        arr[i + 5] = 255
        i += 12
    return arr

def decay(arr, jmp=32):
    arr = array([arr[i:i+4] for i in range(0, len(arr), 4)])
    i = 0
    while i < len(arr):
        for j in range(0, jmp):
            arr[i + j] = arr[i]
        i += jmp
    return arr.flatten()

def extend(arr, jmp):
    arr = array([arr[i:i+4] for i in range(0, len(arr), 4)])
    ret = []
    for i in arr:
        for j in range(jmp):
            ret.append(i)
    return array(ret).flatten()

def speedx(sound_array, factor):
    """ Multiplies the sound's speed by some `factor` """
    indices = np.round( np.arange(0, len(sound_array), factor) )
    indices = indices[indices < len(sound_array)].astype(int)
    return sound_array[ indices.astype(int) ]


def stretch(sound_array, f, window_size, h):
    """ Stretches the sound by a factor `f` """

    phase  = np.zeros(window_size)
    hanning_window = np.hanning(window_size)
    result = np.zeros( len(sound_array) /f + window_size)

    for i in np.arange(0, len(sound_array)-(window_size+h), h*f):

        # two potentially overlapping subarrays
        a1 = sound_array[i: i + window_size]
        a2 = sound_array[i + h: i + window_size + h]

        # resynchronize the second array on the first
        s1 =  np.fft.fft(hanning_window * a1)
        s2 =  np.fft.fft(hanning_window * a2)
        phase = (phase + np.angle(s2/s1)) % 2*np.pi
        a2_rephased = np.fft.ifft(np.abs(s2)*np.exp(1j*phase))

        # add to result
        i2 = int(i/f)
        result[i2 : i2 + window_size] += hanning_window*a2_rephased

    result = ((2**(16-4)) * result/result.max()) # normalize (16bit)

    return result.astype('int16')

def pitchshift(snd_array, n, window_size=2**13, h=2**11):
    """ Changes the pitch of a sound by ``n`` semitones. """
    factor = 2**(1.0 * n / 12.0)
    stretched = stretch(snd_array, 1.0/factor, window_size, h)
    return speedx(stretched[window_size:], factor)

name = sys.argv[1]
transform = sys.argv[2]

im = Image.open(name) 
pix = im.load()
arr = []
stret = 1


print("Starting first pass...")
for y in range(0, im.size[1]):
    for x in range(0, im.size[0]):
        arr.append(pix[x,y][0])
        arr.append(pix[x,y][1])
        arr.append(pix[x,y][2])

arr2 = array(arr)

if(transform == "metallic"):
    arr = metallic(arr2)
if(transform == "redshift"):
    arr = redshift(arr2)
if(transform == "blueshift"):
    arr = blueshift(arr2)
if(transform == "greenshift"):
    arr = greenshift(arr2)
elif(transform == "reverse"):
    arr = reverse(arr2)
elif(transform == "shuffle"):
    arr = shuffle(arr2)
elif(transform == "decay"):
    arr = decay(arr2)
elif(transform == "extend"):
    arr = extend(arr2, 2)
elif(transform=="speed"):
    arr3 = array([arr[i:i+4] for i in range(0, len(arr), 4)])
    arr = speedx(arr3, 2).flatten()
    stret = 2
elif(transform == "pitch"):
    arr = pitchshift(arr2, 2)
    stret = 2
i = 0
print("Rewriting file...")
for y in range(0, im.size[1]/stret):
    for x in range(0, im.size[0]):
        pix[x,y] = (arr[i], arr[i + 1], arr[i + 2])
        i += 3

if (transform == "speed"):
    for y in range((im.size[1]/stret), im.size[1]):
        for x in range(0, im.size[0]):
            pix[x,y] = (0, 0, 0)
            i += 3
im.save(name,"PNG")
