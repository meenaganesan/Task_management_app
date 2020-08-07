const API_URL = 'https://task-management-rest-app.herokuapp.com'

export function makeApiCall(url, method, body) {
    fetch(API_URL+url, {
        method: method,
        headers: {
            'Content-Type':'application/json'
        },
        body: body ? JSON.stringify(body) : null
    })
    .then((response) => response.json())
    .then((result) => {return result})
    .catch((error) => {
        console.log(error)
        return error;
      });
}