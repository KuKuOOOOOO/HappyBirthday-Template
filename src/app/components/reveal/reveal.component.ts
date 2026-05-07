import { Component, Output, EventEmitter, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SiteConfig } from '../../content.config';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-reveal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reveal.component.html',
  styleUrls: ['./reveal.component.scss']
})
export class RevealComponent implements OnInit {
  config = SiteConfig.reveal;
  @Output() next = new EventEmitter<void>();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.fireConfetti();
    }
  }

  fireConfetti() {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#91A8A4', '#D8E2DC', '#FAF9F6']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#91A8A4', '#D8E2DC', '#FAF9F6']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }

  goNext() {
    this.next.emit();
  }
}
