const parseDate = (post: any): number => {
    if (post.date instanceof Date) {
        return post.date.getTime();
    }

    if (typeof post.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(post.date)) {
        const [year, month, day] = post.date.split('-').map(Number);
        return new Date(year, month - 1, day, parseHour(post.hour), parseMinutes(post.hour)).getTime();
    }

    if (typeof post.date === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(post.date)) {
        const [day, month, year] = post.date.split('/').map(Number);
        return new Date(year, month - 1, day, parseHour(post.hour), parseMinutes(post.hour)).getTime();
    }

    if (typeof post.date === 'number') {
        return post.date;
    }

    return 0;
}

const parseHour = (hour: any): number => {
    if (typeof hour === 'string' && hour.includes(':')) {
        return Number(hour.split(':')[0]);
    }

    return 0;
}

const parseMinutes = (hour: any): number => {
    if (typeof hour === 'string' && hour.includes(':')) {
        return Number(hour.split(':')[1]);
    }

    return 0;
}

export { parseDate, parseHour, parseMinutes };