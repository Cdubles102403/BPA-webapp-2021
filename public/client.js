$(function () {
  //sign in
  $("button#signInSubmit").click(function () {
    //get login values
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
          if(res.redirect == 'home'){
            let token = res.token
            localStorage.setItem('token', token);
            window.location.href = "/home.html"
          }
        });
    }
  });

  //sign up
  $("button#signUpSubmit").click(function () {
    if($("input#signPassword").val() == $("input#passwordConfirm").val()){
      //passwords match
      const payload = {
        body: JSON.stringify({
          Fname: $("input#Fname").val(),
          Lname: $("input#Lname").val(),
          username: $("input#signUsername").val(),
          email: $("input#email").val(),
          password: $("input#signPassword").val(),
        }),
        method: "post",
        headers: {
          "content-type": "application/json",
        },
      };
      fetch("/signup", payload)
        .then(res => res.json())
        .then((res)=>{
          if(res.redirect == 'home'){
            let token = res.token
            localStorage.setItem('token', token);
            window.location.href = "/home.html"
          }
        })
        
    }
    else{
      alert('passwords do not match')
    }
    
  });
});
