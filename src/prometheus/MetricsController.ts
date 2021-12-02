import { Controller, Get, Response } from '@nestjs/common';
import { Registry } from 'prom-client';
import { Response as ExpressResponse } from 'express';

@Controller('internal')
export class MetricsController {
  public constructor(private readonly register: Registry) {}

  @Get('metrics')
  public async getMetrics(
    @Response() response: ExpressResponse,
  ): Promise<void> {
    response.set('Content-Type', this.register.contentType);
    response.send(await this.register.metrics());
  }
}
