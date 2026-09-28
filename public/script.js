const whatsapp = "https://wa.me/5511953543812?text=Ol%C3%A1%20vim%20do%20site%20e%20quero%20fazer%20um%20or%C3%A7amento";
document.querySelectorAll("[data-whatsapp]").forEach(link => { link.href = whatsapp; link.target = "_blank"; link.rel = "noreferrer"; });
const observer = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting){ entry.target.classList.add("visible"); observer.unobserve(entry.target); } }), {threshold:.08});
document.querySelectorAll(".reveal").forEach(element => observer.observe(element));

const projectLightbox = document.querySelector("#project-lightbox");
if (projectLightbox) {
  const lightboxImage = projectLightbox.querySelector("img");
  const lightboxCaption = projectLightbox.querySelector("figcaption");
  const closeButton = projectLightbox.querySelector(".project-lightbox-close");
  let previousFocus;

  const closeProjectLightbox = () => {
    if (!projectLightbox.open) return;
    projectLightbox.close();
    document.body.classList.remove("lightbox-open");
    lightboxImage.src = "";
    if (previousFocus) previousFocus.focus();
  };

  document.querySelectorAll(".project-media").forEach(button => {
    button.addEventListener("click", () => {
      const image = button.querySelector("img");
      previousFocus = button;
      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt;
      lightboxCaption.textContent = image.alt;
      projectLightbox.showModal();
      document.body.classList.add("lightbox-open");
      closeButton.focus();
    });
  });

  closeButton.addEventListener("click", closeProjectLightbox);
  projectLightbox.addEventListener("click", event => {
    if (event.target === projectLightbox) closeProjectLightbox();
  });
  projectLightbox.addEventListener("cancel", event => {
    event.preventDefault();
    closeProjectLightbox();
  });
}

const leadForm = document.querySelector("#formulario");
const leadFrame = document.querySelector(".lead-submit-frame");
if (leadForm && leadFrame) {
  const submitButton = leadForm.querySelector("button[type='submit']");
  const status = leadForm.querySelector(".form-status");
  let awaitingResponse = false;
  let timeoutId;

  const restoreButton = () => {
    submitButton.disabled = false;
    submitButton.innerHTML = "Solicitar análise <span>→</span>";
  };

  const confirmSuccess = () => {
    if (!awaitingResponse) return;
    clearTimeout(timeoutId);
    awaitingResponse = false;
    restoreButton();
    leadForm.reset();
    status.textContent = "Recebemos seus dados. A P2 entrará em contato.";
    status.classList.remove("is-error");
  };

  leadForm.addEventListener("submit", event => {
    if (!navigator.onLine) {
      event.preventDefault();
      status.textContent = "Sem conexão no momento. Verifique sua internet e tente novamente.";
      status.classList.add("is-error");
      return;
    }
    awaitingResponse = true;
    status.textContent = "Enviando seus dados…";
    status.classList.remove("is-error");
    submitButton.disabled = true;
    submitButton.textContent = "Enviando…";
    clearTimeout(timeoutId);
    timeoutId = setTimeout(confirmSuccess, 6500);
  });

  leadFrame.addEventListener("load", () => {
    if (!awaitingResponse) return;
    window.setTimeout(confirmSuccess, 500);
  });

  window.addEventListener("message", event => {
    if (!awaitingResponse || event.source !== leadFrame.contentWindow) return;
    let payload = event.data;
    if (typeof payload === "string") {
      try { payload = JSON.parse(payload); } catch { return; }
    }
    if (!payload || payload.source !== "p2-lead-form") return;
    clearTimeout(timeoutId);
    awaitingResponse = false;
    restoreButton();
    if (payload.status === "success") {
      leadForm.reset();
      status.textContent = "Recebemos seus dados. A P2 entrará em contato.";
      status.classList.remove("is-error");
    } else {
      status.textContent = "Não foi possível registrar os dados. Tente novamente ou fale pelo WhatsApp.";
      status.classList.add("is-error");
    }
  });

  const mobileCta = document.querySelector(".mobile-cta");
  if (mobileCta) {
    const formVisibility = new IntersectionObserver(entries => {
      mobileCta.classList.toggle("is-hidden", entries[0].isIntersecting);
    }, { threshold: 0 });
    formVisibility.observe(leadForm);
  }
}
