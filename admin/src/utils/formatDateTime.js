export const formatDateTime = (isoString) => {
    try {
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(isoString));
    } catch (e) {
        console.log(e);
        return isoString;
    }
};