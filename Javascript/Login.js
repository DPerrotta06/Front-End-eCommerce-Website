$(document).ready(function(){
    $("#Login-Form").on("submit", function(){
        var email = $("#email");
        var password = $("#password");
        var remember = $("#enable-cookies").is(":checked");
        if(!email || !password){
            alert("Please fill in all the required fields in order to proceed.");
            return;
        }
        $.ajax({
            url: "https//reqres.in",
            method: "POST",
            contentType: "application/json", //go back to this later
            data: JSON.stringify({email: email, password: password}),
            success: function(response){
                if(remember){
                    document.cookie ="token=${response.token}; path=/ max-age=86400";      
                }else{
                    document.cookie ="token=${response.token}; path=/"; //don't enable cookies
                }
                window.location.href="../HTML/Home Page.html"; //opens the main page
            },
            error: function(){
                alert("Email or password entered may be incorrect.");
            },
            complete: function(){
                $("#Login-Btn").prop("disabled", false).text("Login"); //disables the login button
            }
        });
    });
});