const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
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
