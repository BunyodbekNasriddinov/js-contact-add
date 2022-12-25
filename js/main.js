const elForm = document.querySelector(".js-form");
const elList = document.querySelector(".js-list");
let elInputName = document.querySelector(".js-input-name");
let elPhoneNumber = document.querySelector(".js-input-phone-number");
let elSelect = document.querySelector(".js-select");

const elEditForm = document.querySelector(".js-edit-form");
let elEditName = document.querySelector(".js-edit-name");
let elEditPhoneNumber = document.querySelector(".js-edit-phone-number");
let elEditSelect = document.querySelector(".js-edit-select");

const elScrollBtn = document.querySelector(".js-scroll");
const elModeBtn = document.querySelector(".js-mode");
const elCloseBtn = document.querySelector(".js-close");

let contacts = JSON.parse(localStorage.getItem("contacts")) || [];

window.addEventListener("scroll", () => {
  if (window.scrollY >= 150) {
    elScrollBtn.classList.remove("d-none");
  } else {
    elScrollBtn.classList.add("d-none");
  }
});

let theme = false;

elModeBtn.addEventListener("click", () => {
  theme = !theme;

  let bg = theme ? "dark" : "light";
  localStorage.setItem("theme", bg);
  changeTheme();
});

changeTheme();

function changeTheme() {
  if (localStorage.getItem("theme") === "dark") {
    document.querySelector("body").classList.add("dark");
    elModeBtn.children[0].src = "./images/mode-icon.png";
  } else {
    document.querySelector("body").classList.remove("dark");
    elModeBtn.children[0].src = "./images/mode-icon-dark.png";
  }
}

const renderContact = (array, node) => {
  node.innerHTML = "";
  array.forEach((item) => {
    const newItem = document.createElement("li");

    const newSpan = document.createElement("span");
    const newEditButton = document.createElement("button");
    const newDeleteButton = document.createElement("button");
    const newTimeSpan = document.createElement("span");

    newItem.appendChild(newSpan);
    newItem.appendChild(newEditButton);
    newItem.appendChild(newDeleteButton);
    newItem.appendChild(newTimeSpan);

    newDeleteButton.innerText = "DELETE";
    newEditButton.innerText = "EDIT";
    newTimeSpan.innerText = time();

    newItem.setAttribute("class", "list-group-item d-flex align-items-center");
    newSpan.setAttribute("class", "ms-3 fs-5");
    newEditButton.setAttribute("class", "btn btn-warning ms-auto js-edit-btn");
    newDeleteButton.setAttribute("class", "btn btn-danger ms-2 js-delete-btn");
    newTimeSpan.setAttribute("class", "ms-1 btn btn-secondary");

    newEditButton.dataset.contactId = item.id;
    newDeleteButton.dataset.contactId = item.id;

    newSpan.innerHTML = `
      <h3>${item.id}. ${item.name}</h3>
      <p>${item.relative}</p>
      <p class="border border-success text-success rounded p-1 fs-6">${item.phoneNumber}
      </p>
    `;
    node.appendChild(newItem);
    localStorage.setItem("contacts", JSON.stringify(contacts));
  });
};

renderContact(contacts, elList);

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
  if (originalNumber && number.length === 9) return (originalNumber = +number);

  if (number.length === 9) {
    let numHead = number.split("").splice(0, 2).join("");
    let numBody = number.split("").splice(2).join("");

    number = `+998(${numHead})${numBody}`;
  }
  return number;
}

function numberUnSplice(number) {
  let numHead = number.split("").splice(5, 2).join("");
  let numBody = number.split("").splice(8).join("");
  return +(numHead + numBody);
}

elInputName.addEventListener("input", (evt) => {
  evt.preventDefault();
  if (elInputName.value.length < 3 || typeof elInputName.value[0] == "number") {
    elInputName.classList.add("border");
    elInputName.classList.add("border-danger");
  } else {
    elInputName.classList.remove("border");
    elInputName.classList.remove("border-danger");
  }
});

elPhoneNumber.addEventListener("input", (evt) => {
  evt.preventDefault();

  if (elPhoneNumber.value.length < 8 || isNaN(elPhoneNumber.value)) {
    elPhoneNumber.classList.add("border");
    elPhoneNumber.classList.add("border-danger");
  } else {
    elPhoneNumber.classList.remove("border");
    elPhoneNumber.classList.remove("border-danger");
    elPhoneNumber.value = numberSplice(elPhoneNumber.value);
  }
});

elForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  console.log(
    contacts.findIndex((el) => el.phoneNumber === elPhoneNumber.value)
  );

  if (
    elInputName.value !== "" &&
    typeof elInputName.value[0] === "string" &&
    elInputName.value.length > 2 &&
    elPhoneNumber.value.length == 15 &&
    contacts.findIndex((el) => el.phoneNumber === elPhoneNumber.value)
  ) {
    const newContact = {
      id: contacts.length > 0 ? contacts[contacts.length - 1].id + 1 : 1,
      name: elInputName.value,
      relative: elSelect.value,
      phoneNumber: numberSplice(elPhoneNumber.value),
    };

    elInputName.value = "";
    elPhoneNumber.value = "";

    contacts.push(newContact);

    renderContact(contacts, elList);
  }
});

let contactId;

elList.addEventListener("click", (evt) => {
  evt.preventDefault();

  if (evt.target.matches(".js-delete-btn")) {
    const contactId = +evt.target.dataset.contactId;
    const findedIndex = contacts.findIndex((el) => el.id === contactId);
    contacts.splice(findedIndex, 1);
    localStorage.setItem("contacts", JSON.stringify(contacts));
    renderContact(contacts, elList);
  }

  if (evt.target.matches(".js-edit-btn")) {
    contactId = +evt.target.dataset.contactId;
    const findedIndex = contacts.findIndex((el) => el.id === contactId);
    elEditForm.classList.toggle("d-none");
    elEditName.value = contacts[findedIndex].name;
    elEditSelect.value = contacts[findedIndex].relative;
    elEditPhoneNumber.value = contacts[findedIndex].phoneNumber;
    localStorage.setItem("contacts", JSON.stringify(contacts));
  }
});

elEditForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const findedIndex = contacts.findIndex((el) => el.id === contactId);
  if (
    elEditName.value !== "" &&
    typeof elEditName.value[0] === "string" &&
    elEditName.value.length > 2 &&
    elEditPhoneNumber.value.length == 15 &&
    contacts.findIndex((el) => el.phoneNumber === elEditPhoneNumber.value)
  ) {
    console.log(elEditName.value);
    contacts[findedIndex].name = elEditName.value;
    contacts[findedIndex].relative = elEditSelect.value;
    contacts[findedIndex].phoneNumber = elEditPhoneNumber.value;
    renderContact(contacts, elList);
    localStorage.setItem("contacts", JSON.stringify(contacts));
  }
});

function removeClass(elEditForm) {
  elEditForm.classList.add("d-none");
}

elCloseBtn.addEventListener("click", removeClass);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    removeClass(elEditForm);
  }
});
