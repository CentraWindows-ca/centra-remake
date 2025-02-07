import moment from 'moment';
import { ProductionStates } from "../../app/utils/constants";

const randomizeState = () => {
    let keys = Object.keys(ProductionStates);
    const randomIndex = Math.floor(Math.random() * keys.length);
    return keys[randomIndex];
}

export const generateEvents = () => {
    let events = [];

    for (let i = 0; i < 31; i++) {        
        for (let j = 0; j < 10; j++) {
            let title = `TestEvent-${j + 1}-${i + 1}`;
            let year = moment().format("YYYY");
            let month = moment().format("MM");
            let day = (j + 1) < 10 ? `0${j + 1}` : `${j + 1}`;

            events.push({
                id: title,
                title: title,
                start: `${year}-${month}-${day}`,
                state: randomizeState()
            });
        }
    }

    return events;
}