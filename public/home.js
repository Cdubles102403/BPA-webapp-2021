$(function(){
    //load header
    $('div#header').load('header.html')
    let token  = localStorage.getItem('token');
    console.log(token)
    if(token == null){
        window.location.href = "/login.html"
    }
})

function makeEvent () {
    console.log('making event')
    let payload = {
        body: JSON.stringify({
            "eventTime": $("#eventTime").val(),
            "eventName": $("#eventName").val(),
            "eventPlace":$("#eventPlace").val()
        }),
        method: "post",
        headers: {
          "content-type": "application/json",
        },
      };
    fetch("/makeEvent", payload)
        .then((res)=>{
            console.log(res)
        })
}