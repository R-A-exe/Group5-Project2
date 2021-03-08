$(document).ready(() => {
  // Getting references to our form and inputs
  const loginForm = $("form.login");
  const emailInput = $("input#email-input");
  const passwordInput = $("input#password-input");

  // When the form is submitted, we validate there's an email and password entered
  loginForm.on("submit", event => {
    event.preventDefault();
    $("p").remove();
    const user = {
      email: emailInput.val().trim(),
      password: passwordInput.val().trim()
    };

    if (!user.email || !user.password) {
      return;
    }

    // If we have an email and password we run the loginUser function and clear the form
    loginUser(user);
    emailInput.val("");
    passwordInput.val("");
  });

  // loginUser does a post to our "api/login" route and if successful, redirects us the the members page
  function loginUser(user) {
    $.post("/api/login", user)
      .then(() => {
        window.location.replace("/members");
        // If there's an error, log the error
      })
      .catch(err => {
        var errorMsg = "<p class='msg'>The email address or password you have entered is invalid.</p>"
        $(".msg").addClass("red");
        $(".login").prepend(errorMsg)
        console.log(err);
      });
  }
});
