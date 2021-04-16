// listen for auth status changes
auth.onAuthStateChanged((user) => {
  setupUI(user);
});

//////////////////// UI - SERVICES ////////////////////
const setupUI = (user) => {
  setupLinks(user);
  setupAccount(user);
  setupDocuments(user);
};

const setupLinks = (user) => {
  const loggedOutLinks = document.querySelectorAll(".logged-out");
  const loggedInLinks = document.querySelectorAll(".logged-in");

  if (user) {
    loggedInLinks.forEach((item) => (item.style.display = "block"));
    loggedOutLinks.forEach((item) => (item.style.display = "none"));
  } else {
    loggedInLinks.forEach((item) => (item.style.display = "none"));
    loggedOutLinks.forEach((item) => (item.style.display = "block"));
  }
};

const setupAccount = (user) => {
  const accountDetails = document.querySelector(".account-details");

  if (user) {
    accountDetails.innerHTML = `
      <div>Hi ${user.displayName},</div>
      <div>Your logged in as : ${user.email}</div>
      `;
  } else {
    accountDetails.innerHTML = "";
  }
};

const setupDocuments = (user) => {
  const documentsContainer = document.getElementById("documents-container");
  documentsContainer.innerHTML = "";

  if (user) {
    db.collection("docs")
      .doc(user.uid)
      .collection("documents")
      .get()
      .then((querySnapshot) => {
        const htmlTable = document.createElement("table");
        htmlTable.className = "highlight centered";
        htmlTable.innerHTML = `
        <thead>
          <tr>
            <th>Author</th>
            <th>Title</th>
            <th>created</th>
            <th>update</th>
          </tr>
        </thead>
        `;
        const htmlTbody = document.createElement("tbody");
        querySnapshot.forEach((doc) => {
          const { author, title, created, update } = doc.data();
          const htmlTr = document.createElement("tr");
          htmlTr.innerHTML = `
          <td>${author}</td>
          <td>${title}</td>
          <td>${timestampToDate(created)}</td>
          <td>${timestampToDate(update)}</td>
          `;
          htmlTr.addEventListener("click", (e) => {
            showDocument(doc.id);
          });
          htmlTbody.appendChild(htmlTr);
        });
        htmlTable.appendChild(htmlTbody);
        documentsContainer.appendChild(htmlTable);
      });
  } else {
    documentsContainer.innerHTML = `
      <div class="center-align">
        <div>You must be logged in to view your documents</div>
        <br/>
        <div>use the menu to signup or login</div>
      </div>`;
  }
};

const timestampToDate = (timestamp) => {
  const unixTimestamp = timestamp.seconds;
  const milliseconds = unixTimestamp * 1000;
  const dateObject = new Date(milliseconds);
  const humanDateFormat = dateObject.toLocaleString();

  return humanDateFormat;
};

//////////////////// DOCUMENTS HANDLERS ////////////////////
const createDocument = () => {
  const { uid, displayName } = auth.currentUser;
  const newDoc = db.collection("docs").doc(uid).collection("documents").doc();

  newDoc
    .set({
      content: "",
      created: new Date(),
      update: new Date(),
      title: "New Document",
      author: displayName,
    })
    .then(() => {
      showDocument(newDoc.id);
    })
    .catch((err) => {
      console.log("Error writing document: ", err);
    });
};

const showDocument = (documentId) => {
  localStorage.setItem("currentDocument", documentId);
  window.location.href = "../editor.html";
};

//////////////////// SIGN UP FORM ////////////////////
const signupForm = document.getElementById("signup-form");

signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const userName = signupForm["signup-name"].value;
  const email = signupForm["signup-email"].value;
  const password = signupForm["signup-password"].value;
  const error = signupForm.querySelector(".error");

  auth
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      userCredential.user.updateProfile({
        displayName: userName,
      });

      const modal = document.getElementById("modal-signup");
      M.Modal.getInstance(modal).close();

      signupForm.reset();
      error.innerHTML = "";
      M.toast({
        html: "Congratulations, you have successfully registered!",
        classes: "rounded green lighten-2",
      });
    })
    .catch((err) => {
      error.innerHTML = err.message;
    });
});

//////////////////// LOGIN FORM ////////////////////
const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = loginForm["login-email"].value;
  const password = loginForm["login-password"].value;
  const error = loginForm.querySelector(".error");

  auth
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const modal = document.getElementById("modal-login");
      M.Modal.getInstance(modal).close();
      loginForm.reset();
      error.innerHTML = "";
      M.toast({
        html: "Welcome back",
        classes: "rounded green lighten-2",
      });
    })
    .catch((err) => {
      error.innerHTML = err.message;
    });
});

//////////////////// LOGOUT FORM ////////////////////
const logoutForm = document.getElementById("logout-form");

logoutForm.addEventListener("submit", (e) => {
  e.preventDefault();
  auth
    .signOut()
    .then(() => {
      const modal = document.getElementById("modal-logout");
      M.Modal.getInstance(modal).close();
      logoutForm.reset();
      M.toast({
        html: "You are logged out",
        classes: "rounded red lighten-2",
      });
    })
    .catch((err) => {
      console.log(err.message);
    });
});

//////////////////// RESET PASSWORD ////////////////////
const resetPasswordForm = document.getElementById("reset-pass-form");

resetPasswordForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = resetPasswordForm["login-email-reset"].value;

  auth
    .sendPasswordResetEmail(email)
    .then(() => {
      const modal = document.getElementById("modal-reset-pass");
      M.Modal.getInstance(modal).close();
      resetPasswordForm.reset();
      M.toast({
        html: `We sent you a link to ${email} to reset your password.<br/>Please check your mail.`,
        classes: "rounded yellow lighten-2 black-text",
        displayLength: 8000,
      });
    })
    .catch((err) => {
      console.log(err.message);
    });
});
