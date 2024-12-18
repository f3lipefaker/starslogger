// Função para inserir o modal de login na página
function injectLoginModal() {
  // Criar o HTML do modal com a cor de fundo azul
  const modalHtml = `
    <div id="login-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;">
      <div class="modal-content" style="background-color: #f0f0f0; padding: 30px; border-radius: 8px; text-align: center; width: 350px; box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #4CAF50; font-family: Arial, sans-serif;">Login</h2>
        <input type="email" id="email" placeholder="Email" required style="width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;" />
        <input type="password" id="password" placeholder="Senha" required style="width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;" />
        <button id="login-btn" style="width: 100%; padding: 12px; background-color: #007BFF; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;">Entrar</button>
      </div>
    </div>
  `;
  
  // Inserir o modal no body da página
  document.body.insertAdjacentHTML('beforeend', modalHtml);

  // Adicionar o evento de clique ao botão "Entrar"
  document.getElementById('login-btn').addEventListener('click', handleLogin);
}

// Função de login
function handleLogin() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (email && password) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
          "email": email,
          "password": password
      });

      const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow"
      };

      // Fazendo o login
      fetch("https://auth-stars.viptech.com.br/api/v1/auth", requestOptions)
          .then((response) => response.json()) // Esperando a resposta como JSON
          .then((result) => {          
              if (result.token) {
                  // Armazenar o token no localStorage
                  localStorage.setItem("token", result.token);

                  // Fechar o modal após login bem-sucedido
                  document.getElementById('login-modal').style.display = 'none';

                  // Agora você pode iniciar o monitoramento ou outras ações
                  window.postMessage({ action: 'loginSuccess' }, '*');
              } else {
                  alert("Erro: " + result.message);
              }
          })
          .catch((error) => {
              console.error("Erro ao tentar autenticar:", error);
              alert("Erro ao tentar fazer login.");
          });
  } else {
      alert("Por favor, insira seu email e senha.");
  }
}

// Aguarda o carregamento completo da página antes de injetar o modal
window.onload = function () {
  injectLoginModal();
};
