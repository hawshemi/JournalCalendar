let daysEntryParentDiv
let daysHeadingEl
let newEntryBtnDiv
let data
let csrfToken
const originURL = window.location.origin

document.addEventListener("DOMContentLoaded", () => {
    daysEntryParentDiv = document.getElementById("daysEntry")
    daysHeadingEl = document.getElementById("daysHeading")
    newEntryBtnDiv = document.getElementById("newEntryBtnDiv")
    csrfToken = document.getElementById("csrfToken").value
})

const dateObjToYYYYmmdd = (date) => {
    const dt = new Date(date)
    const year = dt.getFullYear()
    const month = String(dt.getMonth() + 1).padStart(2, '0')
    const day = String(dt.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

// * displays alert notification
const displayAlert = (type, data) => {
    const alertDiv = document.createElement("div")
    alertDiv.setAttribute("class", `alert alert-${type === 'info' ? 'info' : type === 'success' ? 'success' : 'danger'} ${type === 'error' && 'alert-dismissible fade show'} shadow-lg`)
    alertDiv.setAttribute("role", "alert")
    alertDiv.setAttribute("style", "position: fixed; right: 10px; top: 64px; z-index: 2; calc(100% - 20px);")
    if (type === "error") {
        alertDiv.innerHTML = `${data.message}`
        const closeBtn = `
            <button aria-label="Close" class="btn-close" data-bs-dismiss="alert" type="button"></button>
        `
        alertDiv.innerHTML += closeBtn
        document.body.appendChild(alertDiv)
    } else {
        alertDiv.innerHTML = data
        document.body.appendChild(alertDiv)
        setTimeout(() => {
            alertDiv.remove()
        }, 2000);
    }
}

// * returns all entries
async function getEntries() {
    // once run, do not fetch data again
    if (data) return data
    try {
        const res = await fetch(`${originURL}/entries`)
        if (!res.ok) { throw new Error("Could not fetch data!") }
        data = await res.json()
        // console.log("getEntries: ", data);
        return data
    } catch (error) {
        displayAlert("error", error)
    }
}

// * returns entry on specific date
async function getEntry(date = null) {
    try {
        const res = await fetch(`${originURL}/entry_on/${date}`)
        // console.log(res);
        if (!res.ok) { throw new Error("Could not fetch data.") }
        const data = await res.json()
        // console.log(data);
        return data
    }
    catch (error) {
        displayAlert("error", error)
    }
}


// * deletes entry with a given id
async function deleteEntry(entryID) {
    return fetch(`${originURL}/entry/${entryID}`, {
        method: "DELETE",
        headers: {
            'X-CSRFToken': csrfToken
        }
    })
}

// * displays specific day's entry
const displayDaysEntry = (entry, date) => {
    // * clean everything in daysEntry
    daysEntryParentDiv.innerHTML = ""
    newEntryBtnDiv.innerHTML = ""

    const invisDateInput = document.createElement("input")
    invisDateInput.style.display = "none"
    invisDateInput.disabled = true
    invisDateInput.type = "text"
    invisDateInput.value = date
    invisDateInput.id = "daysInvisDate"
    daysEntryParentDiv.appendChild(invisDateInput)

    if (date === dateObjToYYYYmmdd(new Date())) {
        daysHeadingEl.textContent = "Today"
    } else {
        // todo: get date from dataset
        daysHeadingEl.textContent = new Date(date).toLocaleDateString()
    }

    if (entry.error === "No entry on this day.") {
        // Message
        const noEntryParEl = document.createElement("p")
        noEntryParEl.className = "lead my-0"
        noEntryParEl.textContent = "No entry to show."
        // Button
        // const newEntryBtnDiv = document.createElement("div")
        // newEntryBtnDiv.className = "d-grid gap-2 col-12 mx-auto mb-3"
        const newEntryBtn = document.createElement("button")
        newEntryBtn.id = "newEntryBtn"
        newEntryBtn.innerHTML = `
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                            </svg>New Entry
                        `
        newEntryBtn.className = "btn btn-primary d-flex align-items-center justify-content-center gap-2 py-2 rounded-3"

        newEntryBtnDiv.appendChild(newEntryBtn)
        // daysEntryParentDiv.insertAdjacentElement("afterend", newEntryBtnDiv)
        daysEntryParentDiv.appendChild(noEntryParEl)
    } else {
        // console.log(entry);
        // * today's entry exists
        const daysEntryDiv = document.createElement("div")
        daysEntryDiv.className = "px-2 text-break w-100"
        daysEntryDiv.innerHTML = entry.content

        const entryFooterDiv = document.createElement("div")
        entryFooterDiv.className = "d-flex justify-content-between"
        const tagsDiv = document.createElement("div")
        tagsDiv.className = "border-top d-flex gap-2 pt-2 pb-0 mt-2"

        for (const tag of entry.tags) {
            // console.log(tag);
            const tagEl = document.createElement("span")
            tagEl.className = "badge text-bg-secondary rounded-pill"
            tagEl.textContent = tag
            tagsDiv.appendChild(tagEl)
            // daysEntryDiv.insertAdjacentElement("beforeend", tagsDiv)
        }

        //#region edit + delete menu button
        const optionsBtnNavEl = document.createElement("nav")
        optionsBtnNavEl.className = "d-flex align-items-end"
        optionsBtnNavEl.id = "optionsBtn"
        const optionsDropdownEl = document.createElement("li")
        optionsDropdownEl.className = "nav-item dropdown"
        const optionsDropDownBtn = document.createElement("a")
        optionsDropDownBtn.className = "nav-link"
        optionsDropDownBtn.href = "javascript:void(0)"
        optionsDropDownBtn.role = "button"
        optionsDropDownBtn.dataset.bsToggle = "dropdown"
        optionsDropDownBtn.ariaExpanded = false
        optionsDropDownBtn.setAttribute("style", "font-size: 12px; opacity: 0.7")
        optionsDropDownBtn.textContent = "•••"
        const optionsUListEl = document.createElement("ul")
        optionsUListEl.className = "dropdown-menu"
        const optOneListEl = document.createElement("li")
        const optOneEl = document.createElement("a")
        optOneEl.className = "dropdown-item"
        optOneEl.id = `editBtn-${entry.id}`
        optOneEl.dataset.id = entry.id
        optOneEl.dataset.date = entry.date
        optOneEl.href = "javascript:void(0)"
        optOneEl.textContent = "Edit"
        const optTwoListEl = document.createElement("li")
        const optTwoEl = document.createElement("a")
        optTwoEl.className = "dropdown-item"
        optTwoEl.id = `deleteBtn-${entry.id}`
        optTwoEl.dataset.id = entry.id
        optTwoEl.dataset.date = entry.date
        optTwoEl.href = "javascript:void(0)"
        optTwoEl.textContent = "Delete"
        //#endregion



        optOneListEl.appendChild(optOneEl)
        optTwoListEl.appendChild(optTwoEl)
        optionsUListEl.appendChild(optOneListEl)
        optionsUListEl.appendChild(optTwoListEl)
        optionsDropdownEl.appendChild(optionsDropDownBtn)
        optionsDropdownEl.appendChild(optionsUListEl)
        optionsBtnNavEl.appendChild(optionsDropdownEl)

        entryFooterDiv.appendChild(tagsDiv) // * OK
        entryFooterDiv.appendChild(optionsBtnNavEl) // * ok

        // daysEntryDiv.appendChild(tagsDiv)
        // daysEntryDiv.appendChild(entryFooterDiv)
        daysEntryDiv.insertAdjacentElement("beforeend", entryFooterDiv)

        daysEntryParentDiv.insertAdjacentElement("beforeend", daysEntryDiv)

    }

    if (entry.message === "Entry deleted.") {
        displayAlert("success", entry.message)
    }
}