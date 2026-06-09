import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-intro-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div id="intro" aria-hidden="true">
      <div class="lg">
        <img src="assets/logo.jpeg" alt="Parallel Matrix MANAGEMENT SERVICES">
      </div>
      
      <h1 class="nm">
        <span *ngFor="let word of words; let wordIdx = index" class="word-group">
          <span *ngFor="let letter of word.letters"
                [style.animation-delay.s]="0.5 + (word.globalStartIdx + letter.idx) * 0.04">
            {{ letter.char }}
          </span>
        </span>
      </h1>
      
      <div class="tag">RECRUITMENT &middot; STAFFING &middot; IMMIGRATION &middot; MANPOWER</div>
    </div>
  `,
  styles: [`
    /* ===== Fixed & Word-Safe Intro Loader ===== */
    #intro {
      position: fixed;
      inset: 0;
      background: var(--pm-grad, linear-gradient(135deg, #0a1f44 0%, #1857c4 100%));
      z-index: 9998;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 24px;
      padding: 0 24px;
      text-align: center;
      box-sizing: border-box;
      animation: introOut .8s ease 2.8s forwards;
    }

    #intro .lg {
      width: clamp(90px, 15vw, 120px);
      height: clamp(90px, 15vw, 120px);
      border-radius: 20px;
      background: #fff;
      padding: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: pop .7s cubic-bezier(.2,1.6,.4,1) both;
      box-shadow: 0 30px 80px -20px rgba(0,0,0,.45);
      flex-shrink: 0;
    }

    #intro .lg img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    #intro .nm {
      display: block;
      margin: 12px 0 0 0;
      color: #fff;
      font-family: 'Sora', sans-serif;
      font-weight: 800;
      font-size: clamp(20px, 5.5vw, 42px); /* Slitghly optimized scaling for extreme small widths */
      line-height: 1.25;
      max-width: 720px;
    }

    /* FIX: Keeps the word elements unified so they drop to new lines as single whole units */
    #intro .nm .word-group {
      display: inline-block;
      white-space: nowrap;
      margin-right: 0.28em; /* Clean, responsive spacing between sequential words */
    }

    #intro .nm span span {
      opacity: 0;
      transform: translateY(16px);
      display: inline-block;
      animation: letter .5s cubic-bezier(.2,.9,.3,1) forwards;
    }

    #intro .tag {
      color: #bcd0ff;
      font-size: clamp(9px, 1.8vw, 12px);
      font-weight: 600;
      line-height: 1.5;
      letter-spacing: .22em;
      text-transform: uppercase;
      max-width: 100%;
      opacity: 0;
      animation: fade .6s ease 2.2s forwards;
    }

    @keyframes pop {
      from { transform: scale(.4) rotate(-10deg); opacity: 0; }
      to { transform: scale(1) rotate(0); opacity: 1; }
    }
    @keyframes letter {
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fade {
      to { opacity: 1; }
    }
    @keyframes introOut {
      to { opacity: 0; visibility: hidden; transform: scale(1.02); }
    }

    body.loaded #intro {
      display: none;
    }
  `]
})
export class IntroLoaderComponent implements OnInit {
  // Strongly typed nested matrix structure to handle word token mapping
  words: Array<{
    globalStartIdx: number;
    letters: Array<{ char: string; idx: number }>;
  }> = [];

  ngOnInit() {
    const rawText = 'Parallel Matrix MANAGEMENT SERVICES';
    const rawWords = rawText.split(' ');
    
    let currentGlobalCount = 0;

    this.words = rawWords.map(wordStr => {
      const lettersArray = wordStr.split('').map((char, index) => ({
        char,
        idx: index
      }));

      const targetWordNode = {
        globalStartIdx: currentGlobalCount,
        letters: lettersArray
      };

      // Advance global animation sequence pointer (plus one handles the space transition offset)
      currentGlobalCount += wordStr.length + 1;
      return targetWordNode;
    });
  }
}