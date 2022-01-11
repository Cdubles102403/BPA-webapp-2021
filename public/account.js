$(function(){
    //load header
    $('div#header').load('header.html')
    let token  = localStorage.getItem('token');
    let username = localStorage.getItem('username');

    console.log(token)
    console.log(localStorage.getItem('email'))

    if(token == null){
        window.location.href = "/login.html"
    }
})