const waitlistForm = document.querySelector("[data-waitlist-form]");
const formStatus = document.querySelector("[data-form-status]");

if (waitlistForm && formStatus) {
  waitlistForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = waitlistForm.querySelector("button[type='submit']");
    const formData = new FormData(waitlistForm);

    if (formData.get("botcheck")) {
      return;
    }

    submitButton.disabled = true;
    formStatus.dataset.state = "";
    formStatus.textContent = "Sending...";

    try {
      const response = await fetch(waitlistForm.action, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Submission failed");
      }

      waitlistForm.reset();
      formStatus.dataset.state = "success";
      formStatus.textContent = "You are on the list. We will keep you posted.";
    } catch (error) {
      formStatus.dataset.state = "error";
      formStatus.textContent = "Could not send yet. Please try again.";
    } finally {
      submitButton.disabled = false;
    }
  });
}
