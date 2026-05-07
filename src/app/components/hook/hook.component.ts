import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteConfig } from '../../content.config';

@Component({
  selector: 'app-hook',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hook.component.html',
  styleUrls: ['./hook.component.scss']
})
export class HookComponent {
  config = SiteConfig.hook;
  
  @Output() unlock = new EventEmitter<void>();
  isOpening = false;

  openGift() {
    this.isOpening = true;
    setTimeout(() => {
      this.unlock.emit();
    }, 1000); // Wait for transition
  }
}
