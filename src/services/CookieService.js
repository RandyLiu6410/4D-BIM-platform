import Cookies from 'universal-cookie';
const cookies = new Cookies();

class CookieService {
    get(key) {
        return cookies.get(key);
    }

    set(key, value, options) {
        cookies.set(key, value, options);
    }

    remove(key, options) {
        cookies.remove(key, options);
    }

    test(key) {
        console.log(key)
    }
}

export default CookieService;