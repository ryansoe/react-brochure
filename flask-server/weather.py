import requests
from dotenv import load_dotenv
from flask import jsonify
from geopy.geocoders import Nominatim
import os

load_dotenv()   

def findlatlon(place):
    geolocator = Nominatim(user_agent="GetLoc")

    location = geolocator.geocode(place)

    return (location.latitude, location.longitude)

def weatherinfo(place, days_ahead):
    if days_ahead not in range(5):
        return False

    API_KEY = os.getenv('api_key')
    latlon = findlatlon(place)
    lat = str(int(latlon[0]))
    lon = str(int(latlon[1]))
    BASE_URL = "https://api.openweathermap.org/data/2.5/forecast?lat="+ lat +"&lon="+ lon +"&appid=" + API_KEY

    response = requests.get(BASE_URL).json()

    result_list = []

    for i in range(days_ahead * 8, (days_ahead * 8) + 5):
        temp = response['list'][i]['main']['temp']
        humidity = response['list'][i]['main']['humidity']
        main = response['list'][i]['weather'][0]['main']
        description = response['list'][i]['weather'][0]['description']
        time = response['list'][i]['dt_txt']
        icon = 'http://openweathermap.org/img/wn/' + response['list'][i]['weather'][0]['icon'] + '.png'
        result_list.append([temp, humidity, main, description, time, icon])

    return jsonify(result_list)

if __name__ == "__main__":
    print(weatherinfo('india', 0))