const supabaseClient = window.supabaseClient;
const statusMsg = document.getElementById("statusMsg");
const errorMsg = document.getElementById("errorMsg");
const form = document.getElementById("basic-info-form");
const submitBtn = document.getElementById("basic-info-btn");

(async () => {
  const { data: { session } } = await supabaseClient.auth.getSession();

  if (!session) {
    window.location.href = "./login.html";
    return;
  }

  const verified = !!session.user.email_confirmed_at;

  const { data: profile } = await supabaseClient
    .from("artist_profiles")
    .select("id")
    .eq("user_id", session.user.id)
    .maybeSingle();

  if (profile) {
    window.location.href = "./profile-form.html";
    return;
  }

  if (!verified) {
    statusMsg.textContent = "Please verify your email to continue.";
    form.querySelectorAll("input, button").forEach(el => el.disabled = true);
  }
})();

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorMsg.textContent = "";

  const { data: { session } } = await supabaseClient.auth.getSession();

  if (!session || !session.user.email_confirmed_at) {
    errorMsg.textContent = "Email not verified.";
    return;
  }

  submitBtn.disabled = true;

  const name = document.getElementById("full-name").value.trim();
  const countryCode = document.getElementById("country-code").value;
  const phoneRaw = document.getElementById("phone").value.trim();

  // 🇮🇳 Indian phone validation
  if (!/^[6-9]\d{9}$/.test(phoneRaw)) {
    errorMsg.textContent = "Enter a valid Indian phone number";
    return;
  }

  const phone = `${countryCode}${phoneRaw}`;

  const { error } = await supabaseClient.from("artist_profiles").insert({
    user_id: session.user.id,
    full_name: name,
    phone: phone
  });

  if (error) {
    submitBtn.disabled = false;
    errorMsg.textContent = error.message;
    return;
  }

  window.location.href = "./profile-form.html";
});
