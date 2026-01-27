const supabase = window.supabaseClient;
const errorMsg = document.getElementById("errorMsg");

/* -------------------------
   AUTH STATE LISTENER
-------------------------- */
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event !== "SIGNED_IN" || !session) return;

  // Block unverified email users
  if (!session.user.email_confirmed_at) {
    errorMsg.textContent =
      "Please verify your email before continuing.";
    await supabase.auth.signOut();
    return;
  }

  // Check if basic info (profile) exists
  const { data: profile } = await supabase
    .from("artist_profiles")
    .select("id")
    .eq("user_id", session.user.id)
    .maybeSingle();

  // Verified but no basic info → collect-basic-info
  if (!profile) {
    window.location.href = "./basic-info.html";
  } else {
    // Verified + basic info done → dashboard
    window.location.href = "./profile.html";
  }
});

/* -------------------------
   EMAIL + PASSWORD LOGIN
-------------------------- */
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  errorMsg.textContent = "";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    errorMsg.textContent = error.message;
  }
});

/* -------------------------
   GOOGLE OAUTH LOGIN
-------------------------- */
document.getElementById("google-btn").addEventListener("click", async () => {
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${location.origin}/basic-info.html`
    }
  });
});

/* -------------------------
   FORGOT PASSWORD
-------------------------- */
document.getElementById("forgot-password").addEventListener("click", async () => {
  errorMsg.textContent = "";
  successMsg.textContent = "";

  const email = document.getElementById("email").value.trim();

  if (!email) {
    errorMsg.textContent = "Please enter your email address to reset password";
    return;
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${location.origin}/reset-password.html`
  });

  // if reset password link emailed show this message
  successMsg.textContent =
    "If an account exists for this email, a password reset link has been sent. Please check your inbox.";
});
