const getTodaysDate = (daysAdded=0) => {
    var today = new Date();
    today.setDate(today.getDate() + daysAdded)
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 01
    var yyyy = today.getFullYear().toString();

    // dd = parseInt(dd, 10) 
    // dd = dd + daysAdded

    // // Months with 31 Days
    // if (mm === "01" || mm === "03" || mm === "05" || mm === "07" || mm === "08" || mm === "10" || mm === "12"){
    //     if (dd > 31){
    //         dd = 1 
    //         mm = (parseInt(mm, 10) + 1).toString()
    //     }
    //     if (mm > 12){
    //         mm = 1
    //         yyyy = yyyy + 1
    //     }
    // }
    // // Months with 30 Dats
    // if (mm === "04" || mm === "06" || mm === "09" || mm === "11"){
    //     if (dd > 30){
    //         dd = 1
    //         mm = (parseInt(mm, 10) + 1).toString()
    //     }
    // }

    // // Stupid ass February
    // if (mm === "02"){
    //     if (yyyy % 4 === 0){
    //         if (dd > 29){
    //             dd = 1
    //             mm = (parseInt(mm, 10) + 1).toString()
    //         }
    //     }
    //     else {
    //         if (dd > 28){
    //             dd = 1
    //             mm = (parseInt(mm, 10) + 1).toString()
    //         }
    //     }
    // }

    // dd = dd.toString()
    // if (dd < 10){
    //     dd = `0${dd}`
    // }
    // else{
    //     dd = `${dd}`
    // }
    
    today = mm + '/' + dd + '/' + yyyy;
    return {date: today, day: dd, month: mm, year: yyyy.slice(2)}
}

export default getTodaysDate