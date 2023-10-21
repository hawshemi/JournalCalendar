document.addEventListener("DOMContentLoaded", () => {

    let ruleDiv = document.getElementById("hrOrVr")
    const horRule = document.createElement("hr")

    const ruleDecider = (width) => {
        console.log(width);
        if (width >= 992) {
            ruleDiv.className = "vr"
            if (horRule) {
                horRule.remove()
            }
        } else {
            console.log("small");
            ruleDiv.className = ""
            ruleDiv.append(horRule)
        }
    }

    // window.addEventListener("load", ruleDecider(window.innerWidth))

    window.addEventListener("resize", () => ruleDecider(window.innerWidth))
})

