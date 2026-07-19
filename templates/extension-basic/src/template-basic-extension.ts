import { BaseExtension } from '@glimmer-cradle/extension-sdk';
import { TemplateBasicConfigSchema, type TemplateBasicConfig } from '../config/schema';

export class TemplateBasicExtension extends BaseExtension<TemplateBasicConfig> {
  public constructor() {
    super(TemplateBasicConfigSchema);
  }

  protected override async activate(): Promise<void> {
    await this.ctx.ports.runtime.reportDiagnostics({
      summary: this.config.enabled
        ? `template-basic active: ${this.config.greeting}`
        : 'template-basic disabled by config',
      entries: [],
      log_locations: [],
      recovery_actions: [],
    });
  }
}
