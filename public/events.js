$(function(){
    //load header
    $('div#header').load('header.html')

    fetch('getAllEvents')
        .then((res)=>res.json())
        .then((res)=>{
            console.log(res)
            let data = res.data
            let seatData = res.seatData
            console.log(seatData)
            for(let i=0; i<data.length; i++){
                let seats = []
                let seatsHTML
                //make seat array
                for(let y =0;y<data[i].seats;y++){
                    seats[y] = y+1
                }
                //console.log(seats)
                for(let x=0;x<seatData.length;x++){
                    //if seat event = event
                    //console.log(seatData[x].event == data[i].name)
                    if(seatData[x].event ==data[i].name){
                        //alert('seat found')
                        //remove seat from array
                        let index = seats.indexOf(seatData[x].seat)
                        seats.splice(index, 1);
                    }
                }
                for(let r = 0; r<seats.length;r++){
                    seatsHTML += `<option value="${seats[r]}">${seats[r]}</option>`
                    console.log(`Seat${data[i].name}`)
                }
                console.log(seats)
                $('div#allEvents').append(
                `<div class = 'event'>
                    <h2>${data[i].name}</h2>
                    <p>${data[i].time}</p>
                    <p>${data[i].place}</p>
                    <label for='seat'>available seats:</label>
                    <select id="Seat${data[i].name}" name='seat'>
                    ${seatsHTML}
                    </select>
                    <button onclick='joinEvent("${data[i].name}")'>join event</button>
                </div>`
                )
            }
        })
})

function joinEvent(name){
    let token  = localStorage.getItem('token');
    let seat = $(`select#Seat${name}`).val()
    console.log(seat)
    let payload ={
        body: JSON.stringify({
            token:token,
            event:name,
            seat:seat
        }),
        method: "post",
        headers: {
          "content-type": "application/json",
        },
      };
        fetch('/joinEvent',payload)
            .then((res)=>res.json())
            .then((res)=>{
                console.log(res)
            })

}