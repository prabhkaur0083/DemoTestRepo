
const baseUrl = "https://infin-backend-container-eygdbefchbcqg8e8.centralindia-01.azurewebsites.net"
async function loginUser(formData) {
    try {
        const response = await fetch(`${baseUrl}/api/v1/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'  // Set content type to JSON
            },
            body:  JSON.stringify(formData)
        });
        
        
        const data = await response.json();

        if (data.Status === 1) {
            storeToken(data.Data.Token);
            await fetchProtectedResource(data.token);
        } else {
            errorMessageElement.textContent = 'Invalid Email or Password, Please Check Your Credentials';
			errorMessageElement.style.display = 'block';
        }
    } catch (error) {
        console.error('Error during login:', error);
        showErrorMessage('Invalid Email or Password, Please Check Your Credentials');
    }
}

function storeToken(token) {
    localStorage.setItem('token', token);
}

async function fetchProtectedResource(token) {
    try {
       
        window.location.href = "../";
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

function showLoader() {
    document.getElementById('loader').style.display = 'block';
    document.getElementById("wrapper").classList.add("blur");
  }
  
  function hideLoader() {
    document.getElementById('loader').style.display = 'none';
    document.getElementById("wrapper").classList.remove("blur");
  }
  

function showErrorMessage(message) {
    const errorMessageElement = document.getElementById('error-message'); // Assuming there's an element with this ID
    errorMessageElement.textContent = message;
    errorMessageElement.style.display = 'block';
}

async function deleteToken(token) {
    try {
        const response = await fetch(`${baseUrl}/api/v1/usertoken/delete/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: token }),
        });

        const data = await response.json();

        if (data.error) {
            console.error('Error:', data.error);
        } else {
            console.log('Success:', data.message);
        }

        // Clear the token from local storage
        localStorage.removeItem('token');

        // Redirect to the login page or another appropriate page
        window.location.href = '/Frontend/Login/index.html';

    } catch (error) {
        console.error('Error:', error);
    }
}

async function verifyToken() {
    try {

        document.getElementById("wrapper").classList.add("blur");

        const response = await fetch(`${baseUrl}/api/v1/usertoken/verify/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token') // Add token from localStorage or cookie
            },
            body: JSON.stringify({}) // Body can be empty if no data is needed in the request body
        });

        const data = await response.json();

        if (response.ok) {

            if (data.Status == 1 ){
                console.log('Token verified:', data);
            }
            else {
                console.error('Token verification failed:', data);
                window.location.href = '/Frontend/Login/index.html';  // Redirect to login page if token is invalid or expired
        }
            
            
            // Proceed with the next steps after token verification
        } else {
            console.error('Something Went Wrong:', data);
            window.location.href = '/Frontend/Login/index.html';  // Redirect to login page if token is invalid or expired
        }
        
        hideLoader();

    } catch (error) {
        console.error('Error verifying token:', error);
         window.location.href = '/Frontend/Login/index.html';  // Redirect to login page in case of any error
    }
}
