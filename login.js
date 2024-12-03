<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="StyleLogin.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
</head>
<body>

<!-- main container "wrapper"-->
<div class="wrapper">
    <header class="header"> <!-- contains logo-->
        <img class="Logo_Login" src="Gym-Hub 3.png" alt="Logo">
    </header>

    <!-- Login section -->
    <div class="login-container">
        <form class="login-form">
            <input type="text" placeholder="Username" id="username" class="input-field" required>

            <div class="password-container">
                <input type="password" placeholder="Password" id="password" class="input-field" required>
                <i id="togglePassword" class="bi bi-eye"></i> <!-- eye icon-->
            </div>

            <p class="forgot-password-link">Hai dimenticato la <a href="#" class="password-link">Password?</a></p>
            <button type="submit" class="login-button"> Accedi </button>
            <button type="button" class="google-login-button">
                <i class="bi bi-google"></i> Accedi con Google
            </button>
            <div class="separator"></div>
            <p class="account-text">Non hai un account? <a href="#" class="register-link">Registrati</a></p>
        </form>
    </div>
    <!-- End of login section -->

    <!-- User selection -->
    <div class="selection-container" style="display: none;">
        <h2>Scegli il tipo di utente</h2>
        <div class="row">
            <!-- Athlete card -->
            <div class="col-md-4">
                <div class="card select-user" data-user="atleta">
                    <img src="Atleta.png" class="card-img-top" alt="Atleta">
                    <div class="card-body">
                        <h5 class="card-title">Atleta</h5>
                        <p class="card-text">Accedi a contenuti e servizi dedicati agli atleti</p>
                    </div>
                </div>
            </div>

            <!-- Gym card -->
            <div class="col-md-4">
                <div class="card select-user" data-user="palestra">
                    <img src="Palestra.png" class="card-img-top" alt="Palestra">
                    <div class="card-body">
                        <h5 class="card-title">Palestra</h5>
                        <p class="card-text">Gestisci la tua palestra e offri i tuoi servizi</p>
                    </div>
                </div>
            </div>

            <!-- Trainer card -->
            <div class="col-md-4">
                <div class="card select-user" data-user="trainer">
                    <img src="Personal_Trainer.png" class="card-img-top" alt="Personal Trainer">
                    <div class="card-body">
                        <h5 class="card-title">Personal Trainer</h5>
                        <p class="card-text">Collabora con gli atleti e palestre per crescere professionalmente</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="separator"></div>
        <p class="return-to-login-link"><a href="#" id="return-to-login-selection">Hai già un account?Torna al login</a></p>
    </div>

    <!--End of user selection -->


    <!-- Sign Up section -->
    <div class="register-container" style="display: none;">
        <h2 id="register-title">Registrazione</h2>
        <form id="register-form" class="login-form">
            <div id="dynamic-fields"></div>

            <div class="password-container">
                <input type="password" placeholder="Password" id="register-password" class="input-field" required>
                <i id="toggleRegisterPassword" class="bi bi-eye"></i>
            </div>

            <div class="password-container">
                <input type="password" placeholder="Ripeti Password" id="repeat-password" class="input-field" required>
                <i id="toggleRepeatPassword" class="bi bi-eye"></i>
            </div>

            <div id="certificato-container" style="display: none;" class="certificate-field-container">
                <label for="certificato" class="file-label">Inserisci Certificato (PDF)</label>
                <input type="file" id="certificato" class="file-input" accept=".pdf">
            </div>

            <button type="submit" class="login-button">Registrati</button>
        </form>
        <div class="separator"></div>
        <p class="return-to-selection-link">
            <a href="#" id="return-to-selection">Torna alla scelta dell'utente</a>
        </p>
    </div>



    <!-- Password Recovery section -->
    <div class="password-recovery-container" style="display: none;">
        <h2>Recupero Password</h2>
        <form class="login-form">
            <input type="text" placeholder="Inserisci indirizzo email o username" id="recovery-username" class="input-field" required>
            <button type="submit" class="login-button">Continua</button>
        </form>
        <div class="separator"></div>
        <p class="return-to-login-link"><a href="#" id="return-to-login">Torna alla schermata di login</a></p>
    </div>
    <!-- End of Password Recovery section -->


</div> <!-- end of wrapper-->
<script src="login.js"></script>
</body>
</html>
