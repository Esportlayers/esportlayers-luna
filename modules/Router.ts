export default function getWebsocketUrl(): string {
    const url = process.env.API_URL;
    if(url && url.length > 0) {
        const protocol = url.substring(0, url.indexOf('://'));
        const rawUrl = url.substring(protocol.length + 3);
        if(protocol === 'https') {
            return 'wss://' + rawUrl;
        }
        return 'ws://' + rawUrl;
    }

    return '';
}