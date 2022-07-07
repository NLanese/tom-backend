const withinTimeframe = (currentTime, deadlineTime) => {
    const deadline = {
        date: deadlineTime.date,
        time: deadlineTime.time
    }

    const current = {
        date: currentTime.date,
        time: currentTime.time
    }
    // If year is higher
    if (current.date.split("/")[2] > deadline.date.split("/")[2]){
        return false
    }
    // If month is higher
    if (current.date.split("/")[0] > deadline.date.split("/")[0]){
        return false
    }
    // If date is higher
    if (current.date.split("/")[1] > deadline.date.split("/")[1]){
        return false
    }
    else if (current.date.split("/")[1] < deadline.date.split("/")[1]){
        return true
    }

    // If the AM / PM works
    if (current.time.includes("p") && deadline.time.includes("a")){
        return false
    }
    else if (current.time.includes("a") && deadline.time.includes("p")){
        return true
    }

    // Hours
    if (current.time.split(":")[0] > deadline.time.split(":")[0]){
        return false
    }
    else if (current.time.split(":")[0] < deadline.time.split(":")[0]){
        return true
    }

    // Minutes
    if (current.time.split(":")[1] > deadline.time.split(":")[1]){
        return false
    }
    else if (current.time.split(":")[1] < deadline.time.split(":")[1]){
        return true
    }

}

export default withinTimeframe