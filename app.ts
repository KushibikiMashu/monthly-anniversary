const properties = PropertiesService.getScriptProperties()
// Message API
const GROUP_ID = properties.getProperty('LINE_GROUP_ID')
const CHANNEL_ACCESS_TOKEN = properties.getProperty('LINE_MESSAGE_API_CHANNEL_ACCESS_TOKEN')
const MESSAGE_API_v2_ENDPOINT = 'https://api.line.me/v2/bot/message/push'
const MILLISECONDS_OF_DAY = 86400000
const DAYS_OF_YEAR = 365
const STAMPS = [
    608, // プレゼントボックス
    301, // カクテル
    269, // ハート
    268, // 虹
]

type Headers = { [key: string]: string }

enum Anniversary {
    Dating,
    Marriage
}

type DiffDays = number

type DiffDate = {
    years: number,
    days: number,
}

function sendOnDatingDate() {
    const diffDays = calculateDiffDays('2016-05-03');
    const diffDate = getYearsAndDays(diffDays)
    const message = createMessage(diffDays, diffDate, Anniversary.Dating)
    send(message)
}

function sendOnMarriageDate() {
    const diffDays = calculateDiffDays('2019-11-22');
    const diffDate = getYearsAndDays(diffDays)
    const message = createMessage(diffDays, diffDate, Anniversary.Marriage)
    send(message)
}

function calculateDiffDays(target: string): DiffDays {
    const diff = (new Date().getTime() - new Date(target).getTime()) / MILLISECONDS_OF_DAY
    return Math.floor(diff)
}

function getYearsAndDays(diff: number): DiffDate {
    const years = Math.floor(diff / DAYS_OF_YEAR)
    const days = diff - DAYS_OF_YEAR * years
    return {years, days}
}

function createMessage(diff: number, date: DiffDate, type: Anniversary): string {
    const {years, days} = date;
    switch (type) {
        case Anniversary.Dating:
            return `🎉おめでとう🎉
二人が付き合ってから
${diff}日が経ちました😍
今日で${years}年と${days}日です💕
これからもよろしくね😘`

        case Anniversary.Marriage:
            return `二人が結婚してから
${diff}日が経ちました😍
おめでとう🎉🎉🎉

今日で${years}年と${days}日です💕💕💕
これからもよろしくね😘`

        default:
            return 'ソースコードが何かおかしいかも。チェックしてみて'
    }
}

function send(message: string): void {
    const options: URLFetchRequestOptions = {
        "method": "post",
        "headers": getHeaders(),
        "payload": createJsonString(message),
        "muteHttpExceptions": true
    }
    Logger.log(options);
    const res = UrlFetchApp.fetch(MESSAGE_API_v2_ENDPOINT, options);
    Logger.log(res.getContentText());
}

function getHeaders(): Headers {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${CHANNEL_ACCESS_TOKEN}`
    }
}

function getStampNumber(): number {
    const length = STAMPS.length
    const random = getRandomInt(length)
    return STAMPS[random]
}

function getRandomInt(max: number): number {
    return Math.floor(Math.random() * Math.floor(max));
}

function createJsonString(message: string): string {
    return JSON.stringify({
        to: GROUP_ID,
        messages: [
            {
                type: "text",
                text: message
            },
            {
                "type": "sticker",
                "packageId": "4",
                "stickerId": getStampNumber()
            }
        ]
    })
}

function createPayload(message: string): string {
    const params = {
        message,
        'stickerPackageId': 4,
        'stickerId': getStampNumber()
    }

    let body = [];
    Object.keys(params).map(key => {
        body.push(key + '=' + encodeURI(params[key]));
    })
    return body.join("&")
}
