(function () {
  "use strict";

  /* ---------------------------------------------------------
     Init icons
  --------------------------------------------------------- */
  if (window.lucide) {
    lucide.createIcons();
  } else {
    window.addEventListener("load", function () {
      if (window.lucide) lucide.createIcons();
    });
  }


  /* ---------------------------------------------------------
     Footer year
  --------------------------------------------------------- */
  var yearEl = document.getElementById("year");

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }


  /* ---------------------------------------------------------
     Nav background on scroll
  --------------------------------------------------------- */
  var nav = document.getElementById("nav");

  function handleNavScroll() {
    if (!nav) return;

    if (window.scrollY > 24) {
      nav.classList.add("is-scrolled");
    } else {
      nav.classList.remove("is-scrolled");
    }
  }

  handleNavScroll();

  window.addEventListener("scroll", handleNavScroll, {
    passive: true
  });


  /* ---------------------------------------------------------
     Smooth scroll
  --------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {

    link.addEventListener("click", function (e) {

      var targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      var target = document.querySelector(targetId);

      if (!target) return;

      e.preventDefault();

      var navHeight = nav ? nav.offsetHeight : 0;

      var top =
        target.getBoundingClientRect().top +
        window.pageYOffset -
        navHeight +
        1;

      window.scrollTo({
        top: top,
        behavior: "smooth"
      });

    });

  });


  /* ---------------------------------------------------------
     Ambient cursor glow
  --------------------------------------------------------- */
  var cursorGlow = document.getElementById("cursorGlow");
  var glowActive = false;

  var reduceMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (
    cursorGlow &&
    !reduceMotion &&
    window.matchMedia("(pointer: fine)").matches
  ) {

    window.addEventListener(
      "mousemove",
      function (e) {

        cursorGlow.style.transform =
          "translate(" +
          e.clientX +
          "px, " +
          e.clientY +
          "px) translate(-50%, -50%)";

        if (!glowActive) {
          cursorGlow.classList.add("is-active");
          glowActive = true;
        }

      },
      {
        passive: true
      }
    );

    document.addEventListener("mouseleave", function () {

      cursorGlow.classList.remove("is-active");
      glowActive = false;

    });
  }


  /* ---------------------------------------------------------
     Scroll reveal for sections
  --------------------------------------------------------- */
  var revealTargets = document.querySelectorAll(
    ".team__intro, .profile, .promptbook__copy, .promptbook__visual, .contact__intro, .contact-form"
  );

  revealTargets.forEach(function (el) {
    el.classList.add("will-reveal");
  });


  if ("IntersectionObserver" in window) {

    var observer = new IntersectionObserver(
      function (entries) {

        entries.forEach(function (entry) {

          if (entry.isIntersecting) {

            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);

          }

        });

      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -60px 0px"
      }
    );


    revealTargets.forEach(function (el) {
      observer.observe(el);
    });

  } else {

    revealTargets.forEach(function (el) {
      el.classList.add("is-visible");
    });

  }


  /* ---------------------------------------------------------
     Toast notification
  --------------------------------------------------------- */
  var toast = document.getElementById("toast");
  var toastMessage = document.getElementById("toastMessage");
  var toastTimer = null;


  function showToast(message) {

    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    toast.classList.add("is-visible");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(function () {

      toast.classList.remove("is-visible");

    }, 3200);

  }


  /* ---------------------------------------------------------
     Copy contact buttons
  --------------------------------------------------------- */
  function fallbackCopy(text) {

    var textarea = document.createElement("textarea");

    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";

    document.body.appendChild(textarea);

    textarea.focus();
    textarea.select();

    var success = false;

    try {

      success = document.execCommand("copy");

    } catch (err) {

      success = false;

    }

    document.body.removeChild(textarea);

    return success;

  }


  function copyText(text) {

    if (navigator.clipboard && window.isSecureContext) {

      return navigator.clipboard.writeText(text);

    }

    return new Promise(function (resolve, reject) {

      if (fallbackCopy(text)) {
        resolve();
      } else {
        reject(new Error("copy failed"));
      }

    });

  }


  document.querySelectorAll(".btn--copy").forEach(function (btn) {

    btn.addEventListener("click", function () {

      var name =
        btn.getAttribute("data-copy-name") || "";

      var phone =
        btn.getAttribute("data-copy-phone") || "";

      var email =
        btn.getAttribute("data-copy-email") || "";

      var payload =
        [name, phone, email]
          .filter(Boolean)
          .join(" — ");


      copyText(payload)

        .then(function () {

          showToast("Skopiowano do schowka!");

          btn.classList.add("is-copied");

          setTimeout(function () {

            btn.classList.remove("is-copied");

          }, 1800);

        })

        .catch(function () {

          showToast(
            "Nie udało się skopiować. Spróbuj ręcznie."
          );

        });

    });

  });


  /* ---------------------------------------------------------
     Contact form
  --------------------------------------------------------- */

  var form =
    document.getElementById("contactForm");


  function setFieldError(fieldEl, message) {

    if (!fieldEl) return;

    var wrapper =
      fieldEl.closest(".field");

    if (!wrapper) return;

    var errorEl =
      wrapper.querySelector(".field-error");


    if (message) {

      wrapper.classList.add("has-error");

      if (errorEl) {
        errorEl.textContent = message;
      }

    } else {

      wrapper.classList.remove("has-error");

      if (errorEl) {
        errorEl.textContent = "";
      }

    }

  }


  /* ---------------------------------------------------------
     Validation helpers
  --------------------------------------------------------- */

  function isValidEmail(value) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  }


  function isValidPhone(value) {

    return /^[+\d][\d\s-]{6,}$/.test(value);

  }


  function validateForm() {

    if (!form) return false;

    var valid = true;


    /* IMIĘ */

    var nameField =
      form.querySelector("#name");


    if (!nameField.value.trim()) {

      setFieldError(
        nameField,
        "Podaj swoje imię."
      );

      valid = false;

    } else {

      setFieldError(
        nameField,
        ""
      );

    }


    /* TELEFON */

    var phoneField =
      form.querySelector("#phone");


    if (!phoneField.value.trim()) {

      setFieldError(
        phoneField,
        "Podaj numer telefonu."
      );

      valid = false;

    } else if (
      !isValidPhone(
        phoneField.value.trim()
      )
    ) {

      setFieldError(
        phoneField,
        "Podaj poprawny numer telefonu."
      );

      valid = false;

    } else {

      setFieldError(
        phoneField,
        ""
      );

    }


    /* EMAIL */

    var emailField =
      form.querySelector("#email");


    if (!emailField.value.trim()) {

      setFieldError(
        emailField,
        "Podaj adres e-mail."
      );

      valid = false;

    } else if (
      !isValidEmail(
        emailField.value.trim()
      )
    ) {

      setFieldError(
        emailField,
        "Podaj poprawny adres e-mail."
      );

      valid = false;

    } else {

      setFieldError(
        emailField,
        ""
      );

    }


    /* WIADOMOŚĆ */

    var messageField =
      form.querySelector("#message");


    if (!messageField.value.trim()) {

      setFieldError(
        messageField,
        "Napisz kilka słów o tym, czego potrzebujesz."
      );

      valid = false;

    } else {

      setFieldError(
        messageField,
        ""
      );

    }


    return valid;

  }


  /* ---------------------------------------------------------
     Form submit
  --------------------------------------------------------- */

  if (form) {


    /* Usuwanie błędu podczas wpisywania */

    form
      .querySelectorAll("input, textarea")
      .forEach(function (el) {

        el.addEventListener(
          "input",
          function () {

            setFieldError(el, "");

          }
        );

      });


    form.addEventListener(
      "submit",
      async function (e) {

        e.preventDefault();


        /* WALIDACJA */

        if (!validateForm()) {

          showToast(
            "Uzupełnij wszystkie wymagane pola."
          );

          return;

        }


        var submitBtn =
          form.querySelector(
            'button[type="submit"]'
          );


        var label =
          submitBtn
            ? submitBtn.querySelector(
                ".btn-label"
              )
            : null;


        var originalLabel =
          label
            ? label.textContent
            : "Wyślij wiadomość";


        if (label) {

          label.textContent =
            "Wysyłanie…";

        }


        if (submitBtn) {

          submitBtn.disabled = true;

        }


        /* -----------------------------------------------------
           Dane formularza
        ----------------------------------------------------- */

        var name =
          form
            .querySelector("#name")
            .value
            .trim();


        var phone =
          form
            .querySelector("#phone")
            .value
            .trim();


        var email =
          form
            .querySelector("#email")
            .value
            .trim();


        var message =
          form
            .querySelector("#message")
            .value
            .trim();


        /* -----------------------------------------------------
           Wysyłanie przez FormSubmit

           Główny odbiorca:
           werkazaclona@gmail.com

           Kopia:
           mikolajszmid@gmail.com
        ----------------------------------------------------- */

        try {

          var response =
            await fetch(
              "https://formsubmit.co/ajax/werkazaclona@gmail.com",
              {
                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json",

                  Accept:
                    "application/json"
                },

                body: JSON.stringify({

                  name: name,

                  phone: phone,

                  email: email,

                  message: message,

                  _subject:
                    "Nowe zgłoszenie na korepetycje",

                  _cc:
                    "mikolajszmid@gmail.com",

                  _template:
                    "table",

                  _replyto:
                    email

                })

              }
            );


          if (!response.ok) {

            throw new Error(
              "Błąd odpowiedzi serwera"
            );

          }


          var result =
            await response.json();


          /*
             FormSubmit może zwrócić success
             jako boolean lub tekst.
          */

          if (
            result.success === false ||
            result.success === "false"
          ) {

            throw new Error(
              result.message ||
              "Nie udało się wysłać formularza"
            );

          }


          /* SUKCES */

          form.reset();


          showToast(
            "Wiadomość wysłana! Odezwiemy się wkrótce."
          );


        } catch (error) {

          console.error(
            "Błąd formularza:",
            error
          );


          showToast(
            "Nie udało się wysłać wiadomości. Spróbuj ponownie."
          );


        } finally {


          if (label) {

            label.textContent =
              originalLabel;

          }


          if (submitBtn) {

            submitBtn.disabled = false;

          }

        }

      }
    );

  }

})();