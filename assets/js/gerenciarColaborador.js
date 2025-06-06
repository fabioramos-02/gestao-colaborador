document.addEventListener('DOMContentLoaded', () => {
    const btnSair = document.getElementById('btnSair');
    const btnAdicionarUsuario = document.getElementById('btnAdicionarUsuario');
    const modal = document.getElementById('modal');
    const closeBtn = document.querySelector('.close-btn');
    const userForm = document.getElementById('userForm');
    const submitBtn = document.getElementById('submitBtn');
    const collaboratorList = document.getElementById('collaboratorList');

    let currentCollaboratorId = null;

    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
        alert('Você não está logado.');
        window.location.href = 'login.html';
        return;
    }

    btnSair.addEventListener('click', () => {
        localStorage.removeItem('loggedInUser');
        window.location.href = 'login.html';
    });

    btnAdicionarUsuario.addEventListener('click', () => {
        resetModal();
        showModal('Cadastrar Novo Colaborador', 'Cadastrar');
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        resetModal();
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            resetModal();
        }
    });

    userForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const contact = document.getElementById('contact').value.trim();
        const email = document.getElementById('email').value.trim();
        const role = document.getElementById('role').value.trim();

        if (!username || !contact || !email || !role) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        const collaborator = {
            nome: username,
            contato: contact,
            email: email,
            cargo: role,
            userId: loggedInUser.id
        };

        if (currentCollaboratorId) {
            // Editar colaborador
            fetch(`http://localhost:3003/colaboradores/${currentCollaboratorId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(collaborator)
            })
                .then(res => {
                    if (!res.ok) throw new Error('Erro ao atualizar');
                    return res.json();
                })
                .then(() => {
                    alert(`Colaborador ${username} atualizado com sucesso!`);
                    listarColaboradores();
                    modal.style.display = 'none';
                    resetModal();
                })
                .catch(() => alert('Erro ao atualizar o colaborador.'));
        } else {
            // Cadastrar novo colaborador
            fetch('http://localhost:3003/colaboradores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(collaborator)
            })
                .then(res => {
                    if (!res.ok) throw new Error('Erro ao cadastrar');
                    return res.json();
                })
                .then(() => {
                    alert(`Colaborador ${username} cadastrado com sucesso!`);
                    listarColaboradores();
                    modal.style.display = 'none';
                    resetModal();
                })
                .catch(() => alert('Erro ao cadastrar o colaborador.'));
        }
    });

    function listarColaboradores() {
        fetch(`http://localhost:3003/colaboradores?userId=${loggedInUser.id}`)
            .then(res => res.json())
            .then(colaboradores => {
                collaboratorList.innerHTML = '';
                colaboradores.forEach(c => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${c.nome}</td>
                        <td>
                            Contato: ${c.contato}<br>
                            Email: ${c.email || '-'}<br>
                            Cargo: ${c.cargo || '-'}
                        </td>
                        <td>
                            <button onclick="editarColaborador('${c.id}')">Editar</button>
                            <button onclick="excluirColaborador('${c.id}')">Excluir</button>
                        </td>
                    `;
                    collaboratorList.appendChild(tr);
                });
            })
            .catch(() => alert('Erro ao carregar colaboradores.'));
    }

    window.editarColaborador = function(id) {
        fetch(`http://localhost:3003/colaboradores/${id}`)
            .then(res => res.json())
            .then(c => {
                document.getElementById('username').value = c.nome;
                document.getElementById('contact').value = c.contato;
                document.getElementById('email').value = c.email || '';
                document.getElementById('role').value = c.cargo || '';
                currentCollaboratorId = c.id;
                showModal('Editar Colaborador', 'Salvar Edição');
            })
            .catch(() => alert('Erro ao carregar colaborador.'));
    };

    window.excluirColaborador = function(id) {
        if (confirm('Tem certeza que deseja excluir este colaborador?')) {
            fetch(`http://localhost:3003/colaboradores/${id}`, {
                method: 'DELETE'
            })
                .then(res => {
                    if (!res.ok) throw new Error('Erro ao excluir');
                    alert('Colaborador excluído com sucesso!');
                    listarColaboradores();
                })
                .catch(() => alert('Erro ao excluir colaborador.'));
        }
    };

    function resetModal() {
        currentCollaboratorId = null;
        userForm.reset();
    }

    function showModal(title, actionText) {
        document.getElementById('modalTitle').textContent = title;
        submitBtn.textContent = actionText;
        modal.style.display = 'block';
    }

    listarColaboradores();
});
