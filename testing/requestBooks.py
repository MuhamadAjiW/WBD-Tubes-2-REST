import requests

def addBook():
    url = "http://localhost:8011/api/books"
    
    data = {
        "title": "Judul Buku 15",
        "synopsis": "Ini judul buku 15",
        "genre": "Romance",
        "release_date": "2023-10-02",
        "word_count": "100",
        "duration": "40",
        "graphic_cntn": "true",
        "image_path": "/storage/images/image1.jpg",
        "audio_path": "/storage/audios/audio1.mp3",
        "author_id": "1",
    }
    
    headers = {'Content-Type': 'application/json'}
    
    response = requests.post(url, json=data, headers=headers)
    return response

def getBooks():
    url = "http://localhost:8011/api/books"
    
    response = requests.get(url)
    return response

def getOneBook(identifier):
    url = "http://localhost:8011/api/books/" + str(identifier)
    
    response = requests.get(url)
    return response

def deleteBook(bookp_id: int):
    url = "http://localhost:8011/api/books/" + str(bookp_id)
    
    response = requests.delete(url)
    return response

if __name__ == "__main__":
    response = getBooks()
    
    print("\nstatus code:", response.status_code)
    print("Response content:")
    print(response.text)