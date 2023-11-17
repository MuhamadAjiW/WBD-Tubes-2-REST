import requests
import datetime

def registerbase():
    url = "http://localhost:8011/api/authors"

    data = {
        "email": "dummy1@example.com",
        "username": "dummy_user1",
        "password": "dummy_password",
        "name": "Dummy Name",
        "bio": "This is a dummy bio"
    }
    headers = {'Content-Type': 'application/json'}

    response = requests.post(url, json=data, headers=headers)
    return response

def register(email, username, password, name, bio):
    url = "http://localhost:8011/api/authors"

    data = {
        "email": email,
        "username": username,
        "password": password,
        "name": name,
        "bio": bio
    }
    headers = {'Content-Type': 'application/json'}

    response = requests.post(url, json=data, headers=headers)
    return response

def addBook(title, synopsis, genre, release_date, word_count, duration, graphic_cntn, image_path, audio_path, author_id):
    url = "http://localhost:8011/api/books"
        
    data = {
        "title": title,
        "synopsis": synopsis,
        "genre": genre,
        "release_date": release_date,
        "word_count": word_count,
        "duration": duration,
        "graphic_cntn": graphic_cntn,
        "image_path": image_path,
        "audio_path": audio_path,
        "author_id": author_id,
    }
    
    headers = {'Content-Type': 'application/json'}
    
    response = requests.post(url, json=data, headers=headers)
    return response

def addPlaylist():
    url = "http://localhost:8011/api/books"
        
    data = {

    }
    
    headers = {'Content-Type': 'application/json'}
    
    response = requests.post(url, json=data, headers=headers)
    return response

def addPlaylistBook():
    url = "http://localhost:8011/api/books"
        
    data = {
    }
    
    headers = {'Content-Type': 'application/json'}
    
    response = requests.post(url, json=data, headers=headers)
    return response


if __name__ == "__main__":
    response = register()
    
    print("\nstatus code:", response.status_code)
    print("Response content:")
    print(response.text)