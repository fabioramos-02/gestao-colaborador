document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('registerForm');
    
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

    // Função para cadastrar novo usuário
    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const newUsername = document.getElementById('newUsername').value.trim();
        const newPassword = document.getElementById('newPassword').value.trim();

        if (!newUsername || !newPassword) {
            showModal('Por favor, preencha todos os campos.');
            return;
        }

        const user = {
            nome: newUsername,
            senha: newPassword
        };

        // Enviar para o JSON Server para adicionar o novo usuário
        fetch('http://localhost:3003/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        .then(response => response.json())
        .then(data => {
            showModal(`Usuário ${data.nome} cadastrado com sucesso!`);
            setTimeout(() => {
                window.location.href = 'login.html'; // Redireciona para a página de login após cadastro
            }, 1500);
        })
        .catch(error => showModal('Erro ao tentar cadastrar o usuário.'));
    });
});
