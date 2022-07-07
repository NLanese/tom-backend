const addTime = (minutesAdded, dateTimeObj) => {
    let hoursAdded = minutesAdded / 60
    if (hoursAdded > 0){
        minutesAdded = minutesAdded - (60 * hoursAdded)
    }

    console.log(dateTimeObj)
    let AM_or_PM 
    if (dateTimeObj.time.includes("a")){
        AM_or_PM = "am"   
    }
    else{
        AM_or_PM = "pm"
    }
    let hour = parseInt(dateTimeObj.time.split(":")[0], 10)
    let minutes = parseInt(dateTimeObj.time.split(":")[1], 10)
    let month = parseInt(dateTimeObj.date.split("/")[0], 10)
    let day = parseInt(dateTimeObj.date.split("/")[1], 10)
    let year = parseInt(dateTimeObj.date.split("/")[2], 10)

    minutes = minutes + minutesAdded

    if (minutes > 60){
        hoursAdded = hoursAdded + 1
        minutes = minutes - 60
    }
    if (hour > 24){
        if (AM_or_PM == "am"){
            AM_or_PM == "pm"
        }
        else if (AM_or_PM == "am"){
            day = day + 1
        }
    }
    if (day > 28){
        if (month == 2){
            if (year % 4 === 0){
                if (day > 29){
                    month = month + 1
                    day = 1
                }
            }
            else{
                month = month + 1
                day = 1
            }
        }  
    }
    if (day > 30){
        if (month === 4 || month === 6 || month === 9 || month === 11){
            month = month + 1
            day = 1
        }
    }
    if (day > 31){
        if (month === 1 | month === 3 || month === 5 || month === 7 || month === 8 || month === 10){
            month = month + 1
            day = 1
        }
        else if (month === 12){
            month = 1
            year = year + 1
        }
    }

    hour = String(hour).padStart(2, '0')
    minutes = String(minutes).padStart(2, '0')

    day = String(day).padStart(2, '0')
    month = String(month).padStart(2, '0')
    year = String(year).padStart(2, '0')

    return {date: `${month}/${day}/${year}`, time: `${hour}:${minutes}${AM_or_PM}`}
}

export default addTime
