import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { Histogram, Registry } from "prom-client";

@Injectable()
export class RequestMetricsCollector implements NestInterceptor {
  private readonly requestTimes: Histogram<string>;

  constructor(private readonly register: Registry) {
    this.requestTimes = new Histogram({
      registers: [register],
      name: "http_server_request_seconds",
      help: "Duration of all http requests",
      labelNames: ["method", "path", "status_code"]
    });
  }

  public intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const originalEnd = response.end.bind(response);
    const stopTimer = this.requestTimes.startTimer({
      method: request.method,
      path: request.route.path
    });
    response.end = (...params) => {
      originalEnd.call(response, ...params);
      stopTimer({
        status_code: response.statusCode
      });
    };
    return next.handle();
  }
}
