import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()

export class BaseInterceptor implements HttpInterceptor {
    constructor(@Inject('API_BASE_URL') private baseUrl: string) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (request.url.includes('flood-zones')) {
            return next.handle(request);
        }
        const apiRequest = request.clone({url: `${this.baseUrl}/${request.url}`});
        return next.handle(apiRequest);
    }
}