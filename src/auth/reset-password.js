const supabase = window.supabaseClient;
const errorMsg = document.getElementById("errorMsg");

document.getElementById("reset-password-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  errorMsg.textContent = "";

  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirm").value;

  if (password !== confirm) {
    errorMsg.textContent = "Passwords do not match";
    return;
  }

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    errorMsg.textContent = "Invalid or expired reset link. Please request a new one.";
    return;
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    errorMsg.textContent = error.message;
    return;
  }

  window.location.href = "./login.html";
});
