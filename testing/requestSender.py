import requests

def register():
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

def login():
    url = "http://localhost:8011/api/token"

    data = {
        "email": "dummy1@example.com",
        "password": "dummy_password",
    }
    headers = {'Content-Type': 'application/json'}

    response = requests.post(url, json=data, headers=headers)
    return response

def check(token):
    url = "http://localhost:8011/api/token/id"

    headers = {'Authorization': 'Bearer ' + str(token)}

    response = requests.get(url, headers=headers)
    
    return response

def getAuthor(identifier):
    url = "http://localhost:8011/api/authors/" + str(identifier)

    response = requests.get(url)
    return response

def getAuthors():
    url = "http://localhost:8011/api/authors"

    response = requests.get(url)
    return response

def editAuthor(author_id: int):
    url = "http://localhost:8011/api/authors/" + str(author_id)

    data = {
        "email": "dummy4@example.com",
    }
    headers = {'Content-Type': 'application/json'}

    response = requests.patch(url, json=data, headers=headers)
    return response

def deleteAuthor(author_id: int):
    url = "http://localhost:8011/api/authors/" + str(author_id)

    response = requests.dedlete(url)
    return response

def testSOAP():
    url = "http://localhost:8011/api/soap/test"

    response = requests.get(url)
    return response

if __name__ == "__main__":
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRob3JfaWQiOjEsImlhdCI6MTY5ODgzODk4NCwiZXhwIjoxNjk4ODQyNTg0fQ.y8OPGQ6GvfTTnzwlYOuQH7k0UxqnUCBIQE8ic1aayw4"
    response = register()
    
    print("\nstatus code:", response.status_code)
    print("Response content:")
    print(response.text)