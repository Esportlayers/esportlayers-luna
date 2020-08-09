import fetch from 'isomorphic-unfetch';

type Type = 'text' | 'json';

const methodMap = {
    GET: 'Requesting',
    PATCH: 'Patching',
    POST: 'Creating',
    DELETE: 'Deleting',
}

export async function query<T>(url: string, method: string, type: Type = 'json', init?: RequestInit): Promise<T> {
    const strMethod = methodMap[method];

    try {
        console.log('%c '+strMethod+' ressource' + '%c :: ' + url, 'color: #00A', 'color: #000');
        const start = new Date().valueOf();
        const response = await fetch(process.env.API_URL + url, {method, ...init});
        const time = new Date().valueOf() - start;
        if(response.ok) {
            const data = type === 'json' ? await response.json() : await response.text();
            if(data) {
                console.log('%c Received ressource' + '%c :: %c' + response.status + '%c' + time + 'ms' + '%c :: ' + url, 'color: #0A0', 'color: #000', 'background-color:#0A0;color:#FFF;font-weight:bold;padding:2px 5px;border-radius:2px;', 'margin-left:5px;background-color:#555;color:#FFF;font-weight:bold;padding:2px 5px;border-radius:2px;', 'color: #000');
            } else {
                console.log('%c Finished request' + '%c :: %c' + response.status + '%c' + time + 'ms' + '%c :: ' + url, 'color: #0A0', 'color: #000', 'background-color:#0A0;color:#FFF;font-weight:bold;padding:2px 5px;border-radius:2px;', 'margin-left:5px;background-color:#555;color:#FFF;font-weight:bold;padding:2px 5px;border-radius:2px;', 'color: #000');
            }
            return data;
        } else if (response.status === 401) {
            console.log('%c Unauthorized' + '%c :: %c' + response.status + '%c' + time + 'ms'  + '%c :: ' + url, 'color: #A00', 'color: #000', 'background-color:#A00;color:#FFF;font-weight:bold;padding:2px 5px;border-radius:2px;', 'margin-left:5px;background-color:#555;color:#FFF;font-weight:bold;padding:2px 5px;border-radius:2px;', 'color: #000');
        } else {
            console.log('%c Failed request' + '%c :: %c' + response.status + '%c' + time + 'ms'  + '%c :: ' + url, 'color: #A00', 'color: #000', 'background-color:#A00;color:#FFF;font-weight:bold;padding:2px 5px;border-radius:2px;', 'margin-left:5px;background-color:#555;color:#FFF;font-weight:bold;padding:2px 5px;border-radius:2px;', 'color: #000');
        }
    } catch(error) {
        console.log('%c Failed '+strMethod+' ressource' + '%c :: ' + url + ' - ', 'color: #A00', 'color: #000', error);
    }
}

export async function get<T>(url: string, type: Type = 'json', init?: RequestInit): Promise<T> {
    return query<T>(url, 'GET', type, init);
}

export async function patch<T>(url: string, data: object, type: Type = 'text', init?: RequestInit): Promise<T> {
    return query<T>(url, 'PATCH', type, {body: JSON.stringify(data), ...init});
}

export async function create<T>(url: string, data: object, init?: RequestInit): Promise<T> {
    return query<T>(url, 'POST', 'text', {body: JSON.stringify(data), ...init});
}

export async function del<T>(url: string, init?: RequestInit): Promise<T> {
    return query<T>(url, 'DELETE', 'text', init);
}