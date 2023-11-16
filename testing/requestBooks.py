import datetime
import requests

def addBook():
    url = "http://localhost:8011/api/books"
    
    date = datetime.datetime(2020, 5, 17)
    release_date = date.strftime("%Y-%m-%dT%H:%M:%S.%fZ")
    
    data = {
        "title": "Judul Buku 1",
        "synopsis": "Ini judul buku 1",
        "genre": "Romance",
        "release_date": release_date,
        "word_count": 100,
        "duration": 40,
        "graphic_cntn": True,
        "image_path": "static/images/image1.png",
        "audio_path": "static/audios/audio1.mp3",
        "author_id": 1,
    }
    
    headers = {'Content-Type': 'application/json'}
    
    response = requests.post(url, json=data, headers=headers)
    return response

def editBook(bookp_id):
    url = "http://localhost:8011/api/books/" + str(bookp_id)
    
    date = datetime.datetime(2021, 5, 17)
    release_date = date.strftime("%Y-%m-%dT%H:%M:%S.%fZ")
    
    data = {
        "title": "Judul Buku 16",
        "synopsis": "Ini judul buku 16",
        "genre": "Fiction",
        "release_date": release_date,
        "word_count": 100,
        "duration": 40,
        "graphic_cntn": True,
        "image_path": "static/images/image1.png",
        "audio_path": "static/audios/audio1.mp3",
        "author_id": 1,
    }
    
    headers = {'Content-Type': 'application/json'}
    
    response = requests.patch(url, json=data, headers=headers)
    return response

def getBooks():
    url = "http://localhost:8011/api/books"
    
    response = requests.get(url)
    return response

def getOneBook(author_id):
    url = "http://localhost:8011/api/books/author/" + str(author_id)
    
    response = requests.get(url)
    return response

def deleteBook(bookp_id: int):
    url = "http://localhost:8011/api/books/" + str(bookp_id)
    
    response = requests.delete(url)
    return response

if __name__ == "__main__":
    response = addBook()
    
    print("\nstatus code:", response.status_code)
    print("Response content:")
    print(response.text)