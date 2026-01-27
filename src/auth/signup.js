const supabaseClient = window.supabaseClient;
const errorMsg = document.getElementById("errorMsg");

// -------------------------
// AUTH STATE LISTENER
// -------------------------
supabaseClient.auth.onAuthStateChange(async (event, session) => {
  if (event !== "SIGNED_IN" || !session) return;

  const verified = !!session.user.email_confirmed_at;

  const { data: profile } = await supabaseClient
    .from("artist_profiles")
    .select("id")
    .eq("user_id", session.user.id)
    .maybeSingle();

  if (!verified || !profile) {
    window.location.href = "./basic-info.html";
  } else {
    window.location.href = "./profile-form.html";
  }
});

// -------------------------
// EMAIL SIGNUP
// -------------------------
document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  errorMsg.innerText = "";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirm-password").value;
  const termsAccepted = document.getElementById("terms").checked;

  if (!termsAccepted) {
    errorMsg.innerText = "You must accept Terms & Privacy Policy";
    return;
  }

  if (password !== confirm) {
    errorMsg.innerText = "Passwords do not match";
    return;
  }

  const { error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${location.origin}/basic-info.html`
    }
  });

  if (error) {
    // User already exists → force login
    if (
      error.message.toLowerCase().includes("already registered") ||
      error.status === 422
    ) {
      window.location.href = "./login.html";
      return;
    }

    errorMsg.textContent = error.message;
  }
});

// -------------------------
// GOOGLE OAUTH
// -------------------------
document.getElementById("google-btn").addEventListener("click", async () => {
  await supabaseClient.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${location.origin}/basic-info.html`
    }
  });
});
