const elForm = document.querySelector(".js-form");
let elInputName = document.querySelector(".js-input-name");
let elInputReletive = document.querySelector(".js-input-relative");
let elInputPhoneNumber = document.querySelector(".js-input-phone-number");
const elList = document.querySelector(".js-list");
let contacts = [];

const renderContact = (array, node) => {
  node.innerHTML = "";
  array.forEach((item) => {
    const newItem = document.createElement("li");

    const newSpan = document.createElement("span");
    const newFavoriteCheckInput = document.createElement("input");
    const newEditButton = document.createElement("button");
    const newDeleteButton = document.createElement("button");
    const newTimeSpan = document.createElement("span");

    // newItem.appendChild(newFavoriteCheckInput);
    newItem.appendChild(newSpan);
    newItem.appendChild(newEditButton);
    newItem.appendChild(newDeleteButton);
    newItem.appendChild(newTimeSpan);

    newFavoriteCheckInput.type = "checkbox";
    newDeleteButton.innerText = "DELETE";
    newEditButton.innerText = "EDIT";
    newTimeSpan.innerText = time();

    newItem.setAttribute("class", "list-group-item d-flex align-items-center");
    newFavoriteCheckInput.setAttribute(
      "class",
      "form-check-input m-0 js-favorite-check-input"
    );
    newSpan.setAttribute("class", "ms-3 fs-5");
    newEditButton.setAttribute("class", "btn btn-warning ms-auto js-edit-btn");
    newDeleteButton.setAttribute("class", "btn btn-danger ms-2 js-delete-btn");
    newTimeSpan.setAttribute("class", "ms-1 btn btn-secondary");

    newFavoriteCheckInput.dataset.contactId = item.id;
    newEditButton.dataset.contactId = item.id;
    newDeleteButton.dataset.contactId = item.id;

    if (item.isCompleted) {
      contacts.isCompleted = true;
    }

    newSpan.innerHTML = `
    <h3>${item.id}. ${item.name}</h3>
    <p>${item.relative}</p>
    <p class="border border-success text-success rounded p-1 fs-6">${item.phoneNumber}</p>
    `;
    node.appendChild(newItem);
  });
};

function time() {
  var date = new Date();
  var hour = date.getHours();
  var minutes = date.getMinutes();

  if (hour < 10) {
    hour = "0" + hour;
  }

  if (hour > 12) minutes += "PM";
  else minutes += " AM";

  return `${hour}:${minutes}`;
}

function numberSplice(number, originalNumber) {
  if (originalNumber) return (originalNumber = number);

  if (number.length === 9) {
    // count++;
    let numHead = number.split("").splice(0, 2).join("");
    let numBody = number.split("").splice(2).join("");

    number = `+998(${numHead})${numBody}`;
  }
  return number;
}

elInputName.addEventListener("input", (evt) => {
  evt.preventDefault();
  if (elInputName.value.length < 3) {
    elInputName.classList.add("border");
    elInputName.classList.add("border-danger");
  } else {
    elInputName.classList.remove("border");
    elInputName.classList.remove("border-danger");
  }
});

elInputReletive.addEventListener("input", (evt) => {
  evt.preventDefault();
  if (elInputReletive.value.length < 3) {
    elInputReletive.classList.add("border");
    elInputReletive.classList.add("border-danger");
  } else {
    elInputReletive.classList.remove("border");
    elInputReletive.classList.remove("border-danger");
  }
});

elInputPhoneNumber.addEventListener("input", (evt) => {
  evt.preventDefault();
  if (elInputPhoneNumber.value.length < 8 || isNaN(elInputPhoneNumber.value)) {
    elInputPhoneNumber.classList.add("border");
    elInputPhoneNumber.classList.add("border-danger");
  } else {
    elInputPhoneNumber.classList.remove("border");
    elInputPhoneNumber.classList.remove("border-danger");
    elInputPhoneNumber.value = numberSplice(elInputPhoneNumber.value);
  }
});

elForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  if (
    elInputName.value !== "" &&
    elInputName.value.length > 3 &&
    elInputReletive.value !== "" &&
    elInputReletive.value.length > 3 &&
    elInputPhoneNumber.value !== "" &&
    elInputPhoneNumber.value.length > 8
  ) {
    const newContact = {
      id: contacts > 0 ? contacts.length + 1 : 1,
      name: elInputName.value,
      relative: elInputReletive.value,
      phoneNumber: numberSplice(elInputPhoneNumber.value),
      isFavorite: false,
    };

    elInputName.value = "";
    elInputReletive.value = "";
    elInputPhoneNumber.value = "";

    contacts.push(newContact);

    renderContact(contacts, elList);
  }
});

elList.addEventListener("click", (evt) => {
  evt.preventDefault();

  if (evt.target.matches(".js-delete-btn")) {
    const contactId = +evt.target.dataset.contactId;
    const findedIndex = contacts.findIndex((el) => el.id === contactId);
    contacts.splice(findedIndex, 1);
    renderContact(contacts, elList);
  }

  if (evt.target.matches(".js-edit-btn")) {
    const contactId = +evt.target.dataset.contactId;
    const findedIndex = contacts.findIndex((el) => el.id === contactId);

    let editContact;
    for (let i = 0; i < 3; i++) {
      if (i === 0) {
        if (elInputName.value === null) {
          i++;
        } else {
          editContact = prompt(
            "Contact'ni ismini o'zgartiring",
            contacts[findedIndex].name
          );
          editContact.length > 3
            ? (contacts[findedIndex].name = editContact)
            : (i = 0);
          renderContact(contacts, elList);
        }
      }
      if (i === 1) {
        if (elInputReletive.value === null) i++;
        else {
          editContact = prompt(
            "Contact'ni relative'ni o'zgartiring",
            contacts[findedIndex].relative
          );
          editContact.length > 3
            ? (contacts[findedIndex].relative = editContact)
            : (i = 1);
          renderContact(contacts, elList);
        }
      }
      if (i === 2) {
        if (elInputPhoneNumber.value === null) i++;
        else {
          editContact = prompt(
            "Contact'ni phone number'ini o'zgartiring",
            contacts[findedIndex].phoneNumber
          );
          editContact.length >= 9
            ? (contacts[findedIndex].phoneNumber = numberSplice(editContact))
            : (i = 2);
          renderContact(contacts, elList);
        }
      }
    }
  }

  // if (evt.target.matches(".js-favorite-check-input")) {
  //   const contactId = +evt.target.dataset.contactId;
  //   const findedItem = contacts.find((el) => el.id === contactId);
  //   findedItem.isCompleted = !findedItem.isCompleted;

  //   completedTodo = contacts.filter((el) => el.isCompleted);
  //   unCompletedTodo = contacts.filter((el) => !el.isCompleted);

  //   elAllcontactsNum.textContent = `(${contacts.length})`;
  //   elCompletedcontactsNum.textContent = `(${completedTodo.length})`;
  //   elUnCompletedcontactsNum.textContent = `(${unCompletedTodo.length})`;

  //   renderTodo(contacts, elList);
  //   localStorage.setItem("mycontacts", JSON.stringify(contacts));
  // }
});

// console.log(prompt(""));
