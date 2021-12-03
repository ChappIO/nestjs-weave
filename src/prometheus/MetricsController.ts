import { Controller, Get, Response } from '@nestjs/common';
import { Registry } from 'prom-client';
import { Response as ExpressResponse } from 'express';
import {ConfigService} from "@nestjs/config";

@Controller()
@Reflect.metadata("swagger/apiUseTags", ["Internal"])
export class MetricsController {
  public constructor(private readonly register: Registry, private readonly config: ConfigService) {
    Reflect.defineMetadata("path", config.get("internal.metrics.path"), MetricsController)
  }

  @Get()
  public async getMetrics(
    @Response() response: ExpressResponse,
  ): Promise<void> {
    response.set('Content-Type', this.register.contentType);
    response.send(await this.register.metrics());
  }
}
