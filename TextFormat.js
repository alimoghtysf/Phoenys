/*==================================================
  TextFormat.js
  Full AS3 Text Formatting
==================================================*/

export class TextFormat {
    constructor(font="Arial", size=12, color="#000000", bold=false, italic=false, underline=false, align="left", leading=0, letterSpacing=0){
        this.font = font;
        this.size = size;
        this.color = color;
        this.bold = bold;
        this.italic = italic;
        this.underline = underline;
        this.align = align; // "left", "center", "right", "justify"
        this.leading = leading;
        this.letterSpacing = letterSpacing;
    }
}