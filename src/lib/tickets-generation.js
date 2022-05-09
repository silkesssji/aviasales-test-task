const carriers = ["S7", "Aeroflot", "Utair"];
const aviaCodes = ["ABA", "DYR", "AAQ", "WZA", "KEJ", "MMK", "RTW", "YKS", "SLY", "MOW"]

export const ticketsGeneration = (count, stopped) => {
    const newDate = (n) => {
        let result = Math.floor(Math.random() * n);
        if (n === 60 ) {
            result = Math.floor(result/10) * 10;
        }
        if (result < 10) {
            result = "0" + (result.toString());
        }
        return result;
    }
    const newStops = (origin, dest) => {
        let array = [];
        for ( let i=0; i < Math.floor(Math.random() * 4); i++) {
            let pushing = (aviaCodes[Math.floor(Math.random() * 10)]);
            if (!array.find(elem => elem === pushing) && (origin !== pushing) && (dest !== pushing)) {
                array.push(pushing);
            }
        }
        return array;
    }
    const newTicket = () => {
        let price = (Math.floor(Math.random() * 35 + 11)) + " " + (Math.floor(Math.random() * 9)) + "00";
        let carrier = carriers[Math.floor(Math.random() * (carriers.length))];
        let origin1 = aviaCodes[Math.floor(Math.random() * 10)];
        let destination1 = origin1;
        while (destination1 === origin1) {
            destination1 = aviaCodes[Math.floor(Math.random() * 10)];
        }
        let origin2 = destination1;
        let destination2 = origin1;
        let firstDate = (newDate(24) + ":" + newDate(60) + "-" + newDate(24) + ":" +  newDate(60));
        let secondDate = (newDate(24) + ":" + newDate(60) + "-" + newDate(24) + ":" +  newDate(60));
        return ({
        'price': price,
        'carriers': carrier,
        'segments': [{
            'origin': origin1,
            'destination': destination1,
            "date": firstDate,
            "stops": (newStops(origin1, destination1)),
            "duration": (Math.floor(Math.random() * 99 + 20)*10)
            }, 
            {
            'origin': origin2,
            'destination': destination2,
            "date": secondDate,
            "stops": (newStops(origin2, destination2)),
            "duration": (Math.floor(Math.random() * 99 + 20)*10)
            }
            ]
        }
        )
    }
    let response = {
        tickets: []
    };
    for (let i = 0; i < count; i++) {
        response.tickets.push(newTicket());
    }
    response["stop"] = stopped;
    return response;
}

