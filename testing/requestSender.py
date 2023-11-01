import requests

def register():
    url = "http://localhost:8011/api/authors/register"

    data = {
        "email": "dummy@example.com",
        "username": "dummy_user",
        "password": "dummy_password",
        "name": "Dummy Name",
        "bio": "This is a dummy bio"
    }
    headers = {'Content-Type': 'application/json'}

    response = requests.post(url, json=data, headers=headers)
    return response

def login():
    url = "http://localhost:8011/api/authors/login"

    data = {
        "email": "dummy@example.com",
        "password": "dummy_password",
    }
    headers = {'Content-Type': 'application/json'}

    response = requests.post(url, json=data, headers=headers)
    return response

def check(token):
    url = "http://localhost:8011/api/authors/token/check"

    headers = {'Authorization': 'Bearer ' + str(token)}

    response = requests.get(url, headers=headers)
    
    return response

def getAuthor(identifier):
    url = "http://localhost:8011/api/authors/" + str(identifier)

    response = requests.get(url)
    return response





if __name__ == "__main__":
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRob3JfaWQiOjEsImlhdCI6MTY5ODgzODk4NCwiZXhwIjoxNjk4ODQyNTg0fQ.y8OPGQ6GvfTTnzwlYOuQH7k0UxqnUCBIQE8ic1aayw4"
    response = check(token)

    print("\nstatus code:", response.status_code)
    print("Response content:")
    print(response.text)