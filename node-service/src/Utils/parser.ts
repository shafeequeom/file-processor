import config from "../Common/Config/config";

type Stats = {
    ipAddresses: Set<string>,
    errors: Array<{ level: string, message: string, jsonPayload: any, ip: string | null }>,
    stats: Map<string, number>,
}

export const parseFile = async (lines: any): Promise<Stats> => {

    const keywords = config.keywords.split(',') || ['ERROR'];
    const stats = {
        ipAddresses: new Set<string>(),
        errors: Array<{ level: string, message: string, jsonPayload: any, ip: string | null }>(),
        stats: new Map<string, number>(),
    };

    for await (const line of lines) {
        // Match: [timestamp] LEVEL message {optional JSON}
        const logMatch = line.match(/^\[(.*?)\]\s+(\w+)\s+(.*?)(\s+({.*}))?$/);

        if (!logMatch) continue;

        const [, , level, message, , jsonStr] = logMatch;

        // 🔍 Parse optional JSON payload
        let jsonPayload: any = null;
        if (jsonStr) {
            try {
                jsonPayload = JSON.parse(jsonStr);
            } catch {
                console.warn('⚠️ Invalid JSON payload in log line');
            }
        }

        stats.stats.set(level, (stats.stats.get(level) || 0) + 1);
        if (jsonPayload?.ip) {
            stats.ipAddresses.add(jsonPayload.ip);
        }

        if (keywords.includes(level)) {
            const data = {
                level,
                message,
                jsonPayload,
                ip: jsonPayload?.ip || null,
            }
            stats.errors.push(data);
        }

    }

    return stats;

}