let lastCapturedContact = null;

// Escutando a mensagem que indica que o login foi bem-sucedido
window.addEventListener('message', function(event) {
  if (event.data.action && event.data.action === 'loginSuccess') {
    console.log("Login bem-sucedido, iniciando monitoramento...");
    startMessageMonitoring();
  }
}, false);

// Função para monitorar as mensagens recebidas
function extractNumberAndName() {
  try {
    const messageElements = document.querySelectorAll(".message-in");

    messageElements.forEach((messageElement) => {
      if (messageElement.dataset.processed) return;
      messageElement.dataset.processed = true;

      const parentWithId = messageElement.closest("div[data-id]");
      if (parentWithId) {
        const dataId = parentWithId.getAttribute("data-id");
        if (dataId) {
          const match = dataId.match(/false_(\d+)@c\.us/);
          if (match && match[1]) {
            const contactNumber = match[1];
            if (lastCapturedContact === contactNumber) return;

            const nameElement = messageElement.querySelector("[aria-label]");
            let contactName = nameElement ? nameElement.getAttribute("aria-label") : "Nome não encontrado";
            contactName = contactName.trim().replace(/:$/, '');

            console.log(`Número de contato: ${contactNumber}, Nome: ${contactName}`);
            lastCapturedContact = contactNumber;
          }
        }
      }
    });
  } catch (error) {
    console.error("Erro ao capturar o número e nome do contato:", error);
  }
}

// Função para iniciar o monitoramento
function startMessageMonitoring() {
  const observer = new MutationObserver(() => {
    extractNumberAndName();
  });

  observer.observe(document.body, { childList: true, subtree: true });
  console.log("Monitoramento de mensagens iniciado...");
}