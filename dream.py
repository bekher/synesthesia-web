import os
import sys

def factors(n):    
    return sorted(list(set(reduce(list.__add__, ([i, n//i] for i in range(1, int(n**0.5) + 1) if n % i == 0)))))

if(len(sys.argv) < 2):
    print("You must supply a song name.")
    exit()

song = sys.argv[1].replace(" ", "")
name = song.split("/")[-1]
transform = sys.argv[2]
name2 = name + "2"
os.system("echo \"y\" | ffmpeg -i %s outputs/audio/%s.wav" % (song, name))
os.system("sox -r 48k -b 16 -c 1 -e signed-integer outputs/audio/%s.wav outputs/images/%s.raw" % (name, name))
size = os.path.getsize("outputs/images/%s.raw" % name) / 3
f = factors(size)
os.system("convert -size \"%sx%s\" -depth 8 rgb:outputs/images/%s.raw outputs/images/%s.png" % (f[len(f)/2], size/f[len(f)/2], name, name))
os.system("python color.py outputs/images/" + name + ".png " + transform)
size2 = os.path.getsize("outputs/images/%s.png" % name) / 3
f = factors(size2)
os.system("convert -size \"%sx%s\" -depth 8 outputs/images/%s.png rgb:outputs/images/%s.raw" % (f[len(f)/2], size2/f[len(f)/2], name, name) )
os.system("convert -size \"%sx%s\" -depth 8 outputs/images/%s.png rgb:outputs/images/%s.jpg" % (f[len(f)/2], size2/f[len(f)/2], name, name) )
os.system("sox -r 44100 -b 32 -c 1 -e signed-integer outputs/images/%s.raw outputs/audio/%s.wav" % (name, name))
os.system("echo \"y\" | ffmpeg -v verbose -i outputs/audio/%s.wav -vn -ar 44100 -ac 2 -ab 192k -f mp3 outputs/audio/%s.mp3" % (name, name))
