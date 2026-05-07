import { Component, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SiteConfig } from '../../content.config';

@Component({
  selector: 'app-splash-screen',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './splash-screen.html',
  styleUrls: ['./splash-screen.scss'],
})
export class SplashScreenComponent implements OnInit {
  @Output() loaded = new EventEmitter<void>();
  isFadingOut = false;
  isLoading = true;
  showPasswordGate = false;
  passwordInput = '';
  isError = false;

  get hookConfig() {
    return SiteConfig.hook;
  }

  constructor(private cdr: ChangeDetectorRef) { }

  async ngOnInit() {
    console.log('Splash screen started preloading...');

    // Ensure the cute heartbeat is visible for at least 1.5s
    const minimumDelay = new Promise(resolve => setTimeout(resolve, 1500));

    // Wait for custom fonts to finish loading
    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();

    // Preload important images
    const imagesToLoad = [
      ...SiteConfig.memoryLane.map((m: any) => `assets/images/${m.imagePath}`),
      `assets/images/${SiteConfig.climax.polaroidImage}`
    ];

    // Start downloading images in the background, but DON'T block the UI for them!
    // This allows the splash screen to exit quickly, and images will finish loading 
    // while the user is reading the initial Hook & Reveal messages.
    imagesToLoad.forEach(src => {
      const img = new Image();
      img.src = src;
    });

    try {
      await Promise.all([
        minimumDelay,
        fontsReady
      ]);
    } catch (e) {
      console.warn('Preload encountered an error, proceeding anyway', e);
    }

    console.log('Preloading complete.');

    // 如果有設定密碼，切換至密碼輸入狀態
    if (SiteConfig.global && SiteConfig.global.password) {
      this.isLoading = false;
      this.showPasswordGate = true;
      this.cdr.detectChanges(); // 強制觸發畫面更新 (因原生 Promise 可能脫離 NgZone)
    } else {
      // 若無密碼，直接通行
      this.finishSplash();
    }
  }

  verifyPassword(event: Event) {
    event.preventDefault();
    if (this.passwordInput === SiteConfig.global.password) {
      this.finishSplash();
    } else {
      // 密碼錯誤：先重置狀態以確保每次都能重發震動動畫
      this.isError = false;
      this.cdr.detectChanges();

      setTimeout(() => {
        this.isError = true;
        this.passwordInput = '';
        this.cdr.detectChanges();
      }, 50); // 稍微加長一點 delay 確保 DOM 有足夠時間拔除 class 再加回來
    }
  }

  finishSplash() {
    this.isFadingOut = true;
    setTimeout(() => {
      this.loaded.emit();
    }, 600); // Wait for the fade-out CSS animation to finish
  }
}
