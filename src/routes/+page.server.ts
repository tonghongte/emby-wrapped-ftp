import type { PageServerLoad } from './$types';
import { getAvailableTimeRanges } from '$lib/server/stats';

export const load: PageServerLoad = async () => {
    return {
        timeRangeOptions: getAvailableTimeRanges()
    };
};
