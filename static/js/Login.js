const togglePassword =document.getElementById("togglePassword");
const passwordField = document.getElementById("password");

togglePassword.addEventListener("click", function (){
    //controlla se la password è visibile o nascosta
    const type = passwordField.type === "password" ? "text" : "password";
    passwordField.type = type;

    this.classList.toggle('bi-eye');
    this.classList.toggle('bi-eye-slash');

});


const wrapper = document.querySelector(".wrapper");
const loginContainer = document.querySelector(".login-container");
const selectionContainer= document.querySelector(".selection-container");
const registerLink = document.querySelector(".register-link");


registerLink.addEventListener("click", function (e){
    e.preventDefault();
    loginContainer.style.display = 'none';
    wrapper.style.width = '100%';
    wrapper.style.height = 'auto';
    wrapper.style.justifyContent = 'initial'
    selectionContainer.style.display = 'block';
})


const userButtons = document.querySelectorAll(".select-user");
userButtons.forEach(button => {
    button.addEventListener("click", function (){
        const userType = this.getAttribute("data-user");
    });
});


const registerContainer = document.querySelector(".register-container");

function showRegisterForm(userType){
    const dynamicFields = document.getElementById("dynamic-fields")
    const certificatoContainer = document.getElementById("certificato-container")

    dynamicFields.innerHTML = '';
    certificatoContainer.style.display = 'none';
    selectionContainer.classList.add('hidden');
    selectionContainer.classList.remove('visible');

    selectionContainer.style.display = 'none';
    registerContainer.style.display = 'flex';
    registerContainer.classList.add('visible');


    let fields = [];

    if (userType === 'atleta') {
        fields = [
            { id: 'nome', placeholder: 'Nome', type: 'text', name:'name' },
            { id: 'cognome', placeholder: 'Cognome', type: 'text', name:'surname' },
            { id: 'email', placeholder: 'Email', type: 'email', name:'email' },
            { id: 'username', placeholder: 'Username', type: 'text', name:'username' },
            { id: 'telefono', placeholder: 'Telefono', type: 'text', name: 'phone_number' }
        ];
    } else if (userType === 'palestra') {
        fields = [
            { id: 'nome-titolare', placeholder: 'Nome Titolare', type: 'text', name:'name' },
            { id: 'cognome-titolare', placeholder: 'Cognome Titolare', type: 'text', name:'surname' },
            { id: 'email-titolare', placeholder: 'Email Titolare', type: 'email', name:'email' },
            { id: 'username-struttura', placeholder: 'Username Struttura', type: 'text', name:'username' },
            { id: 'telefono-titolare', placeholder: 'Telefono Titolare', type: 'text', name:'phone_number' },
            { id: 'telefono-struttura', placeholder: 'Telefono Struttura', type: 'text', name:'gym_phone_number' }
        ];
    } else if (userType === 'trainer') {
        fields = [
            { id: 'nome', placeholder: 'Nome', type: 'text', name:'name' },
            { id: 'cognome', placeholder: 'Cognome', type: 'text', name:'surname' },
            { id: 'email', placeholder: 'Email', type: 'email', name:'email' },
            { id: 'username', placeholder: 'Username', type: 'text', name:'username' },
            { id: 'telefono', placeholder: 'Telefono', type: 'text', name:'phone_number' }
        ];
        certificatoContainer.style.display = 'block'; // Mostra certificato per il trainer
    }

    // Aggiungi un campo nascosto per userType
    const userTypeField = `
        <input type="hidden" name="userType" value="${userType}">
        `;
    dynamicFields.innerHTML += userTypeField;

    fields.forEach(field => {
        const inputHTML = `
            <div class="input-field-container">
                <input type="${field.type}"  name="${field.name}" placeholder="${field.placeholder}" id="${field.id}" class="input-field" required>
            </div>
        `;
        dynamicFields.innerHTML += inputHTML;
    });
}


userButtons.forEach(button => {
    button.addEventListener("click", function (){
        const userType = this.getAttribute("data-user");
        showRegisterForm(userType);
    })
})


document.getElementById('toggleRegisterPassword').addEventListener('click', function (){
    const registerPassword = document.getElementById("register-password");
    const type = registerPassword.type === 'password' ? 'text' : 'password';
    registerPassword.type = type;
    this.classList.toggle('bi-eye');
    this.classList.toggle('bi-eye-slash');
});


document.getElementById('toggleRepeatPassword').addEventListener('click', function (){
    const repeatPassword = document.getElementById("repeat-password");
    const type = repeatPassword.type === 'password' ? 'text' : 'password';
    repeatPassword.type = type;
    this.classList.toggle('bi-eye');
    this.classList.toggle('bi-eye-slash');
})

const passwordLink = document.querySelector('.password-link');
const passwordRecoveryContainer = document.querySelector('.password-recovery-container');

passwordLink.addEventListener('click', function (e) {
    e.preventDefault();
    loginContainer.style.display = 'none'; // Nascondi il contenitore login
    passwordRecoveryContainer.style.display = 'flex'; // Mostra il contenitore recupero password
});

const returnToLoginLink = document.getElementById('return-to-login');

returnToLoginLink.addEventListener('click', function (e) {
    e.preventDefault();
    passwordRecoveryContainer.style.display = 'none'; // Nascondi il contenitore recupero password
    loginContainer.style.display = 'flex'; // Mostra il contenitore login
});

const returnToLoginSelectionLink = document.getElementById('return-to-login-selection');

returnToLoginSelectionLink.addEventListener('click', function (e) {
    e.preventDefault();
    selectionContainer.style.display = 'none'; // Nascondi il contenitore di selezione utente
    loginContainer.style.display = 'flex'; // Mostra il contenitore di login
});

function resetWrapperSize() {
    wrapper.style.width = '30%'; // Dimensione originale
    wrapper.style.height = 'auto'; // Dimensione originale
    wrapper.style.justifyContent = 'flex-start'; // Posizionamento originale
}

// Recupero Password -> Torna alla schermata di login
returnToLoginLink.addEventListener('click', function (e) {
    e.preventDefault();
    passwordRecoveryContainer.style.display = 'none'; // Nascondi il contenitore recupero password
    loginContainer.style.display = 'flex'; // Mostra il contenitore login
    resetWrapperSize(); // Reset delle dimensioni del wrapper
});

// Selezione Utente -> Torna alla schermata di login
returnToLoginSelectionLink.addEventListener('click', function (e) {
    e.preventDefault();
    selectionContainer.style.display = 'none'; // Nascondi il contenitore di selezione utente
    loginContainer.style.display = 'flex'; // Mostra il contenitore di login
    resetWrapperSize(); // Reset delle dimensioni del wrapper
});

const returnToSelectionLink = document.getElementById('return-to-selection');

returnToSelectionLink.addEventListener('click', function (e) {
    e.preventDefault();
    registerContainer.style.display = 'none'; // Nascondi il contenitore registrazione (indipendentemente dall'utente scelto)
    selectionContainer.style.display = 'flex'; // Mostra il contenitore di selezione utente
    selectionContainer.classList.remove('hidden'); // Assicurati che sia visibile
    selectionContainer.classList.add('visible'); // Aggiungi la classe visibile
});
