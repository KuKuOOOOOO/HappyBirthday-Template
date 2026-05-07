import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SplashScreenComponent } from './components/splash-screen/splash-screen';
import { HookComponent } from './components/hook/hook.component';
import { RevealComponent } from './components/reveal/reveal.component';
import { MemoryLaneComponent } from './components/memory-lane/memory-lane.component';
import { MessageComponent } from './components/message/message.component';
import { ClimaxComponent } from './components/climax/climax.component';
import { SiteConfig } from './content.config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SplashScreenComponent, HookComponent, RevealComponent, MemoryLaneComponent, MessageComponent, ClimaxComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  currentStep = 0; // B7: Start at Splash Screen
  @ViewChild('bgmPlayer') bgmPlayer!: ElementRef<HTMLAudioElement>;
  
  bgmPath = 'assets/audio/' + SiteConfig.music.bgmPath;
  isMuted = false;
  isPlaying = false;

  ngAfterViewInit() {
    if (this.bgmPlayer) {
      this.bgmPlayer.nativeElement.volume = SiteConfig.music.volume || 0.4;
    }
  }

  onAssetsLoaded() {
    if (SiteConfig.global && SiteConfig.global.password) {
      // 如果有密碼，代表使用者在 SplashScreen 已經進行了按鈕點擊 (User Gesture)
      // 可以直接跳過 Step 1 (信封)，進入 Step 2 (驚喜破題) 並開始播放音樂！
      this.currentStep = 2;
      this.playBgm();
    } else {
      this.currentStep = 1; // Proceed to Hook (Envelope)
    }
  }

  playBgm() {
    if (this.bgmPlayer && !this.isPlaying) {
      this.bgmPlayer.nativeElement.play().then(() => {
        this.isPlaying = true;
      }).catch(err => {
        console.warn('Autoplay prevented by browser:', err);
      });
    }
  }

  toggleMute() {
    if (this.bgmPlayer) {
      this.isMuted = !this.isMuted;
      this.bgmPlayer.nativeElement.muted = this.isMuted;
      // If user toggles music before unlock, force play it
      if (!this.isPlaying && !this.isMuted) {
        this.playBgm();
      }
    }
  }

  onUnlock() {
    // 進入 Section 2 並且開始播放音樂
    this.currentStep = 2;
    this.playBgm();
  }

  onNextStep() {
    this.currentStep = 3;
  }

  onNextToMessage() {
    this.currentStep = 4;
  }

  onNextToClimax() {
    this.currentStep = 5;
  }

  onReplay() {
    this.currentStep = 1;
  }
}
