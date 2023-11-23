from flask import jsonify
from bs4 import BeautifulSoup
import requests

def search_rest(place):
    n = 10
    url = f"https://www.yelp.com/search?find_desc=food&find_loc={place}"

    res = requests.get(url)
    doc = BeautifulSoup(res.text, "html.parser")

    tag = doc.find_all("a")
    restaurants = []
    
    count = 0
    for a in tag:
        line = str(a)
        if line.find("css-19v1rkv") == -1:
            continue
        start = line.find("name") + 6
        temp = line[start:]
        end = temp.find('"')
        name = temp[0:end]
        if name == "ass=" : continue
        restaurants.append(name)
        count += 1
        if count >= n : break

    return restaurants