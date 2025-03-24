export class UploadService {

    async getUploads(query: any): Promise<{ data: []; pagination: { page: number; perPage: number; totalRecords: number; totalPages: number; }; }> {

        return { data: [], pagination: { page: 1, perPage: 10, totalRecords: 0, totalPages: 0 } };
    }


}