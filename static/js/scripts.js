$("form[name=signup_form]").submit(function(e){
    var $form = $(this);
    var $error = $form.find(".error");
    var data = $form.serialize();

    $.ajax({
        url:"user/signup",
        type:"POST",
        data: data,
        dataType: "json",
        success: function (resp){
            if(resp.success) {
                Swal.fire({
                    title:'Registrazione completata!',
                    text: 'Benvenuto su gymhub',
                    icon: 'success',
                    confirmButtonText: 'Vai al login'
                }).then(()=> {
                    window.location.href = resp.redirect;
                });

            } else{
                $error.text("signup completed, but no redirect specified.").removeClass("error-hidden");
            }
        },
        error: function(resp){
            console.log(resp);
            $error.text(resp.responseJSON.error).removeClass("error-hidden");
        }
    });

    e.preventDefault();
})

$("form[name=login_form]").submit(function(e){
    var $form = $(this);
    var $error = $form.find(".error");
    var data = $form.serialize();


    $.ajax({
        url: "user/login",
        type:"POST",
        data: data,
        dataType: "json",
        success: function(resp){
            Swal.fire({
                    title:'Login effettuato con successo!',
                    text: 'Reindirizzamento alla homepage...',
                    imageUrl:"/static/img/Gym-Hub 3.png",
                    imageWidth: 200,
                    imageHeight: 100,
                    imageAlt: "custom image",
                    timer:1500,
                    showConfirmButton: false
                }).then(()=> {
                    window.location.href = resp.redirect;
                });
        },
        error: function(resp){
          console.log(resp);
          $error.text(resp.responseJSON.error).removeClass("error-hidden");

        }
    });

    e.preventDefault();
})


