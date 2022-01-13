$(function(){
    $('div#header').load('header.html')
    let token  = localStorage.getItem('token');
    let payload = {
        body: JSON.stringify({
            token:token
        }),
        method: "post",
        headers: {
          "content-type": "application/json",
        },
      };
        fetch('/getMyEvents',payload)
            .then((res) => res.json())
            .then((res)=>{
                let eventNames = res.eventNames
                let eventData = res.eventData
                console.log(eventData)

                for(let i=0; i<eventNames.length;i++){
                    console.log(eventNames[i].event)
                    $('table#itineraryTable').append(`</tr>
                    <tr>
                     <td>${eventNames[i].name}</td>
                     <td>${eventData[i].place}</td>
                     <td>${eventData[i].time}</td>
                    </tr>
                    `)
                }
            })
})