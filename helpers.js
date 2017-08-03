const moment = require('moment');

exports.moment = moment;

exports.dump = (obj) => JSON.stringify(obj, null, 2);

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

exports.prettifyDate = (rawDate) => {
    const date = new Date(rawDate);
    return `${date.getDate()} ${months[date.getMonth()].substring(0, 3)} ${date.getFullYear()}`;
};

