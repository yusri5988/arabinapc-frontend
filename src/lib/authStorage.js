const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export function getToken() {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token || token === 'undefined' || token === 'null') {
        localStorage.removeItem(TOKEN_KEY);
        return null;
    }

    return token;
}

export function getUser() {
    const savedUser = localStorage.getItem(USER_KEY);

    if (!savedUser) return null;

    try {
        return JSON.parse(savedUser);
    } catch {
        clearAuth();
        return null;
    }
}

export function setAuth(token, user) {
    if (!token || token === 'undefined' || token === 'null' || !user) {
        clearAuth();
        throw new Error('Invalid login response.');
    }

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function setStoredUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

export function hasAuth() {
    return Boolean(getToken() && getUser());
}
