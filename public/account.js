$(function(){
    //load header
    $('div#header').load('header.html')
    let token  = localStorage.getItem('token');
    let username  = localStorage.getItem('username');
    let fname  = localStorage.getItem('fname');
    let lname  = localStorage.getItem('lname');
    let email = localStorage.getItem('email');

    console.log(token)
    $('div#account-details').append(
        
        `<div class = 'account-info'>
                    <h1>Account Info</h1>
                    <label for="eventName"><h3>Username:</h3></label>
                    <p>${username}</p> <br>
                    <label for="eventName"><h3>First Name:</h3></label>
                    <p>${fname}</p> <br>
                    <label for="eventName"><h3>Last Name:</h3></label>
                    <p>${lname}</p> <br>
                    <label for="eventName"><h3>Email:</h3></label>
                    <p>${email}</p> <br>
                    </div>`


    )

    if(token == null){
        window.location.href = "/login.html"
    }
})