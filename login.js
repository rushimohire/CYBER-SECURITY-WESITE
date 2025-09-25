let captchaCode = "";

// Generate captcha on page load
window.onload = generateCaptcha;

function generateCaptcha() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  captchaCode = "";
  for (let i = 0; i < 6; i++) {
    captchaCode += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  document.getElementById("captcha").innerText = captchaCode;
}

// Validate login


function validateLogin(){
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  let captcha = document.getElementById("captcha").innerText;
  let captchaInput = document.getElementById("captchaInput").value;
  let errorMsg = document.getElementById("error-msg");

  if(username === "" || password === ""){
    errorMsg.textContent = "❌ All fields are required!";
    return false;
  }
  if(captchaInput !== captcha){
    errorMsg.textContent = "❌ Captcha incorrect!";
    generateCaptcha();
    return false;
  }

  alert("✅ Login Successful! Welcome back " + username);
  // ✅ Redirect to home.html after success
  window.location.href = "home.html";
  return false;
}