const signUpBtnLink = document.querySelector('.signUpBtn-link');
const signInBtnLink = document.querySelector('.signInBtn-link');
const wrapper = document.querySelector('.wrapper');

signUpBtnLink.addEventListener('click', () =>{
    wrapper.classList.toggle('active');
});

signInBtnLink.addEventListener('click', () =>{
    wrapper.classList.toggle('active');
});


function swapTexts() {
    // تحديد العناصر التي سيتم تبديل نصوصها
    var elements = [
        document.querySelector('.header-login h4'),
        document.querySelector('.signUp-link .signUpBtn-link'),
        document.querySelector('.signIn-link .signInBtn-link')
    ];

    // تبديل النصوص لكل عنصر
    elements.forEach(el => {
        el.textContent = el.textContent === 'Login' ? 'Sign Up' : 'Login';
    });
}

