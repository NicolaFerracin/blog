const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

exports.prettifyDate = (rawDate) => {
    const date = new Date(rawDate);
    return `${date.getDate()} ${months[date.getMonth()].substring(0, 3)} ${date.getFullYear()}`;
};

exports.isFutureDate = (date) => {
    const now = new Date();
    const toCompare = new Date(date);
    return toCompare > now;
};
