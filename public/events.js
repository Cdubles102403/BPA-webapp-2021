$(function(){
    //load header
    $('div#header').load('header.html')

    fetch('getAllEvents')
        .then((res)=>res.json())
        .then((res)=>{
            console.log(res)
            let data = res.data
            for(i=0; i<res.data.length; i++){
                $('div#allEvents').append(
                `<div class = 'event'>
                    <h2>${data[i].name}</h2>
                    <p>${data[i].time}</p>
                    <p>${data[i].place}</p>
                    <button onclick='joinEvent("${data[i].name}")'>join event</button>
                </div>`
                )
            }
        })
})

function joinEvent(name){
    let token  = localStorage.getItem('token');
    let payload ={
        body: JSON.stringify({
            token:token,
            event:name
        }),
        method: "post",
        headers: {
          "content-type": "application/json",
        },
      };
        fetch('/joinEvent',payload)
            .then((res)=>res.json)
            .then((res)=>{
                console.log(res)
            })

}