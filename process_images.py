from PIL import Image
import os

os.chdir('c:/netship2026/outputs/netsip-badge-maker')

def remove_white(img_path, out_path, tolerance=240):
    img = Image.open(img_path).convert('RGBA')
    data = img.getdata()
    newData = []
    for item in data:
        if item[0] >= tolerance and item[1] >= tolerance and item[2] >= tolerance:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
    img.putdata(newData)
    img.save(out_path, 'PNG')

remove_white('IMG_20260528_120057.jpg.jpeg', 'logo3.png')
remove_white('IMG_20260530_232023.jpg (1).jpeg', 'logo4.png')
print('Images processed successfully')
