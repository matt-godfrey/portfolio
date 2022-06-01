let passInput = document.getElementById("pass");
let confirmPassInput = document.getElementById("confirmPass");

passInput.addEventListener("keyup", isValid);
passInput.addEventListener("keyup", areEqual);
confirmPassInput.addEventListener("keyup", areEqual);

function isValid() {
    let text = passInput.value;
    let pattern = new RegExp("[-?+=%\/\\'!#$^:(){}]");
    if (pattern.test(text) && text.length >= 6) {
        passInput.style.border = "2px solid green";
        passInput.style.borderRadius = "5px";
        passInput.style.outline = "none";
        return;
    }
    passInput.style.border = "1px solid black";
    passInput.style.outline = "solid";
    passInput.style.outlineWidth = "thin";
}

function areEqual() {
    let text1 = passInput.value;
    let text2 = confirmPassInput.value;

    if (text1 === text2) {
        confirmPassInput.style.border = "2px solid green";
        confirmPassInput.style.borderRadius = "5px";
        confirmPassInput.style.outline = "none";
        return;
    }
    confirmPassInput.style.border = "1px solid black";
    confirmPassInput.style.outline = "solid";
    confirmPassInput.style.outlineWidth = "thin";
}

