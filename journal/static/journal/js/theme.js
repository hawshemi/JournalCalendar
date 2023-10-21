const themeBtn = document.querySelector("#themeSwitch")
const themeIcon = document.querySelector("#themeIcon")
const storedTheme = localStorage.getItem("theme")

const getTheme = () => {
    if (storedTheme) {
        return storedTheme
    }
    // user's OS setting
    // prefers-color-scheme media feature
    // https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

document.addEventListener("DOMContentLoaded", () => {
    const preferredTheme = getTheme()
    if (preferredTheme === "light") {
        themeBtn.checked = false
        document.documentElement.setAttribute("data-bs-theme", "light")
        if (themeIcon.classList.contains("text-warning")) {
            themeIcon.classList.remove("text-warning")
        }
    } else {
        themeBtn.checked = true
        document.documentElement.setAttribute("data-bs-theme", "dark")
        themeIcon.classList.add("text-warning")
    }
})

themeBtn.addEventListener("change", () => {
    if (themeBtn.checked) {
        document.documentElement.setAttribute("data-bs-theme", "dark")
        themeIcon.classList.add("text-warning")
        localStorage.setItem("theme", "dark")
    } else {
        document.documentElement.setAttribute("data-bs-theme", "light")
        localStorage.setItem("theme", "light")
        if (themeIcon.classList.contains("text-warning")) {
            themeIcon.classList.remove("text-warning")
        }
    }
})