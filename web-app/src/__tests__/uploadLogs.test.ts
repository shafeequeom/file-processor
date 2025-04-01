// uploadLogs.test.ts
import handler from "@/pages/api/upload-logs";
import httpMocks from "node-mocks-http";
import { uploadToSupabase } from "@/lib/supabase";
import { logQueue } from "@/lib/queue";
import { IncomingMessage, ServerResponse } from "http";

// Mocks
jest.mock("formidable", () => {
    return {
        IncomingForm: jest.fn().mockImplementation(() => ({
            parse: jest.fn((req, cb) => {
                cb(null, {}, { file: [{ filepath: "mock/path/sample.log", size: 1024 }] });
            }),
        })),
    };
});

jest.mock("@supabase/ssr", () => ({
    createServerClient: jest.fn(() => ({
        auth: {
            getUser: jest.fn().mockResolvedValue({
                data: { user: { id: "user123" } },
                error: null,
            }),
        },
    })),
}));

jest.mock("@/lib/supabase", () => ({
    uploadToSupabase: jest.fn().mockResolvedValue({
        filePath: "mock/path/sample.log",
        fileId: "file123",
    }),
}));

jest.mock("@/lib/queue", () => ({
    logQueue: {
        add: jest.fn().mockResolvedValue({ id: "job123" }),
    },
}));

describe("upload-logs API", () => {
    it("uploads and enqueues job", async () => {
        const req = httpMocks.createRequest({
            method: "POST",
            headers: {
                "x-forwarded-for": "127.0.0.1",
            },
        });
        const res = httpMocks.createResponse();

        await handler(req as unknown as IncomingMessage, res as unknown as ServerResponse);
        const data = res._getJSONData();

        expect(res._getStatusCode()).toBe(200);
        expect(data).toEqual({
            status: true,
            data: { jobId: "job123" },
            message: "File uploaded successfully",
        });
    });

    it("returns 400 when no file uploaded", async () => {
        const formidable = await import("formidable");
        (formidable as any).IncomingForm.mockImplementationOnce(() => ({
            parse: jest.fn((_req: any, cb: any) => cb(null, {}, {})),
        }));

        const req = httpMocks.createRequest({ method: "POST" });
        const res = httpMocks.createResponse();

        await handler(req as unknown as IncomingMessage, res as unknown as ServerResponse);

        expect(res._getStatusCode()).toBe(400);
        expect(res._getData()).toMatch(/No file uploaded/);
    });

    it("returns 401 for unauthorized user", async () => {
        const { createServerClient } = await import("@supabase/ssr");
        (createServerClient as jest.Mock).mockReturnValueOnce({
            auth: {
                getUser: async () => ({ data: { user: null }, error: "Unauthorized" }),
            },
        });

        const req = httpMocks.createRequest({ method: "POST" });
        const res = httpMocks.createResponse();

        await handler(req as unknown as IncomingMessage, res as unknown as ServerResponse);

        expect(res._getStatusCode()).toBe(401);
    });

    it("returns 405 on GET method", async () => {
        const req = httpMocks.createRequest({ method: "GET" });
        const res = httpMocks.createResponse();

        await handler(req as unknown as IncomingMessage, res as unknown as ServerResponse);

        expect(res._getStatusCode()).toBe(405);
    });

    it("returns 500 on upload failure", async () => {
        const { uploadToSupabase } = await import("@/lib/supabase");
        (uploadToSupabase as jest.Mock).mockResolvedValueOnce(null);

        const req = httpMocks.createRequest({ method: "POST" });
        const res = httpMocks.createResponse();

        await handler(req as unknown as IncomingMessage, res as unknown as ServerResponse);

        expect(res._getStatusCode()).toBe(500);
        expect(res._getData()).toMatch(/Upload failed/);
    });
});


afterAll(() => {
    const { redisConnection } = require('@/lib/redis');
    const { pub, sub } = require('@/lib/redis');
    redisConnection.quit();
    pub.quit();
    sub.quit();
});