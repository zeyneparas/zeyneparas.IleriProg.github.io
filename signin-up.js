document.getElementById('signInForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    const enteredEmail = document.getElementById('email').value;
    const enteredPassword = document.getElementById('password').value;

    if (storedUser && enteredEmail === storedUser.email && enteredPassword === storedUser.password) {
        alert('Login Successful! Redirecting to homepage.');
        window.location.href = 'indexz.html';
    } else {
        alert('Invalid credentials!');
    }
});

document.getElementById('goToSignUp').addEventListener('click', function() {
    document.querySelector('.container').style.display = 'none';
    document.getElementById('signupContainer').style.display = 'block';
});

document.getElementById('goToSignIn').addEventListener('click', function() {
    document.getElementById('signupContainer').style.display = 'none';
    document.querySelector('.container').style.display = 'block';
});

document.getElementById('signUpForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const rePassword = document.getElementById('rePassword').value;

    if (password !== rePassword) {
        alert('Passwords do not match! Please try again.');
        return;
    }

    const user = {
        name: name,
        surname: surname,
        email: email,
        password: password
    };

    localStorage.setItem('currentUser', JSON.stringify(user));
    alert('Sign-up successful!');

    document.getElementById('signupContainer').style.display = 'none';
    document.querySelector('.container').style.display = 'block';
});
