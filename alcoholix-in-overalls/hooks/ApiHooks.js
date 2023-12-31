import {useEffect, useState} from 'react';
import {apiUrl, appId} from '../utils/app-config';
import {doFetch} from '../utils/functions';
import {error} from '@babel/eslint-parser/lib/convert/index.cjs';

const useMedia = (update, userLikes) => {
    const [mediaArray, setMediaArray] = useState([]);
    const [loading, setLoading] = useState(false);

    const searchMedia = async (searchQuery, token) => {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token,
            },
            body: JSON.stringify(searchQuery),
        };

        const json = await doFetch(apiUrl + 'media/search', options);
        const mediaFiles = await Promise.all(
            json.map(async (item) => {
                return await doFetch(apiUrl + 'media/' + item.file_id);
            }),
        );
        setMediaArray(mediaFiles);
    };

    const loadMedia = async () => {
        try {
            // files with specific appId
            const json = await doFetch(apiUrl + 'tags/' + appId);
            const mediaFiles = await Promise.all(
                json.map(async (item) => {
                    return await doFetch(apiUrl + 'media/' + item.file_id);
                }),
            );
            setMediaArray(mediaFiles);
        } catch (error) {
            console.error('loadMedia failed', error);
        }
    };

    useEffect(() => {
        loadMedia();
    }, [update, userLikes]);


    const postMedia = async (mediaData, token) => {
        setLoading(true);
        try {
            const options = {
                method: 'POST',
                headers: {
                    'x-access-token': token,
                },
                body: mediaData,
            };
            return await doFetch(apiUrl + 'media', options);
        } catch (error) {
            throw new Error('postMedia failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteMedia = async (fileId, token) => {
        try {
            const options = {
                method: 'DELETE',
                headers: {
                    'x-access-token': token,
                },
            };
            return await doFetch(apiUrl + 'media/' + fileId, options);
        } catch (error) {
            alert('Voit poistaa vain omia postauksiasi!!');
            throw new Error('deleteMedia failed: Voit poistaa vain omia postauksiasi!!');

        }
    }

    return {mediaArray, postMedia, loading, searchMedia, loadMedia, deleteMedia};
};

const useAuthentication = () => {
    const postLogin = async (user) => {
        return await doFetch(apiUrl + 'login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });
    };

    return {postLogin};
};

const useUser = () => {
    const getUserByToken = async (token) => {
        const options = {
            method: 'GET',
            headers: {'x-access-token': token},
        };
        return await doFetch(apiUrl + 'users/user', options);
    };

    const postUser = async (userData) => {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        };
        return await doFetch(apiUrl + 'users', options);
    };

    const putUser = async (userData, token) => {
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token,
            },
            body: JSON.stringify(userData),
        };
        return await doFetch(apiUrl + 'users', options);
    };

    const checkUsername = async (username) => {
        try {
            const response = await doFetch(`${apiUrl}users/username/${username}`);
            return response.available;
        } catch {
            throw new Error('checkusername Error', error.message);
        }
    };

    const getUserById = async (id, token) => {
        const options = {
            method: 'GET',
            headers: {
                'x-access-token': token,
            },
        };
        return await doFetch(apiUrl + 'users/' + id, options);
    };

    return {getUserByToken, postUser, checkUsername, putUser, getUserById};
};

const useTag = () => {
    const postTag = async (tag, token) => {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token,
            },
            body: JSON.stringify(tag),
        };
        return await doFetch(apiUrl + 'tags', options);
    };

    const getFilesByTag = async (tag) => {
        try {
            return await doFetch(apiUrl + 'tags/' + tag);
        } catch (error) {
            throw new Error('getFilesByTag error', error.message);
        }
    };
    return {postTag, getFilesByTag};
};

const useFavourite = () => {
    const postFavourite = async (favourite, token) => {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token,
            },
            body: JSON.stringify(favourite),
        };
        return await doFetch(apiUrl + 'favourites', options);
    };

    const deleteFavourite = async (id, token) => {
        const options = {
            method: 'DELETE',
            headers: {
                'x-access-token': token,
            },
        };
        return await doFetch(apiUrl + 'favourites/file/' + id, options);
    };

    const getFavouritesById = async (id) => {
        return await doFetch(apiUrl + 'favourites/file/' + id);
    };

    const getFavouritesByToken = async (token) => {
        const options = {
            method: 'GET',
            headers: {
                'x-access-token': token,
            },
        };
        const json = await doFetch(apiUrl + 'favourites', options);

        return await Promise.all(
            json.map(async (item) => {
                return await doFetch(apiUrl + 'media/' + item.file_id);
            }),
        );
    };

    return {
        postFavourite,
        deleteFavourite,
        getFavouritesById,
        getFavouritesByToken,
    };
}

const useRating = () => {

    const postRating = async (rating, token) => {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token,
            },
            body: JSON.stringify(rating),
        };
        return await doFetch(apiUrl + 'ratings', options);
    };


    const getRatingsById = async (id, token) => {
        const options = {
            method: 'GET',
            headers: {
                'x-access-token': token,
            },
            body: JSON.stringify(token),
        };
        return await doFetch(apiUrl + 'ratings/file/' + id, options);
    };

    const getRatingsByToken = async (token) => {
        const options = {
            method: 'GET',
            headers: {
                'x-access-token': token,
            },
        };
        return await doFetch(apiUrl + 'ratings', options);
    };

    const deleteRating = async (id, token) => {
        const options = {
            method: 'DELETE',
            headers: {
                'x-access-token': token,
            },
        };
        return await doFetch(apiUrl + 'ratings/file/' + id, options);
    };

    return {
        postRating,
        getRatingsById,
        getRatingsByToken,
        deleteRating,
    };
};

export {useMedia, useAuthentication, useUser, useTag, useFavourite, useRating};
