const editor = document.getElementById("editor");
const title = document.getElementById("title");
let userId = "";
const documentId = localStorage.getItem("currentDocument");

auth.onAuthStateChanged((user) => {
  if (user) {
    userId = user.uid;

    db.collection("docs")
      .doc(userId)
      .collection("documents")
      .doc(documentId)
      .get()
      .then((doc) => {
        editor.innerHTML = doc.data().content;
        title.innerHTML = doc.data().title;
      })
      .catch((err) => console.log(err));
  }
});

editor.addEventListener("input", () => {
  updateDB();
});
title.addEventListener("input", () => {
  updateDB();
});

//////////////////// EDITOR - SERVICES ////////////////////
const format = (command, value) => {
  document.execCommand(command, false, value);
};

const changeFont = () => {
  const font = document.getElementById("input-font").value;
  document.execCommand("fontName", false, font);
};

const changeFontSize = () => {
  const fontSize = document.getElementById("input-font-size").value;
  document.execCommand("fontSize", false, fontSize);
};

const updateDB = () => {
  const user = auth.currentUser;
  const documentId = localStorage.getItem("currentDocument");

  const documentDocRef = db
    .collection("docs")
    .doc(user.uid)
    .collection("documents")
    .doc(documentId);

  return documentDocRef
    .get()
    .then((doc) => {
      documentDocRef.update({
        content: editor.innerHTML,
        title: title.innerText,
      });
    })
    .catch((error) => {
      console.log("Transaction failed: ", error);
    });
};

const btnHomeHandler = () => {
  window.location.href = "../index.html";
};

const btnDeleteDocument = () => {
  M.toast({
    html: `
  <span>Did you missclick ?</span><button class="btn-flat toast-action" onclick="deleteDocument()">no, i want delete it !</button>
  `,
    classes: "red lighten-2 rounded",
    displayLength: 7000,
  });
};

const deleteDocument = () => {
  const user = auth.currentUser;
  const documentId = localStorage.getItem("currentDocument");

  db.collection("docs")
    .doc(user.uid)
    .collection("documents")
    .doc(documentId)
    .delete()
    .then(() => {
      window.location.href = "../index.html";
      localStorage.setItem("currentDocument", null);
    })
    .catch((err) => {
      console.log("Error removing document: ", error);
    });
};
