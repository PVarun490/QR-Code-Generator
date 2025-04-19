const wrapper = document.querySelector(".wrapper"),
  qrInput = wrapper.querySelector(".form input"),
  generateBtn = wrapper.querySelector(".form button"),
  qrImg = wrapper.querySelector(".qr-code img"),
  actions = document.querySelector(".actions"),
  downloadBtn = document.querySelector(".download-btn"),
  shareBtn = document.querySelector(".share-btn");

let preValue;

generateBtn.addEventListener("click", () => {
  const qrValue = qrInput.value.trim();
  if (!qrValue || preValue === qrValue) return;
  preValue = qrValue;
  generateBtn.innerText = "Generating QR Code...";
  qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrValue}`;
  qrImg.addEventListener("load", () => {
    wrapper.classList.add("active");
    generateBtn.innerText = "Generate QR Code";
    actions.classList.remove("hidden"); // Show buttons
  });
});

qrInput.addEventListener("keyup", () => {
  if (!qrInput.value.trim()) {
    wrapper.classList.remove("active");
    preValue = "";
    actions.classList.add("hidden"); // Hide buttons
  }
});

// Download QR Code
downloadBtn.addEventListener("click", () => {
  if (!qrImg.src) return;
  const link = document.createElement("a");
  link.href = qrImg.src;
  link.download = "qr-code.png";
  link.click();
});

// Share QR Code
shareBtn.addEventListener("click", async () => {
  if (!qrImg.src) return;
  try {
    const blob = await fetch(qrImg.src).then(res => res.blob());
    const file = new File([blob], "qr-code.png", { type: "image/png" });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: "QR Code",
        text: "Here's a QR code!",
        files: [file],
      });
    } else {
      alert("Your browser does not support file sharing.");
    }
  } catch (error) {
    alert("Sharing failed or is not supported.");
  }
});
