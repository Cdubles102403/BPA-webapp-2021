$(function(){
    //fill events table
    fetch('/getAllEvents')
        .then((res)=>res.json())
        .then((res)=>{
            console.log(res)
            for(let i=0; i<res.data.length;i++){
                $('table#eventTable').append(`
                <tr>
                <td>${res.data[i].name}</td>
                <td>${res.data[i].place}</td>
                <td>${res.data[i].time}</td>
                <td>${res.data[i].seats}</td>
            </tr>
                `)
            }
        })

    //fill account table
    fetch('/getAllAccounts')
        .then((res)=>res.json())
        .then((res)=>{
            console.log(res)

            for(let i=0; i<res.data.length;i++){
                $('table#accountTable').append(`
                <tr>
                <td>${res.data[i].usernmae}</td>
                <td>${res.data[i].Fname}</td>
                <td>${res.data[i].Lname}</td>
                <td>${res.data[i].email}</td>
            </tr>
                `)
            }
        })
})