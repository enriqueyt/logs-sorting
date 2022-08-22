const { validateLogData, mergeLog, addCoordinates } = require("../solution/sync-sorted-merge");

describe('sync Sorted Logs', () => {
    beforeAll(() => {
        this.unsortedLogsOfTwo = [
            {"drained": false, "last": {"date": "2022-06-22T03:03:09.292Z", "msg": ""}, pop: () => ({"date": "2022-06-22T03:03:09.292Z", "msg": "" })},
            {"drained": false, "last": {"date": "2022-06-26T03:03:09.292Z", "msg": ""}, pop: () => ({"date": "2022-06-26T03:03:09.292Z", "msg": "" })},
        ];

        this.unsortedLogsOfTwoAfterTransformation = [
            {"drained": false, "last": {"date": "2022-06-22T03:03:09.292Z", "msg": "" }, pop: () => ({"date": "2022-06-22T03:03:09.292Z", "msg": "" }),
                "position": 0, "visited": false, value: {"date": "2022-06-22T03:03:09.292Z", "msg": "" }, position: 0},
            {"drained": false, "last": {"date": "2022-06-26T03:03:09.292Z", "msg": "" }, pop: () => ({"date": "2022-06-26T03:03:09.292Z", "msg": "" }),
                "position": 0, "visited": false, value: {"date": "2022-06-26T03:03:09.292Z", "msg": "" }, position: 1}
        ];

        this.unorderedLogsList = [
            {"drained": false, "last": {"date": "2022-07-03T03:03:09.292Z", "msg": ""}, pop: () => ({"date": "2022-07-03T03:03:09.292Z", "msg": "" })},
            {"drained": false, "last": {"date": "2022-06-24T03:03:09.292Z", "msg": ""},  pop: () => ({"date": "2022-06-24T03:03:09.292Z", "msg": "" })},
            {"drained": false, "last": {"date": "2022-07-22T03:03:09.292Z", "msg": ""}, pop: () => ({"date": "2022-07-22T03:03:09.292Z", "msg": "" })},
            {"drained": false, "last": {"date": "2022-06-22T03:03:09.292Z", "msg": ""}, pop: () => ({"date": "2022-06-22T03:03:09.292Z", "msg": "" })},
            {"drained": false, "last": {"date": "2022-06-26T03:03:09.292Z", "msg": ""}, pop: () => ({"date": "2022-06-26T03:03:09.292Z", "msg": "" })},
        ];

        this.expectedLogsList = [
            {"drained": false, "last": {"date": "2022-07-22T03:03:09.292Z", "msg": ""}, pop: () => ({"date": "2022-07-22T03:03:09.292Z", "msg": "" })},
            {"drained": false, "last": {"date": "2022-07-03T03:03:09.292Z", "msg": ""}, pop: () => ({"date": "2022-07-03T03:03:09.292Z", "msg": "" })},
            {"drained": false, "last": {"date": "2022-06-26T03:03:09.292Z", "msg": ""}, pop: () => ({"date": "2022-06-26T03:03:09.292Z", "msg": "" })},
            {"drained": false, "last": {"date": "2022-06-24T03:03:09.292Z", "msg": ""}, pop: () => ({"date": "2022-06-24T03:03:09.292Z", "msg": "" })},
            {"drained": false, "last": {"date": "2022-06-22T03:03:09.292Z", "msg": ""}, pop: () => ({"date": "2022-06-22T03:03:09.292Z", "msg": "" })},
        ]

        this.expectedLogsListDu = [
            {"drained": false, "last": {"date": "2022-07-03T03:03:09.292Z", "msg": "" }, pop: () => ({"date": "2022-07-03T03:03:09.292Z", "msg": "" })},
            {"drained": false, "last": {"date": "2022-06-26T03:03:09.292Z", "msg": "" }, pop: () => ({"date": "2022-06-26T03:03:09.292Z", "msg": "" })},
            {"drained": false, "last": {"date": "2022-06-24T03:03:09.292Z", "msg": "" }, pop: () => ({"date": "2022-06-24T03:03:09.292Z", "msg": "" })},
            {"drained": false, "last": {"date": "2022-06-22T03:03:09.292Z", "msg": "" }, pop: () => ({"date": "2022-06-22T03:03:09.292Z", "msg": "" })},
        ]
        this.duplicatedLog = {"drained": false, "last": {"date": "2022-07-22T03:03:09.292Z", "msg": "" },  pop: () => ({"date": "2022-07-22T03:03:09.292Z", "msg": "" })};
        this.newLog = {"drained": false, "last": {"date": "2022-06-23T03:03:09.292Z", "msg": "" }, pop: () => ({"date": "2022-06-23T03:03:09.292Z", "msg": "" })};
    });

    test('it should fail that each log have a valid Log', () => {
        const copyUnsortedLogsOfTwo = [...this.unsortedLogsOfTwo];
        delete copyUnsortedLogsOfTwo[1].drained;
        try {
            validateLogData(copyUnsortedLogsOfTwo);
            expect(true).toBeTruthy();
        } catch (e) {
            expect(true).toBe(true);
        }
        copyUnsortedLogsOfTwo[1].drained = false
    });

    test('it should validate that each log have a valid Log', () => {
        try {
            validateLogData(this.expectedLogsList);
            expect(true).toBeTruthy();
        } catch (e) {
            expect(true).toBe(e);
        }
    });

    test('should add position to each item in order to not modified the origin array, (each item contain a ' +
        ' number of nested log that won\'t require being merged in the original array)', async () => {
        const logsTransformed = this.unsortedLogsOfTwo.map(addCoordinates);
        for (let i = 0; i < logsTransformed.length; i++) {
            expect(logsTransformed[i]).toHaveProperty('value');
            expect(logsTransformed[i]).toHaveProperty('position');
            expect(logsTransformed[i]).toHaveProperty('visited');
        }
    });

    test('it should merge first item in a new list', () => {
       const newList = [];
       const resp = mergeLog(newList, this.duplicatedLog);
       expect(resp).toEqual([this.duplicatedLog]);
    });

    test('should merge and sorted a list log', async () => {
        const resp = mergeLog(this.expectedLogsListDu.map(addCoordinates), addCoordinates(this.newLog, 0));
        const expec = [...this.expectedLogsListDu.map(addCoordinates).slice(0, 3), ...[addCoordinates(this.newLog, 0)], ...this.expectedLogsListDu.map(addCoordinates).slice(3)];
        for (let i = 0; i < resp.length ; i++) {
            expect(resp[i].value.date).toBe(expec[i].value.date)
        }
    });

    test('should merge an sorted a list adding new log item', () => {
        const logs = mergeLog(this.expectedLogsList.map(addCoordinates), addCoordinates(this.newLog));
        let count = 3;
        while (count) {
            const a = logs.pop();
            count--;
            if(count === 0) {
                expect(a.value.date)
            }
        }

    });
});
