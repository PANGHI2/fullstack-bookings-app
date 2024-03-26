import { HttpParams } from '@angular/common/http';
import { KeyValueObject } from './types.utils';

export function createHttpParams(keyValueObject: KeyValueObject): HttpParams {
    return Object.keys(keyValueObject).reduce(
        (httpParams: HttpParams, key: string): HttpParams =>
            keyValueObject[key] !== null && keyValueObject[key] !== undefined
                ? httpParams.append(key, String(keyValueObject[key]))
                : httpParams,
        new HttpParams()
    );
}
