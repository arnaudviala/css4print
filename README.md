# css4print

Some CSS files to include when creating a HTML5 document whose goal is to be printed (Paper or PDF). Look at the example in the [tests/](tests/) directory. What 

Using those CSS files, it becomes very easy to create a single page document programmatically (using HTML5 and CSS) instead of using a graphical design editor. Multiple pages is also supported.

## Early versions

The first goal of these CSS files was to create my résumé. I didn't want to use any word processor (either Ms Word or LibreOffice) because they didn't offer enough creative possibilities. Long time ago, I used Adobe Illustrator. The result was satisfying but the resumé was quite complicated to update. So I came to the idea of doing it using HTML5 and CSS, and using a browser to create a PDF. So I start writing simple CSS rules so my CV appears like a paper sheet on the screen and is rendered as-is on PDF.

Few month after, I needed to print business cards. And it was the same choice : Illustrator or HTML5 ? So I copied the CSS files again and I thought I should create a separate project which would be a simple easy-to-include CSS file to be able to create document aimed at being printed.

So for now, the first commit contains the initial files `paging.css`, `printing.css`, `printing-a4.css` and `printing-letter.css`. The plan is to merge all those CSS rules into one file only (if possible, maybe I would still need different files for the paper size: `A4` or `letter`). But before merging, let's populate the `tests/` folder with some examples files.

## TODOs:

- point 1

- point 2
