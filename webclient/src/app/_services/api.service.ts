import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';

import { toHttpParams } from '../_util/http';
import { environment } from '../../environments/environment';
import { ErrorType } from '../_types/error-type';
import { ElementMismatchError } from '../_types/element-mismatch-error';
import { InvalidItemCombinationError } from '../_types/invalid-item-combination-error';
import { ApiError } from '../_types/api-error';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    constructor(private http: HttpClient) {}

    get<T>(url: string, data: Record<string, unknown> = {}): Observable<T> {
        const params = toHttpParams(data);
        return this.http.get<T>(environment.apiEndpoint + url, { params }).pipe(
            catchError(({ error }: ApiError) => {
                if (error.message === ErrorType.ELEMENT_MISMATCH) {
                    throw new ElementMismatchError();
                } else if (error.message === ErrorType.INVALID_ITEM_COMBINATION) {
                    throw new InvalidItemCombinationError();
                }
                throw error;
            }),
        );
    }
}
