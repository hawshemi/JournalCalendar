document.addEventListener("DOMContentLoaded", () => {
    let calendarDayCells = document.querySelectorAll("td")

    document.addEventListener("click", (event) => {
        const element = event.target
        // Redirect user to new entry page on button click
        if (element.id === "newEntryBtn") {
            const daysDateEl = document.getElementById("daysInvisDate")
            location.href = `${originURL}/create_entry/${daysDateEl.value}`
        } else if (element.id.startsWith("editBtn")) {
            const dateToUpdate = element.dataset.date
            location.href = `${originURL}/update_entry/${dateToUpdate}`
        } else if (element.id.startsWith("deleteBtn")) {
            const entryID = element.dataset.id
            const dateToDelete = element.dataset.date

            deleteEntry(entryID).then(res => {
                if (!res.ok) {
                    throw new Error("Oops! Something went wrong.")
                }
                displayAlert("success", "Entry deleted.")

                // Display entry view of deleted day
                getEntry(dateToDelete).then(data => displayDaysEntry(data, dateToDelete))

                // Remove highlighting
                calendarDayCells.forEach(boardCell => {
                    if (boardCell.dataset.date === dateToDelete) {
                        boardCell.style.backgroundColor = "#eee"
                    }
                })
            }).catch(err => displayAlert("error", err))

        } else if (element.id.startsWith("prevMonthBtn")) {
            element.setAttribute("disabled", true)
            // Draw previous month's board on the screen
            const firstDayCell = document.querySelector("tbody")
            const dateBeingShowed = firstDayCell.firstElementChild.firstElementChild.dataset.date
            const oneMonthBefore = new Date(new Date(new Date(`${dateBeingShowed}`).setDate(1)).setMonth(new Date(`${dateBeingShowed}`).getMonth() - 1))
            const prevMonthIdx = oneMonthBefore.getMonth()
            const prevMonthsYear = oneMonthBefore.getFullYear()

            cleanBoard()
            setTimeout(() => {
                drawBoard(prevMonthIdx, prevMonthsYear)
                element.removeAttribute("disabled")
            }, 200);

        } else if (element.id.startsWith("nextMonthBtn")) {
            element.setAttribute("disabled", true)
            // Draw previous month's board on the screen
            const firstDayCell = document.querySelector("tbody")
            const dateBeingShowed = firstDayCell.firstElementChild.firstElementChild.dataset.date
            const oneMonthAfter = new Date(new Date(new Date(`${dateBeingShowed}`).setDate(1)).setMonth(new Date(`${dateBeingShowed}`).getMonth() + 1))
            const nextMonthIdx = oneMonthAfter.getMonth()
            const nextMonthsYear = oneMonthAfter.getFullYear()

            cleanBoard()
            setTimeout(() => {
                drawBoard(nextMonthIdx, nextMonthsYear)
                element.removeAttribute("disabled")
            }, 200);

        } else if (element.dataset.date) {
            // Show day's entry that is being clicked
            const clickedDate = element.dataset.date
            getEntry(clickedDate).then(data => displayDaysEntry(data, clickedDate))
        }
    })

    // * gets today's entry when home page loaded
    getEntry(getNthDaysDate(currentDate.getMonth(), currentDate.getFullYear(), currentDate.getDate())).then(data => {
        displayDaysEntry(data, dateObjToYYYYmmdd(currentDate))
    })


})