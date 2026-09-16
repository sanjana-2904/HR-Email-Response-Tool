// Get elements from HTML
const emailForm = document.getElementById("emailForm");
const previewBtn = document.getElementById("previewBtn");
const sendBtn = document.getElementById("sendBtn");

const previewSection = document.getElementById("previewSection");
const previewEmail = document.getElementById("previewEmail");
const previewSubject = document.getElementById("previewSubject");
const previewContent = document.getElementById("previewContent");

const message = document.getElementById("message");


// Create the email content
function generateEmail(name, position, status) {

    if (status === "selected") {

        return `Dear ${name},

We are pleased to inform you that you have been selected for the position of ${position}.

Please reply to this email to confirm your acceptance.

Best regards,
HR Team`;

    } else {

        return `Dear ${name},

Thank you for applying for the position of ${position}.

We regret to inform you that we have decided to move forward with other candidates.

Best regards,
HR Team`;
    }
}


// Preview Email
previewBtn.addEventListener("click", function () {

    // Get values from the form
    const name =
        document.getElementById("candidateName").value.trim();

    const email =
        document.getElementById("candidateEmail").value.trim();

    const position =
        document.getElementById("position").value.trim();

    const status =
        document.querySelector(
            'input[name="status"]:checked'
        );


    // Check whether all fields are filled
    if (!name || !email || !position || !status) {

        message.textContent =
            "Please fill in all fields and select a status.";

        message.style.color = "red";

        return;
    }


    // Generate email
    const emailText = generateEmail(
        name,
        position,
        status.value
    );


    // Create subject
    const subject =
        `Application Update - ${position}`;


    // Show email preview
    previewEmail.textContent = email;

    previewSubject.textContent = subject;

    previewContent.textContent = emailText;


    // Show preview section
    previewSection.classList.remove("hidden");

    // Clear previous message
    message.textContent = "";
});


// Send Email
sendBtn.addEventListener("click", async function () {

    // Get form values
    const name =
        document.getElementById("candidateName").value.trim();

    const email =
        document.getElementById("candidateEmail").value.trim();

    const position =
        document.getElementById("position").value.trim();

    const status =
        document.querySelector(
            'input[name="status"]:checked'
        );


    try {

        // Disable button while sending
        sendBtn.disabled = true;
        sendBtn.textContent = "Sending...";


        // Send data to Node.js backend
        const response = await fetch("/send-email", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                candidateName: name,
                candidateEmail: email,
                position: position,
                status: status.value

            })
        });


        // Get response from server
        const data = await response.json();


        // Check result
        if (data.success) {

            message.textContent =
                "Email sent successfully!";

            message.style.color = "green";

            // Clear form
            emailForm.reset();

            // Hide preview
            previewSection.classList.add("hidden");

        } else {

            message.textContent =
                data.message;

            message.style.color = "red";
        }

    } catch (error) {

        console.error(error);

        message.textContent =
            "Unable to send email. Please try again.";

        message.style.color = "red";

    } finally {

        // Enable button again
        sendBtn.disabled = false;
        sendBtn.textContent = "Send Email";
    }

});