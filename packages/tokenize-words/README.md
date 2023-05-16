# tokenize-words

Break down text into array of words.

## Install

- `npm i tokenize-words`

## Usage

```javascript
import tokenizeWords from 'tokenize-words';

const text =
  "Harry Potter is a series of seven fantasy novels written by British author J. K. Rowling. The novels chronicle the lives of a young wizard, Harry Potter, and his friends Hermione Granger and Ron Weasley, all of whom are students at Hogwarts School of Witchcraft and Wizardry. The main story arc concerns Harry's conflict with Lord Voldemort, a dark wizard who intends to become immortal, overthrow the wizard governing body known as the Ministry of Magic and subjugate all wizards and Muggles (non-magical people).";

const words = tokenizeWords(text, {
  // options object (optional)
  lengthMin: 50, // error if resulting words array length is less than 50
});

console.log(words);
```
