import MOCKDATA from '../MOCK_DATA.json'

export const getTransactions = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(MOCKDATA);
        }, 500);
    })
}