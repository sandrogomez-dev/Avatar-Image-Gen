// Seleccionar elementos del dom
const generateBtn = document.querySelector(".btn-generate");
const avatarBox = document.querySelector(".avatar-box");
const loading = document.querySelector(".loading");
const categorySelector = document.querySelector(".category-selector");

loading.style.display = "none";

generateBtn.addEventListener("click", async () => {
  // sacar la categoria seleccionada
  const category = categorySelector.value;
  // Mostrar loading
  loading.style.display = "block";
  // Peticion ajax al backend
  try {
    const response = await fetch("http://localhost:3000/api/gen-img", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ category }),
    });

    let data = await response.json();

    // incrustrar la imagen en la caja de avatar
    if (data && data.imageUrl) {
      avatarBox.innerHTML = `<img src="${data.imageUrl}" alt="Avatar" />`;
    } else {
      alert("Error al generar la imagen");
    }
  } catch (error) {
    console.log("Error al generar la imagen:", error);
    alert("Error al generar la imagen");
  } finally {
    // Ocultar loading
    loading.style.display = "none";
  }
  // incrustrar la imagen en la caja de avatar
});
