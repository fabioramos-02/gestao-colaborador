document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    // Função para exibir o modal de feedback
    function showModal(message) {
        const modal = document.getElementById('modal');
        const modalMessage = document.getElementById('modalMessage');
        modalMessage.textContent = message;
        modal.style.display = 'block';

        const closeBtn = document.querySelector('.close-btn');
        closeBtn.onclick = function () {
            modal.style.display = 'none';
        }
    }

    // Login - Verificar as credenciais
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();

            if (!username || !password) {
                showModal('Por favor, preencha todos os campos.');
                return;
            }

            fetch(`http://localhost:3003/usuarios?nome=${encodeURIComponent(username)}&senha=${encodeURIComponent(password)}`)
                .then(response => response.json())
                .then(data => {
                    if (data.length > 0) {
                        // Armazenar o usuário logado no localStorage
                        localStorage.setItem('loggedInUser', JSON.stringify(data[0])); // Salva o usuário no localStorage
                        
                        // Redireciona para a tela inicial (home.html) se o login for bem-sucedido
                        window.location.href = 'home.html';
                    } else {
                        showModal('Credenciais incorretas.');
                    }
                })
                .catch(() => {
                    showModal('Erro ao tentar login.');
                });
        });
    }
});
