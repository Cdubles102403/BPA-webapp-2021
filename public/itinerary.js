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
                let eventData = res.eventData
                console.log(eventData)

                for(let i=0; i<eventData.length;i++){
                    $('table#itineraryTable').append(`</tr>
                    <tr>
                     <td>${eventData[i].name}</td>
                     <td>${eventData[i].place}</td>
                     <td>${eventData[i].time}</td>
                    </tr>
                    `)
                }
            })
})