const properties = PropertiesService.getScriptProperties()
const TOKEN = properties.getProperty('LINE_NOTIFY_TOKEN')
const FROM = new Date(properties.getProperty('FROM'))
const ENDPOINT = 'https://notify-api.line.me/api/notify'
const MILLISECONDS_OF_DAY = 86400000
const DAYS_OF_YEAR = 365
const STAMPS = [
    608, // プレゼントボックス
    301, // カクテル
    269, // ハート
    268, // 虹
]

function getHeaders(): { [key: string]: string } {
    return {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${TOKEN}`
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

function getPayload(): string {
    const params = {
        'message': getMessage(),
        'stickerPackageId': 4,
        'stickerId': getStampNumber()
    }

    let body = [];
    Object.keys(params).map(key => {
        body.push(key + '=' + encodeURI(params[key]));
    })
    return body.join("&")
}

function getMessage(): string {
    const now = new Date()
    const diff = getDayDiff(now)
    const [years, days] = getYearsAndDays(diff)
    return createMessage(diff, years, days)
}

function getDayDiff(now: Date): number {
    const diff = (now - FROM) / MILLISECONDS_OF_DAY
    return Math.floor(diff)
}

function getYearsAndDays(diff: number): Array<number> {
    const years = Math.floor(diff / DAYS_OF_YEAR)
    const days = diff - DAYS_OF_YEAR * years
    return [years, days]
}

function createMessage(diff: number, years: number, days: number): string {
    return `🎉おめでとう🎉
二人が付き合ってから
${diff}日が経ちました😍
今日で${years}年と${days}日です💕
これからもよろしくね😘`
}

function send(): void {
    const options = {
        "method": "POST",
        "headers": getHeaders(),
        "payload": getPayload(),
        "muteHttpExceptions": true
    }
    Logger.log(options);
    const res = UrlFetchApp.fetch(ENDPOINT, options);
    Logger.log(res.getContentText());
}