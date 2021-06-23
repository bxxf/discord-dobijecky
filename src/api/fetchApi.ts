import { fetchMessage } from './fetch';
export const fetchApi = async () => {
    const response = await fetchMessage(true)

    const dateString = response.match(
        /(0?[1-9]|[12][0-9]|3[01])\. ?(0?[1-9]|1[0-2])\. ?20[0-9]{2}/
    );

    const currentDate = new Date();

    if (currentDate.getMonth() !== parseInt(dateString[2]) || currentDate.getDay() !== parseInt(dateString[1])) return {status: false}

    const timeRange: any = [];
    const timeRegex = /([0-1]?[0-9]|2[0-3]):[0-5][0-9]/g;

    let match = timeRegex.exec(response);

    while (match != null) {
        timeRange.push(match[0]);
        match = timeRegex.exec(response);
    }

    if (
        currentDate.getHours() >= parseInt(timeRange[0]) &&
        currentDate.getHours() <= parseInt(timeRange[1])
    ) {

        return {
            status: true,
            from: timeRange[0],
            to: timeRange[1],
            day: dateString[1],
            month: dateString[2]
        }
    }
    else return {
        status: false
    }

}