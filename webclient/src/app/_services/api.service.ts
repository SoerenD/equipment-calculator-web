import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { toHttpParams } from '../_util/http';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    constructor(private http: HttpClient) {}

    get<T>(url: string, data: Record<string, unknown> = {}): Observable<T> {
        const params = toHttpParams(data);
        return this.http.get<T>(environment.apiEndpoint + url, { params });
        // Remove the old error handling - let the calling service handle errors properly
    }
}
