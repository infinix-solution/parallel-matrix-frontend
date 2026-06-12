import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-intro-loader',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './intro-loader.component.html',
  styleUrls: ['./intro-loader.component.css']
})
export class IntroLoaderComponent implements OnInit {
  // Strongly typed nested matrix structure to handle word token mapping
  words: Array<{
    globalStartIdx: number;
    letters: Array<{ char: string; idx: number }>;
  }> = [];

  ngOnInit() {
    const rawText = 'Parallel Matrix Management Services';
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