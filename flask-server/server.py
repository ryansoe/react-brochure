from flask import Flask, jsonify, request
from flask_cors import CORS
from bs4 import BeautifulSoup
import requests


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

@app.route('/')
def something():
    return {'poop':'poop'}


@app.route("/search", methods=['POST'])
def search():
    data = request.get_json()
    place = data['userInput']

    return search_rest(place)

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

    return jsonify(restaurants)

if __name__ == "__main__":
    app.run(debug = True)