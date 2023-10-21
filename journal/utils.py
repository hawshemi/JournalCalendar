from datetime import datetime, timedelta


def calculate_longest_streak(entries):
    # user has no entries yet
    if not entries:
        return 0

    # initial values
    longest_streak = 1
    current_streak = 1
    prev_entry_date = datetime.strptime(
        f"{entries[0].date}", "%Y-%m-%d").date()

    # iterate over entries starting from 2nd entry
    for entry in entries[1:]:
        curr_entry_date = datetime.strptime(f"{entry.date}", "%Y-%m-%d").date()

        # calculate difference btw current and previous entry dates
        date_difference_btw_entries = curr_entry_date - prev_entry_date

        # if prev date, curr date are consecutive days
        # timedelta(days=1) represents one day
        if date_difference_btw_entries == timedelta(days=1):
            current_streak += 1
        else:
            current_streak = 1

        if current_streak > longest_streak:
            longest_streak = current_streak

        prev_entry_date = curr_entry_date

    return longest_streak
