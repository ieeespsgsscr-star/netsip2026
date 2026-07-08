from PIL import Image

def make_transparent(img_path, out_path, tolerance=230):
    img = Image.open(img_path).convert("RGBA")
    datas = img.getdata()
    
    newData = []
    for item in datas:
        if item[0] >= tolerance and item[1] >= tolerance and item[2] >= tolerance:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
            
    img.putdata(newData)
    
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    img.save(out_path, "PNG")

make_transparent('IMG_20260528_120057.jpg.jpeg', 'logo3_clean.png', 230)
make_transparent('IMG_20260530_232023.jpg (1).jpeg', 'logo4_clean.png', 245)
print("Clean images saved.")
