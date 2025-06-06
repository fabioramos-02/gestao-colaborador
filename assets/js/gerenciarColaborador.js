document.addEventListener('DOMContentLoaded', function () {
    const btnSair = document.getElementById('btnSair');
    if (btnSair) {
        btnSair.addEventListener('click', function () {
            localStorage.removeItem('loggedInUser');
            window.location.href = 'login.html'; // Redireciona para a página de login
        });
    }

    const modal = document.getElementById('modal');
    const closeBtn = document.querySelector('.close-btn');
    const userForm = document.getElementById('userForm');
    const submitBtn = document.getElementById('submitBtn');
    const collaboratorList = document.getElementById('collaboratorList');
    const btnAdicionarUsuario = document.getElementById('btnAdicionarUsuario');
    let currentCollaboratorId = null; // Para armazenar o ID do colaborador em edição

    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (!loggedInUser) {
        alert("Você não está logado.");
        window.location.href = "login.html";
        return;
    }

    function showModal(title, actionText) {
        document.getElementById('modalTitle').textContent = title;
        submitBtn.textContent = actionText;
        modal.style.display = 'block';
    }

    closeBtn.onclick = function () {
        modal.style.display = 'none';
        resetModal();
    }

    userForm.addEventListener('submit', function (e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const contact = document.getElementById('contact').value.trim();

        if (!username || !contact) {
            alert('Preencha todos os campos.');
            return;
        }

        const collaborator = { nome: username, contato: contact, userId: loggedInUser.id };

        if (currentCollaboratorId) {
            fetch(`http://localhost:3003/colaboradores/${currentCollaboratorId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(collaborator)
            })
                .then(response => response.json())
                .then(() => {
                    alert(`Colaborador ${username} atualizado com sucesso!`);
                    listarColaboradores(); // Atualiza a lista
                    resetModal();
                })
                .catch(error => alert('Erro ao atualizar o colaborador.'));
        } else {
            fetch('http://localhost:3003/colaboradores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(collaborator)
            })
                .then(response => response.json())
                .then(() => {
                    alert(`Colaborador ${username} cadastrado com sucesso!`);
                    listarColaboradores(); // Atualiza a lista
                    resetModal();
                })
                .catch(error => alert('Erro ao cadastrar o colaborador.'));
        }
    });

    function listarColaboradores() {
        fetch(`http://localhost:3003/colaboradores?userId=${loggedInUser.id}`)
            .then(res => res.json())
            .then(colaboradores => {
                collaboratorList.innerHTML = ''; // Limpa a lista de colaboradores
                colaboradores.forEach(collaborator => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${collaborator.nome}</td>
                        <td>${collaborator.contato}</td>
                        <td>
                            <button onclick="editarColaborador('${collaborator.id}')">Editar</button>
                            <button onclick="excluirColaborador('${collaborator.id}')">Excluir</button>
                        </td>
                    `;
                    collaboratorList.appendChild(tr);
                });
            })
            .catch(error => {
                alert('Erro ao carregar a lista de colaboradores.');
                console.log(error);
            });
    }

    window.editarColaborador = function (id) {
        fetch(`http://localhost:3003/colaboradores/${id}`)
            .then(res => res.json())
            .then(collaborator => {
                document.getElementById('username').value = collaborator.nome;
                document.getElementById('contact').value = collaborator.contato;
                currentCollaboratorId = collaborator.id;
                showModal('Editar Colaborador', 'Salvar Edição');
            })
            .catch(error => alert('Erro ao carregar os dados do colaborador.'));
    }

    window.excluirColaborador = function (id) {
        if (confirm('Tem certeza que deseja excluir este colaborador?')) {
            fetch(`http://localhost:3003/colaboradores/${id}`, { method: 'DELETE' })
                .then(() => {
                    alert('Colaborador excluído com sucesso!');
                    listarColaboradores(); // Atualiza a lista
                })
                .catch(error => {
                    alert('Erro ao excluir o colaborador.');
                    console.log(error);
                });
        }
    }

    function resetModal() {
        currentCollaboratorId = null;
        document.getElementById('username').value = '';
        document.getElementById('contact').value = '';
    }

    btnAdicionarUsuario.addEventListener('click', function () {
        resetModal();
        showModal('Cadastrar Novo Colaborador', 'Cadastrar');
    });

    listarColaboradores(); // Iniciar a listagem de colaboradores
});
