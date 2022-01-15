$(function(){
  //load header
  $('div#header').load('header.html')
  let token  = localStorage.getItem('token');
  console.log(token)
  if(token == null){
      window.location.href = "/login.html"
  }
  
  let payload ={
      body: JSON.stringify({
          'token':localStorage.getItem('token')
      }),
      method: "post",
      headers: {
        "content-type": "application/json",
      },
    };
  fetch('/checkLogin',payload)
      .then((res) => res.json())
      .then((res)=>{
          if(res.message == 'bad-check'){
              window.location.href = '/index.html'
          }
      })

})

function makeEvent () {
  console.log('making event')
  let payload = {
      body: JSON.stringify({
          "eventTime": $("#eventTime").val(),
          "eventName": $("#eventName").val(),
          "eventPlace":$("#eventPlace").val(),
          "seats":$('#seats').val(),
          'token':localStorage.getItem('token')
      }),
      method: "post",
      headers: {
        "content-type": "application/json",
      },
    };
  fetch("/makeEvent", payload)
      .then((res)=>{console.log(res)})
}