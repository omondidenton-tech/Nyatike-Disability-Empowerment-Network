document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("contact-form");

    if (!form) return;


    const fullName = document.getElementById("full-name");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const subject = document.getElementById("subject");
    const message = document.getElementById("message");
    const formStatus = document.getElementById("form-status");


    const fields = {
        fullName,
        email,
        phone,
        subject,
        message
    };

    function getErrorElement(field) {
        return document.getElementById(`${field.id}-error`);
    }

    function showError(field, errorMessage) {

        const errorElement = getErrorElement(field);

        field.setAttribute("aria-invalid", "true");

        if (errorElement) {
            errorElement.textContent = errorMessage;
            errorElement.hidden = false;
        }

    }


    function clearError(field) {

        const errorElement = getErrorElement(field);

        field.removeAttribute("aria-invalid");

        if (errorElement) {
            errorElement.textContent = "";
            errorElement.hidden = true;
        }

    }


    function clearAllErrors() {

        Object.values(fields).forEach((field) => {

            if (field) {
                clearError(field);
            }

        });

        if (formStatus) {

            formStatus.textContent = "";
            formStatus.className = "form-status";

        }

    }


    function validateField(field) {

        if (!field) return true;


        const value = field.value.trim();

        clearError(field);


        /* FULL NAME */

        if (field === fullName) {

            if (!value) {

                showError(
                    field,
                    "Please enter your full name."
                );

                return false;
            }


            if (value.length < 2) {

                showError(
                    field,
                    "Please enter a valid name."
                );

                return false;
            }

        }


        /* EMAIL */

        if (field === email) {

            if (!value) {

                showError(
                    field,
                    "Please enter your email address."
                );

                return false;
            }


            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!emailPattern.test(value)) {

                showError(
                    field,
                    "Please enter a valid email address."
                );

                return false;
            }

        }


        /* PHONE */

        if (field === phone && value) {

            const phonePattern =
                /^[0-9+\s().-]{7,20}$/;


            if (!phonePattern.test(value)) {

                showError(
                    field,
                    "Please enter a valid phone number."
                );

                return false;
            }

        }


        /* SUBJECT */

        if (field === subject) {

            if (!value) {

                showError(
                    field,
                    "Please enter a subject."
                );

                return false;
            }


            if (value.length < 3) {

                showError(
                    field,
                    "Please enter a more specific subject."
                );

                return false;
            }

        }


        /* MESSAGE */

        if (field === message) {

            if (!value) {

                showError(
                    field,
                    "Please enter your message."
                );

                return false;
            }


            if (value.length < 10) {

                showError(
                    field,
                    "Please provide a little more detail."
                );

                return false;
            }

        }


        return true;

    }


    /* LIVE VALIDATION */

    Object.values(fields).forEach((field) => {

        if (!field) return;


        field.addEventListener("blur", () => {
            validateField(field);
        });


        field.addEventListener("input", () => {

            if (
                field.getAttribute("aria-invalid") === "true"
            ) {
                validateField(field);
            }

        });

    });


    /* FORM SUBMISSION */

    form.addEventListener("submit", (event) => {

        event.preventDefault();

        clearAllErrors();


        const validationOrder = [
            fullName,
            email,
            phone,
            subject,
            message
        ];


        let formIsValid = true;
        let firstInvalidField = null;


        validationOrder.forEach((field) => {

            if (!validateField(field)) {

                formIsValid = false;

                if (!firstInvalidField) {
                    firstInvalidField = field;
                }

            }

        });


        /* STOP IF INVALID */

        if (!formIsValid) {

            if (formStatus) {

                formStatus.textContent =
                    "Please correct the highlighted fields and try again.";

                formStatus.className =
                    "form-status form-status-error";

            }


            if (firstInvalidField) {
                firstInvalidField.focus();
            }

            return;

        }


        /*
         * CREATE EMAIL MESSAGE
         */

        const recipient =
            "nyatikedisabilitynetwork@gmail.com";


        const emailSubject =
            encodeURIComponent(
                subject.value.trim()
            );


        const emailBody =
            encodeURIComponent(

                `Hello NDEN,

My name is ${fullName.value.trim()}.

Email: ${email.value.trim()}
Phone: ${phone.value.trim() || "Not provided"}

Subject: ${subject.value.trim()}

Message:
${message.value.trim()}

Regards,
${fullName.value.trim()}`

            );


        const mailtoLink =
            `mailto:${recipient}?subject=${emailSubject}&body=${emailBody}`;


        /*
         * OPEN VISITOR'S EMAIL APPLICATION
         */

        window.location.href = mailtoLink;


        /*
         * USER FEEDBACK
         */

        if (formStatus) {

            formStatus.textContent =
                "Your email application should now open with your message prepared for NDEN. Please review it and press Send.";

            formStatus.className =
                "form-status form-status-success";

        }

    });

});
