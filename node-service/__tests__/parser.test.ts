import { parseFile } from '../src/Utils/parser';

jest.mock('../src/Common/Config/config', () => ({
    __esModule: true,
    default: {
        keywords: 'ERROR,WARN'
    }
}));

describe('parseFile', () => {
    const createMockLines = async function* (lines: string[]) {
        for (const line of lines) {
            yield line;
        }
    };

    it('should parse stats, IPs, and errors from valid log lines', async () => {
        const mockLines = createMockLines([
            '[2024-04-01T10:00:00Z] INFO Server started',
            '[2024-04-01T10:01:00Z] ERROR Something failed { "ip": "192.168.0.1" }',
            '[2024-04-01T10:02:00Z] WARN Warning issued { "ip": "10.0.0.1" }',
            '[2024-04-01T10:03:00Z] DEBUG Debug message'
        ]);

        const result = await parseFile(mockLines);

        expect(result.stats.get('INFO')).toBe(1);
        expect(result.stats.get('ERROR')).toBe(1);
        expect(result.stats.get('WARN')).toBe(1);
        expect(result.stats.get('DEBUG')).toBe(1);

        expect(result.ipAddresses.has('192.168.0.1')).toBe(true);
        expect(result.ipAddresses.has('10.0.0.1')).toBe(true);

        expect(result.errors).toHaveLength(2);
        expect(result.errors[0].level).toBe('ERROR');
        expect(result.errors[1].level).toBe('WARN');
    });

    it('should skip invalid log lines', async () => {
        const mockLines = createMockLines([
            'Invalid line without timestamp or level',
            '[2024-04-01T10:00:00Z] ERROR Valid line { "ip": "127.0.0.1" }'
        ]);

        const result = await parseFile(mockLines);
        expect(result.stats.get('ERROR')).toBe(1);
        expect(result.errors).toHaveLength(1);
        expect(result.ipAddresses.has('127.0.0.1')).toBe(true);
    });

    it('should handle malformed JSON gracefully', async () => {
        const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => { });
        const mockLines = createMockLines([
            '[2024-04-01T10:00:00Z] ERROR Broken JSON { "ip": "192.168.0.1", }'
        ]);

        const result = await parseFile(mockLines);

        expect(result.stats.get('ERROR')).toBe(1);
        expect(result.errors[0].ip).toBe(null);
        expect(warnSpy).toHaveBeenCalled();

        warnSpy.mockRestore();
    });

    it('should not add error if level not in config.keywords', async () => {
        const mockLines = createMockLines([
            '[2024-04-01T10:00:00Z] INFO Just info { "ip": "192.168.1.1" }'
        ]);

        const result = await parseFile(mockLines);

        expect(result.stats.get('INFO')).toBe(1);
        expect(result.errors).toHaveLength(0);
        expect(result.ipAddresses.has('192.168.1.1')).toBe(true);
    });
});
