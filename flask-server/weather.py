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

def weatherinfo(place):
    # if days_ahead not in range(5):
    #     return False

    API_KEY = os.getenv('api_key')
    latlon = findlatlon(place)
    lat = str(int(latlon[0]))
    lon = str(int(latlon[1]))
    BASE_URL = "https://api.openweathermap.org/data/2.5/forecast?lat="+ lat +"&lon="+ lon +"&appid=" + API_KEY

    response = requests.get(BASE_URL).json()

    result_list = []

    for i in range(40):
        temp = 'Temperature: '+ str(int((float(response['list'][i]['main']['temp']) - 273.15) * 1.8 + 32)) + ' F'
        humidity = 'Humidity: ' + str(response['list'][i]['main']['humidity']) + '%'
        main = 'Weather: ' + response['list'][i]['weather'][0]['main']
        description = 'Description: ' + response['list'][i]['weather'][0]['description']
        time = 'Time: ' + response['list'][i]['dt_txt']
        icon = 'Icon: ' + 'http://openweathermap.org/img/wn/' + response['list'][i]['weather'][0]['icon'] + '.png'
        result_list.append([temp, humidity, main, description, time, icon])

    return result_list

if __name__ == "__main__":
    print(weatherinfo('india', 0))