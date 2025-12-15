import { json } from '@sveltejs/kit';
import { emby } from '$lib/server/emby';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
    const username = url.searchParams.get('username');

    if (!username) {
        return json({ valid: false, error: 'Username is required' }, { status: 400 });
    }

    try {
        const user = await emby.findUserByName(username.trim());

        if (user) {
            return json({
                valid: true,
                userId: user.Id,
                username: user.Name
            });
        } else {
            return json({
                valid: false,
                error: 'User not found on this server'
            });
        }
    } catch (error) {
        console.error('Error validating user:', error);
        return json({
            valid: false,
            error: 'Failed to connect to Emby server'
        }, { status: 500 });
    }
};
