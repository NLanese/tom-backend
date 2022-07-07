const getCurrentTime = () => {
    var today = new Date()
    var hh = today.getHours()
    let am_or_pm = "am"
    var mm = today.getMinutes()
    var ss = today.getSeconds()

    if (hh > 12){
        hh = hh - 12
    }

    hh = String(hh).padStart(2, '0')
    mm = String(mm).padStart(2, '0')
    ss = String(ss).padStart(2, '0')

    return {
        fullTime: `${hh}:${mm}:${ss}${am_or_pm}`,
        hourMin: `${hh}:${mm}${am_or_pm}`,
        hour: hh,
        min: mm,
        seconds: ss,
        time: am_or_pm
    }
}

export default getCurrentTime