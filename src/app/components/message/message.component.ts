import { Component, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectorRef, ViewChildren, QueryList, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteConfig } from '../../content.config';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit, OnDestroy {
  config = SiteConfig.message;
  @Output() next = new EventEmitter<void>();

  @ViewChildren('paragraphEl') paragraphEls!: QueryList<ElementRef>;

  renderedParagraphs: string[] = [];
  isTypingFinished = false;
  currentParagraphIndex = 0;
  
  private currentCharIndex = 0;
  leaves: any[] = [];
  private typeInterval: any;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // Generate random falling leaves
    for (let i = 0; i < 15; i++) {
      this.leaves.push({
        left: Math.random() * 100 + 'vw',
        animationDelay: Math.random() * 5 + 's',
        animationDuration: (Math.random() * 10 + 10) + 's', // Slower fall (10-20s)
        opacity: Math.random() * 0.15 + 0.05, // Very subtle opacity (0.05 to 0.2)
        scale: Math.random() * 0.5 + 0.5
      });
    }

    // Initialize the array with empty strings
    for (let i = 0; i < this.config.paragraphs.length; i++) {
      this.renderedParagraphs.push('');
    }
    this.typeWriter();
  }

  ngOnDestroy() {
    if (this.typeInterval) {
      clearInterval(this.typeInterval);
    }
  }

  typeWriter() {
    this.typeInterval = setInterval(() => {
      const pIndex = this.currentParagraphIndex;
      
      // Safety check if config is empty
      if (this.config.paragraphs.length === 0) {
        this.isTypingFinished = true;
        clearInterval(this.typeInterval);
        return;
      }
      
      const originalText = this.config.paragraphs[pIndex];

      if (this.currentCharIndex < originalText.length) {
        // 直接異動並手動觸發偵測
        this.renderedParagraphs[pIndex] += originalText.charAt(this.currentCharIndex);
        this.cdr.detectChanges(); // 強制刷新畫面
        this.currentCharIndex++;

        // 每隔 15 個字自動滾動到目前段落，避免手機用戶看不到新文字
        if (this.currentCharIndex % 15 === 0) {
          this.scrollToCurrentParagraph();
        }
      } else {
        // Move to next paragraph
        this.currentParagraphIndex++;
        this.currentCharIndex = 0;
        this.scrollToCurrentParagraph();

        if (this.currentParagraphIndex >= this.config.paragraphs.length) {
          // Finished typing all paragraphs
          this.isTypingFinished = true;
          this.cdr.detectChanges(); // 強制刷新按鈕與簽名
          clearInterval(this.typeInterval);

          // 打完後滾動到簽名與按鈕區域
          setTimeout(() => this.scrollToCurrentParagraph(), 600);
        }
      }
    }, 50); // 50ms per character delay
  }

  /** 平滑滾動到目前正在打字的段落 */
  private scrollToCurrentParagraph() {
    const els = this.paragraphEls?.toArray();
    if (!els || els.length === 0) return;
    const target = els[Math.min(this.currentParagraphIndex, els.length - 1)];
    target?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  goNext() {
    this.next.emit();
  }
}
