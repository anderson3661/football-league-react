export function goToTopOfPage() {
    window.scrollTo(0, 0);
}

export function getEmptyAllFixtures() {
    return [{ dateOfSetOfFixtures: "", fixtures: [] }];
}

export function getEmptySetOfFixtures() {
    return { dateOfSetOfFixtures: "", fixtures: [] };    
}

export function getRandomNumber(nToRandomise) {
    return Math.floor(Math.random() * nToRandomise);
}


export function formatDate(dateOfFixtures) {
    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    let date = new Date(dateOfFixtures);
    let day = date.getDate();
    let monthIndex = date.getMonth();
    // let year = date.getFullYear();
    let sDaySuffix;

    if (day === 1 || day === 21 || day === 31) {
        sDaySuffix = "st";
    } else if (day === 2 || day === 22) {
        sDaySuffix = "nd";
    } else if (day === 3 || day === 23) {
        sDaySuffix = "rd";
    } else {
        sDaySuffix = "th";
    }

    return dateOfFixtures.substr(0, 4) + day + sDaySuffix + ' ' + monthNames[monthIndex];
}


export function getPositionInArrayOfObjects(array, objectProperty, objectValue) {
    let i = 0;
    let len;

    for (i = 0, len = array.length; i < len; i++) {
        if (array[i][objectProperty] === objectValue) return i;
    }
    return -1;
}


export function deepSortAlpha(args) {
    // empArray.sort(multiSort( 'lastname','firstname')) Reverse with '-lastname'
    let sortOrder = 1;
    let prop = "";
    let aa = "";
    let bb = "";

    return function (a, b) {

        for (var i = 0; i < args.length; i++) {

            if (args[i][0] === '-') {
                prop = args[i].substr(1);
                sortOrder = -1;
            } else {
                sortOrder = (args[i] === "teamName") ? 1 : -1;
                prop = args[i]
            }

            aa = a[prop];
            bb = b[prop];

            if (aa < bb) return -1 * sortOrder;
            if (aa > bb) return 1 * sortOrder;
        }

        return 0
    }
}