const currentDate = new Date()

// Returns "YYYY-mm" of given date
const getYYYYmmOfDate = (monthIdx, year) => {
    return `${year}-${String(monthIdx + 1).padStart(2, '0')}`
}

// Returns "YYYY-mm-dd" of given day
// const getNthDaysDate = (n) => new Date(new Date().setUTCDate(n)).toISOString().substring(0, 10)
const getNthDaysDate = (monthIdx, year, n) => new Date(new Date(year, monthIdx + 1).setUTCDate(n)).toISOString().substring(0, 10)

// Returns number of days of the current month
const getDaysOfCurMonth = () => {
    const currentYear = currentDate.getFullYear()
    const nextMonth = currentDate.getMonth() + 1

    // parameter "0" gives us the last day of prev. month 
    const daysInCurrentMonth = new Date(currentYear, nextMonth, 0).getDate()
    return daysInCurrentMonth
}

// Returns number of days of the current month
const getDaysOfMonth = (monthIdx, year) => {
    const nextMonthIdx = monthIdx + 1
    // parameter "0" gives us the last day of prev. month 
    const daysInMonth = new Date(year, nextMonthIdx, 0).getDate()
    return daysInMonth
}

// Returns formatted board label
const formatBoardLabel = (monthIdx, year) => {
    return `${new Date(year, monthIdx).toLocaleDateString("default", { month: "short" })}, ${year}`
}

// Draw current month's activity board
document.addEventListener("DOMContentLoaded", () => {
    drawBoard(currentDate.getMonth(), currentDate.getFullYear())
})

// Draws activity board
const drawBoard = (monthIdx, year) => {
    // Existing html elements
    const boardLabelEl = document.getElementById("boardLabel")
    const boardHead = document.getElementById("boardHead")

    // Calculations
    const date = new Date(year, monthIdx)
    // Number of days in month
    const daysInMonth = getDaysOfMonth(date.getMonth(), date.getFullYear())
    // getDay() returns btw 0-6, Sunday = 0, Saturday = 6
    const startsAtNthDay = new Date(new Date(year, monthIdx).setDate(1)).getDay()
    // get Monday-based index
    let indexOfStartAtNthDay
    if (startsAtNthDay === 0) {
        indexOfStartAtNthDay = 6
    } else {
        indexOfStartAtNthDay = startsAtNthDay - 1
    }
    // const indexOfStartAtNthDay = startsAtNthDay - 1
    const totalDaysIncludingOffset = daysInMonth + indexOfStartAtNthDay
    const daysInLastWeek = totalDaysIncludingOffset % 7 === 0 ? 7 : totalDaysIncludingOffset % 7
    const numberOfWeeks = Math.ceil(totalDaysIncludingOffset / 7)

    // Label
    const boardLabelContent = formatBoardLabel(monthIdx, year)
    boardLabelEl.textContent = boardLabelContent

    // Table Body
    const boardBody = document.createElement("tbody")
    boardBody.className = "d-flex flex-column gap-2"
    boardBody.setAttribute("style", "animation-name: show; animation-duration: 0.2s; animation-fill-mode: forwards; animation-timing-function: linear; -webkit-animation-timing-function: linear; animation-play-state: paused;")

    // * create calendar-like monthly activity board
    let n = 0;
    while (n < daysInMonth) {
        for (let i = 0; i < numberOfWeeks; i++) {
            const newRow = document.createElement("tr")
            if (i === 0) {
                newRow.className = "d-flex align-items-center justify-content-end gap-2"
                for (let j = indexOfStartAtNthDay; j < 7; j++) {
                    const newCell = document.createElement("td")
                    newCell.role = "button"
                    newCell.dataset["date"] = getNthDaysDate(monthIdx, year, n + 1)
                    newCell.textContent = n + 1
                    n++
                    newRow.appendChild(newCell)
                }
                boardBody.appendChild(newRow)
            } else if (i === numberOfWeeks - 1) {
                newRow.className = "d-flex align-items-center justify-content-start gap-2"
                for (let k = 0; k < daysInLastWeek; k++) {
                    const newCell = document.createElement("td")
                    newCell.role = "button"
                    newCell.dataset["date"] = getNthDaysDate(monthIdx, year, n + 1)
                    newCell.textContent = n + 1
                    n++
                    newRow.appendChild(newCell)
                }
                boardBody.appendChild(newRow)
            } else {
                newRow.className = "d-flex align-items-center justify-content-center gap-2"
                for (let l = 0; l < 7; l++) {
                    const newCell = document.createElement("td")
                    newCell.role = "button"
                    newCell.dataset["date"] = getNthDaysDate(monthIdx, year, n + 1)
                    newCell.textContent = n + 1
                    n++
                    newRow.appendChild(newCell)
                }
                boardBody.appendChild(newRow)
            }

        }

    }

    boardHead.insertAdjacentElement("afterend", boardBody)
    const calendarDayCells = document.querySelectorAll("td")

    // * highlight today
    const todaysYYmmDD = dateObjToYYYYmmdd(currentDate)
    // first 7 cells are labels
    calendarDayCells.forEach(dayCell => {
        if (dayCell.dataset.date === todaysYYmmDD) {
            dayCell.setAttribute("style", "border: 3px #d7f solid")
        }
    })

    // * Highlight active days of this month
    getEntries().then(entries => {
        // filter first 7 chars of date e.g. "2023-06"
        const monthsEntries = entries.filter(entry => entry.date.slice(0, 7) === getYYYYmmOfDate(monthIdx, year))

        monthsEntries.forEach(entry => {
            const activeDay = new Date(entry.date).getDate()
            // first 7 cells (6 indexes) are labels
            const indexOfDayToHighlight = activeDay + 6
            calendarDayCells[indexOfDayToHighlight].style.backgroundColor = "#afac"

        })
    })


    boardBody.style.animationPlayState = "running"


}

const cleanBoard = () => {
    const boardBody = document.querySelector("tbody")
    boardBody.setAttribute("style", "animation-name: hide; animation-duration: 0.2s; animation-fill-mode: forwards; animation-timing-function: linear; -webkit-animation-timing-function: linear; animation-play-state: paused;")
    boardBody.style.animationPlayState = "running"
    boardBody.addEventListener("animationend", () => {
        boardBody.innerHTML = ``
        boardBody.remove()
    })
}