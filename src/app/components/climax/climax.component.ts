import { Component, OnInit, Output, EventEmitter, Inject, PLATFORM_ID, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SiteConfig } from '../../content.config';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-climax',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './climax.component.html',
  styleUrls: ['./climax.component.scss']
})
export class ClimaxComponent implements OnInit, AfterViewInit {
  @Output() replay = new EventEmitter<void>();
  @ViewChild('confettiCanvas') confettiCanvas!: ElementRef<HTMLCanvasElement>;
  myConfetti: any;
  config = SiteConfig.climax;
  isModalOpen = false;
  hasSeenModal = false;
  isFlipped = false;
  fireflies: { left: number, animationDuration: number, animationDelay: number, size: number }[] = [];
  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit() {
    // Generate random romantic fireflies
    for (let i = 0; i < 30; i++) {
      this.fireflies.push({
        left: Math.random() * 100,
        animationDuration: 10 + Math.random() * 20,
        animationDelay: Math.random() * 15,
        size: 3 + Math.random() * 4
      });
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId) && this.confettiCanvas) {
      // Create a persistent custom instance to prevent DOM DOM reflow latency on click
      this.myConfetti = confetti.create(this.confettiCanvas.nativeElement, {
        resize: true,
        useWorker: true
      });
    }
  }

  openModal() {
    this.isModalOpen = true;
    this.isFlipped = false;
  }

  flipCard() {
    if (this.isFlipped || !isPlatformBrowser(this.platformId)) return;
    this.isFlipped = true;

    // Trigger VIP micro-confetti upon flipping
    // Multiple bursts for extra "Wow" factor
    const count = 200;
    const defaults = {
      origin: { y: 0.5 },
      zIndex: 10000,
      colors: ['#BF953F', '#FCF6BA', '#B38728', '#FBF5B7', '#ffffff']
    };

    const fire = (particleRatio: number, opts: any) => {
      if (this.myConfetti) {
        this.myConfetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio)
        });
      }
    };

    setTimeout(() => {
      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });
      fire(0.2, {
        spread: 60,
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    }, 400); // Trigger mid-flip
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.parentElement?.classList.add('fallback-state');
  }

  closeModal() {
    this.isModalOpen = false;
    this.hasSeenModal = true;
  }
}
