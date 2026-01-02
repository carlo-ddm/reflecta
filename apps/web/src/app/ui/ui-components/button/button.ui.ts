import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

type ButtonVariant = 'primary' | 'secondary';

export type ButtonConfig = {
  text: string;
  type?: 'button' | 'submit';
  variant?: ButtonVariant;
  disabled?: boolean;
};

@Component({
  selector: 'app-button',
  templateUrl: './button.ui.html',
  styleUrls: ['./button.ui.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonUi {
  config = input.required<ButtonConfig>();
  clicked = output<void>();

  protected readonly classes = computed(() => {
    const cfg = this.config();
    const variant = cfg.variant ?? 'primary';
    return ['ui-button', `ui-button--${variant}`];
  });

  protected readonly type = computed(() => this.config().type ?? 'button');

  onClick() {
    this.clicked.emit();
  }
}
