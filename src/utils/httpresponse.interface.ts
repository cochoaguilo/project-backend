export interface HttpResponse {
    status: 'success' | 'error';
    success: boolean;
    data?: any;
}
