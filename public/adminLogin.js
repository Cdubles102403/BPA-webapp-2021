$(function(){
    $('#signInSubmit').click(function(){
        let username = $("input#username").val();
        let password = $("input#password").val();

        const payload = {
            body: JSON.stringify({
              Username: username,
              Password: password,
            }),
            method: "post",
            headers: {
              "content-type": "application/json",
            },
          };
      
          if (username != "" && password != "") {
            fetch("/login", payload)
              .then((res) => res.json())
              .then((res) => {
                console.log(res)
                let token = res.token
                localStorage.setItem('token', token);
                console.log(res.admin)
                if(res.admin == 1){
                  console.log('is admin')
                  window.location.href = '/admin.html'
                }
              });
          }
    })
})