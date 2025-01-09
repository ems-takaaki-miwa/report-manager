export const getCurrentYearMonth = () => {
	const now = new Date();
	return {
		year: now.getFullYear(),
		month: now.getMonth() + 1,
	};
};

export const getPrevMonth = (year: number, month: number) => {
	if (month === 1) {
		return {
			year: year - 1,
			month: 12,
		};
	}
	return {
		year,
		month: month - 1,
	};
};

export const getNextMonth = (year: number, month: number) => {
	if (month === 12) {
		return {
			year: year + 1,
			month: 1,
		};
	}
	return {
		year,
		month: month + 1,
	};
};

export const formatYearMonth = (year: number, month: number) => {
	return `${year}年${month}月`;
};

export function getDaysInMonth(year: number, month: number): number {
	return new Date(year, month, 0).getDate();
}
