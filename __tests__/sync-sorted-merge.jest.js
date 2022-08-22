const { validateLogData, sorAsc, mergeLog } = require("../solution/sync-sorted-merge");

describe('sync Sorted Logs', () => {
    beforeAll(() => {
        this.unsortedLogsOfTwo = [
            {"drained": false, "last": {"date": "2022-06-22T03:03:09.292Z", "msg": "" }},
            {"drained": false, "last": {"date": "2022-06-26T03:03:09.292Z", "msg": "" }},
        ];

        this.unorderedLogsList = [
            {"drained": false, "last": {"date": "2022-07-03T03:03:09.292Z", "msg": "" }},
            {"drained": false, "last": {"date": "2022-06-24T03:03:09.292Z", "msg": "" }},
            {"drained": false, "last": {"date": "2022-07-22T03:03:09.292Z", "msg": "" }},
            {"drained": false, "last": {"date": "2022-06-22T03:03:09.292Z", "msg": "" }},
            {"drained": false, "last": {"date": "2022-06-26T03:03:09.292Z", "msg": "" }},
        ];

        this.expectedLogsList = [
            {"drained": false, "last": {"date": "2022-07-22T03:03:09.292Z", "msg": "" }},
            {"drained": false, "last": {"date": "2022-07-03T03:03:09.292Z", "msg": "" }},
            {"drained": false, "last": {"date": "2022-06-26T03:03:09.292Z", "msg": "" }},
            {"drained": false, "last": {"date": "2022-06-24T03:03:09.292Z", "msg": "" }},
            {"drained": false, "last": {"date": "2022-06-22T03:03:09.292Z", "msg": "" }},
        ]
        this.duplicatedLog = {"drained": false, "last": {"date": "2022-07-22T03:03:09.292Z", "msg": "" }};
        this.newLog = {"drained": false, "last": {"date": "2022-02-22T03:03:09.292Z", "msg": "" }};
    });

    test('it should validate that each log have a valid Log', () => {
        try {
            validateLogData(this.expectedLogsList);
            expect(true).toBeTruthy();
        } catch (e) {
            expect(true).toBeFalsy();
        }
    });

    test('should sort by date', async () => {
        expect(this.unorderedLogsList.map(sorAsc)).toBe(this.expectedLogsList);
    });

    test('it should merge first item in a new list', () => {
       const newList = [];
       const resp = mergeLog(newList, this.duplicatedLog, 0, 0.5, 1);
       expect(resp).toBe([this.duplicatedLog]);
    });

    test('should merge and sorted a list log', async () => {
        const mid = Math.floor(this.unsortedLogsOfTwo.length / 2)
        const resp = mergeLog(this.unsortedLogsOfTwo, this.duplicatedLog, 0, mid, this.unsortedLogsOfTwo.length);
        expect(resp).toBe([...this.unsortedLogsOfTwo, ...[this.duplicatedLog]]);
    });

    test('should merge an sorted a list adding new log item', () => {
        const mid = Math.floor(this.unorderedLogsList.length / 2);
        const resp = mergeLog(this.unorderedLogsList, this.newLog, 0, mid, this.unorderedList.length);
        expect(resp).toBe([...this.expectedLogsList, ...[this.newLog]]);
    });
});
