import { ACCESS_TOKEN } from './Constant';

const request = async (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    });

    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN));
    }

    const defaults = { headers: headers };
    options = { ...defaults, ...options };

    try {
        const response = await fetch(options.url, options);
        const contentType = response.headers.get("content-type");
        
        if (contentType && contentType.indexOf("application/json") !== -1) {
            const json = await response.json();
            if (!response.ok) {
                throw json;   
            }
            return json;
        } else {
            const text = await response.text();
            if (!response.ok) {
                throw text;
            }
            return text;
        }
    } catch (error) {
        return Promise.reject(error);
    }
};

export default request;
