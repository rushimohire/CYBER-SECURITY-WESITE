// Generate Captcha
function generateCaptcha() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let captcha = "";
  for (let i = 0; i < 6; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  document.getElementById("captcha").innerText = captcha;
}
generateCaptcha();

// Validate Login
function validateLogin() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  const captcha = document.getElementById("captcha").innerText;
  const inputCaptcha = document.getElementById("captchaInput").value;

  if (user === "admin" && pass === "admin123" && captcha === inputCaptcha) {
    window.location.href = "home.html";
    return false;
  } else {
    document.getElementById("error-msg").innerText = "Invalid credentials or captcha!";
    generateCaptcha();
    return false;
  }
}
