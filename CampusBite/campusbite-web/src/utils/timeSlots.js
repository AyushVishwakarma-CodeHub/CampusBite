export const generateTimeSlots = () => {
    const slots = [];
    const startHour = 10; // 10 AM
    const endHour = 18; // 6 PM

    for (let h = startHour; h <= endHour; h++) {
        for (let m = 0; m < 60; m += 10) {
            const period = h >= 12 ? 'PM' : 'AM';
            let displayH = h > 12 ? h - 12 : h;
            let nextM = m + 10;
            let nextH = h;

            if (nextM === 60) {
                nextM = 0;
                nextH += 1;
            }

            const nextPeriod = nextH >= 12 ? 'PM' : 'AM';
            let nextDisplayH = nextH > 12 ? nextH - 12 : nextH;

            const formatTime = (hour, min) => `${hour}:${min === 0 ? '00' : min}`;

            slots.push(`${formatTime(displayH, m)} ${period} - ${formatTime(nextDisplayH, nextM)} ${nextPeriod}`);
        }
    }
    return slots;
};
