document.addEventListener("DOMContentLoaded", () => {
    const filterForm = document.getElementById("filter-form");

    // Create a function to create and populate a select element
    const createAndPopulateSelect = (id, name, label, options, defaultValue) => {
        const selectEl = document.createElement("select");
        selectEl.className = "form-select";
        selectEl.name = name;
        selectEl.id = id;

        // Create a default option
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = label;
        selectEl.appendChild(defaultOption);

        // Create and add options
        options.forEach(optionValue => {
            const optionEl = document.createElement("option");
            optionEl.value = optionValue;
            optionEl.textContent = optionValue;
            selectEl.appendChild(optionEl);
        });

        // Set the default value
        if (defaultValue) {
            selectEl.value = defaultValue;
        }

        filterForm.appendChild(selectEl);
        return selectEl;
    };

    // Months, from "Month" to "12"
    const selectMonthEl = createAndPopulateSelect("month-filter", "month", "Month", [...Array(13).keys()], currentMonth);

    // Years, from "Year" to the current year
    const selectYearEl = createAndPopulateSelect("year-filter", "year", "Year", [...Array(currentYear - 2020).keys()].map(i => i + 2021));

    // Submit button
    const submitInput = document.createElement("input");
    submitInput.className = "btn btn-outline-primary btn-sm";
    submitInput.type = "submit";
    submitInput.value = "Apply Filters";

    filterForm.appendChild(submitInput);

    // Disable filter on page load
    submitInput.disabled = true;

    // Enable the submit button when both month and year are selected
    const toggleDisable = () => {
        submitInput.disabled = !(selectMonthEl.value && selectYearEl.value);
    };

    selectMonthEl.addEventListener("change", toggleDisable);
    selectYearEl.addEventListener("change", toggleDisable);
});
