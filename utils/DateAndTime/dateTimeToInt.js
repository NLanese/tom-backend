const dateTimeToInt = (dateTimeObj) => {

    console.log(dateTimeObj)

    let hour = parseInt(dateTimeObj.time.split(":")[0], 10)
    let minutes = parseInt(dateTimeObj.time.split(":")[1], 10)
    let month = parseInt(dateTimeObj.date.split("/")[0], 10)
    let day = parseInt(dateTimeObj.date.split("/")[1], 10)
    let year = parseInt(dateTimeObj.date.split("/")[2], 10)

    let returnInt = ((year - 2000) * 100000) + (month * 500) + (day * 70) + (hour * 10) + minutes
    return returnInt
}

export default dateTimeToInt