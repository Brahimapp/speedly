
document.addEventListener('DOMContentLoaded', () => {
    const getStartedBtn = document.getElementById('getStarted');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const authSection = document.getElementById('authSection');

    getStartedBtn.addEventListener('click', () => {
        authSection.scrollIntoView({ behavior: 'smooth' });
    });

    loginBtn.addEventListener('click', () => {
        authSection.scrollIntoView({ behavior: 'smooth' });
    });

    signupBtn.addEventListener('click', () => {
        authSection.scrollIntoView({ behavior: 'smooth' });
    });

    // Check if user is authenticated
    fetch('/api/hello')
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                loginBtn.style.display = 'none';
                signupBtn.style.display = 'none';
                authSection.innerHTML = `
                    <h3>Welcome to Your Dashboard</h3>
                    <p>Start monitoring speeds now!</p>
                    <button class="button-primary">Launch App</button>
                `;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
