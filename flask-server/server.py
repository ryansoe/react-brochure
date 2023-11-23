from flask import Flask, request, jsonify
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
    data_return = {}

    data = request.get_json()
    place = data['userInput']

    data_return["Rest"] = scraping.search_rest(place)
    data_return["Weather"] = weather.weatherinfo(place)[0]

    return jsonify(data_return)


if __name__ == "__main__":
    app.run(debug = True)