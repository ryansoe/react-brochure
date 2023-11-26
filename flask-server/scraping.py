from bs4 import BeautifulSoup
import requests

def search_rest(place):
    n = 10
    url = f"https://www.yelp.com/search?find_desc=food&find_loc={place}"

    try:
        res = requests.get(url)
        # Check if the request was successful
        res.raise_for_status()
    except requests.RequestException as e:
        return f"Error during request: {e}"

    try:
        doc = BeautifulSoup(res.text, "html.parser")
        tag = doc.find_all("a")
    except Exception as e:
        return f"Error parsing HTML: {e}"

    restaurants = []
    count = 0
    for a in tag:
        line = str(a)
        if "css-19v1rkv" in line:
            start = line.find("name") + 6
            temp = line[start:]
            end = temp.find('"')
            name = temp[0:end]
            if name != "ass=":
                restaurants.append(name)
                count += 1
                if count >= n:
                    break

    if not restaurants:
        return ["No restaurants found."]
    
    return restaurants