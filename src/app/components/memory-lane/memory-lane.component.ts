import { Component, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteConfig } from '../../content.config';

@Component({
  selector: 'app-memory-lane',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './memory-lane.component.html',
  styleUrls: ['./memory-lane.component.scss']
})
export class MemoryLaneComponent implements AfterViewInit {
  config = SiteConfig.memoryLane;
  @Output() next = new EventEmitter<void>();
  @ViewChild('carousel') carouselRef!: ElementRef<HTMLDivElement>;

  /** Random tilt angles for each card (-3° to +3°) */
  cardTilts: number[] = [];

  constructor() {
    // Generate random tilt for each memory card
    this.cardTilts = SiteConfig.memoryLane.map(() => 
      (Math.random() - 0.5) * 6 // Range: -3 to +3 degrees
    );
  }

  private isDragging = false;
  private startX = 0;
  private scrollStart = 0;
  private lastX = 0;
  private velocity = 0;
  private lastTime = 0;
  private momentumId = 0;

  ngAfterViewInit() {
    const el = this.carouselRef.nativeElement;

    // Sprint B5: Auto-hint wobble to show it's scrollable
    setTimeout(() => {
      // Only wobble if user hasn't already scrolled or dragged
      if (el.scrollLeft === 0 && !this.isDragging) {
        el.scrollTo({ left: 80, behavior: 'smooth' }); // nudge right
        
        // Bounce back left
        setTimeout(() => {
          if (!this.isDragging) el.scrollTo({ left: 0, behavior: 'smooth' });
        }, 350);
      }
    }, 1200); // Trigger right after the 1.2s entrance animation finishes

    el.addEventListener('mousedown', (e: MouseEvent) => {
      // Stop any ongoing momentum
      cancelAnimationFrame(this.momentumId);

      this.isDragging = true;
      this.startX = e.pageX;
      this.lastX = e.pageX;
      this.scrollStart = el.scrollLeft;
      this.velocity = 0;
      this.lastTime = Date.now();
      el.classList.add('dragging');
    });

    el.addEventListener('mousemove', (e: MouseEvent) => {
      if (!this.isDragging) return;
      e.preventDefault();

      const now = Date.now();
      const dx = e.pageX - this.lastX;
      const dt = now - this.lastTime;

      // Track velocity (pixels per ms)
      if (dt > 0) {
        this.velocity = dx / dt;
      }

      this.lastX = e.pageX;
      this.lastTime = now;

      // Instant scroll
      el.scrollLeft = this.scrollStart - (e.pageX - this.startX);
    });

    const stopDrag = () => {
      if (!this.isDragging) return;
      this.isDragging = false;

      // Apply momentum with deceleration
      const startVelocity = this.velocity * 15; // Scale up for natural feel
      let v = startVelocity;
      const friction = 0.95;

      const coast = () => {
        if (Math.abs(v) < 0.5) {
          // Momentum done, re-enable snap with delay
          setTimeout(() => {
            el.classList.remove('dragging');
          }, 50);
          return;
        }
        el.scrollLeft -= v;
        v *= friction;
        this.momentumId = requestAnimationFrame(coast);
      };

      if (Math.abs(startVelocity) > 2) {
        coast();
      } else {
        // No significant velocity, just re-enable snap
        setTimeout(() => {
          el.classList.remove('dragging');
        }, 50);
      }
    };

    el.addEventListener('mouseup', stopDrag);
    el.addEventListener('mouseleave', stopDrag);
  }

  // Image fallback handler
  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.style.display = 'none';
    target.parentElement?.classList.add('fallback-state');
  }

  goNext() {
    this.next.emit();
  }
}
