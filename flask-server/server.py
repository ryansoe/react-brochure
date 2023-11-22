from flask import Flask, request
from flask_cors import CORS
import scraping
import weather


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

@app.route('/')
def something():
    return {'poop':'poop'}


@app.route("/search", methods=['POST'])
def search():
    data = request.get_json()
    place = data['userInput']

    return scraping.search_rest(place)


if __name__ == "__main__":
    app.run(debug = True)