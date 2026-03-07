const form = document.getElementById("contact-form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    const payload = {
        fullname: formData.get("fullname"),
        email: formData.get("email"),
        phone: formData.get("phone-no"),
        reason: formData.get("contact-reason"),
        message: formData.get("message"),
        date: formData.get("date"),
        budget: formData.get("budget"),
        website: formData.get("website")
    };

    // Name validation
    if (!/^[a-zA-Z\s]{2,100}$/.test(payload.fullname)) {
        alert("Enter a valid name.");
        return;
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
        alert("Enter a valid email address.");
        return;
    }

    // 🇮🇳 Indian phone validation
    if (!/^[6-9]\d{9}$/.test(payload.phone)) {
        alert("Enter a valid Indian phone number");
        return;
    }

    if (payload.message.length > 1000) {
        alert("Message must be under 1000 characters.");
        return;
    }

    const res = await fetch(
        "https://hmlsodnanowiotfoaurg.supabase.co/functions/v1/contactUs",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        }
    );

    const data = await res.json();
    if (!res.ok) {
        alert(data.message);
        return;
    }

    alert(data.message);
    form.reset();
});