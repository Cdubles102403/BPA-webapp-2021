$(function(){
    //load header
    $('div#header').load('header.html')
    let token  = localStorage.getItem('token');
    console.log(token)
    if(token == null){
        window.location.href = "/login.html"
    }
})