let translateButton = document.querySelector("#translateButton");

translateButton.addEventListener("click", async () => {
  let inputText = document.querySelector("#inputText");
  //valor a traducir
  const text = inputText.value.trim();

  // lenguaje de destino
  const targetLang = document.querySelector("#targetLang").value;

  if (!text) return false;
  // meter el mensaje del usuario a la caja de mensajes
  const userMessage = document.createElement("div");
  userMessage.className = "chat__message chat__message--user";
  userMessage.textContent = text;

  const messagesContainer = document.querySelector(".chat__messages");
  messagesContainer.appendChild(userMessage);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  // peticion ajax al backend
  try {
    const response = await fetch("/api/traducir", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, targetLang }),
    });

    const data = await response.json();
    //agragere el mensaje de la ia al chat

    alert(data.translatedText);
    const botMessage = document.createElement("div");
    botMessage.className = "chat__message chat__message--bot";
    botMessage.textContent = data.translatedText;
    messagesContainer.appendChild(botMessage);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  } catch (error) {
    console.log("Error:");
  }
  //agragere el mensaje de la ia al chat

  //vaciar el input de tipo texto

  inputText.value = "";
});
