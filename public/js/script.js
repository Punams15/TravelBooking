 window.addEventListener("DOMContentLoaded", () => {
    const checkbox = document.getElementById("themeCheckbox");
    const body = document.body;

    const savedTheme = localStorage.getItem("globetrek-theme");

    if (savedTheme === "dark-mode") {
        body.classList.add("dark-mode");
        checkbox.checked = true;
    } else {
        body.classList.add("light-mode");
        checkbox.checked = false;
    }

    checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
            body.classList.remove("light-mode");
            body.classList.add("dark-mode");
            localStorage.setItem("globetrek-theme", "dark-mode");
        } else {
            body.classList.remove("dark-mode");
            body.classList.add("light-mode");
            localStorage.setItem("globetrek-theme", "light-mode");
        }
    });
});

