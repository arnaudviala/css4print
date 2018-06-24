# css4print

Some CSS files to include when creating a HTML5 document whose goal is to be printed (Paper or PDF). Look at the example in the [tests/](tests/) directory. What 

Using those CSS files, it becomes very easy to create a single page document programmatically (using HTML5 and CSS) instead of using a graphical design editor. Multiple pages is also supported.

## Early versions

The first goal of these CSS files was to create my résumé. I didn't want to use any word processor (either Ms Word or LibreOffice) because they didn't offer enough creative possibilities. Long time ago, I used Adobe Illustrator. The result was satisfying but the resumé was quite complicated to update. So I came to the idea of doing it using HTML5 and CSS, and using a browser to create a PDF. So I start writing simple CSS rules so my CV appears like a paper sheet on the screen and is rendered as-is on PDF.

Few month after, I needed to print business cards. And it was the same choice : Illustrator or HTML5 ? So I copied the CSS files again and I thought I should create a separate project which would be a simple easy-to-include CSS file to be able to create document aimed at being printed.

So for now, the first commit contains the initial files `paging.css`, `printing.css`, `printing-a4.css` and `printing-letter.css`. The plan is to merge all those CSS rules into one file only (if possible, maybe I would still need different files for the paper size: `A4` or `letter`). But before merging, let's populate the `tests/` folder with some examples files.

### Similar projects

Just before writing those CSS files, I looked for same feature on the web and I couldn't find anything (I don't remember the keywords used for the search). After created those CSS files, at the time of posting a early version, I found other similar projects :
- https://github.com/cognitom/paper-css, the purpose of this one is really similar to my goal
- https://github.com/papercss/papercss   (https://getpapercss.com)
- https://github.com/BafS/Gutenberg

The first one, `cognitom/paper-css` is very similar to `css4print` -- focused on CSS rules for paper document. The goal of project "css4print" was
> I need to create a PDF (to then print it in a print-service shop). The document can be programmatically generated in HTML/CSS with Javascript. Or simply I prefer to quickly use my HTML/CSS skills instead of launching Adobe Illustrator.

The purposes of the two other projects are a l bit different.


## TODO:

- ~~Upload the initial version~~
- Merge all CSS into a single file `css4print.css`
- Use a minifier to create a `css4print.min.css` file
- Add the possibility to create outline-cut lines around shapes. Lines that would be printed on each corner of a box for a better cutting. Simply add the class "cutting-outlines" and some javascript would create all those lines.
- Add the landscape option.


## Documentation

For now, this section is empty. Look at the examples for a better understanding of what is possible.

```
TODO:
Write how to setup the paper size (A4 or US-letter). See how to extend to other sizes.
```




### Rulers

To display rulers on the edge of your `document.body`, simply include the two following files (and the jquery dependencies):

```
...
<link rel="stylesheet" type="text/css" href="rulers.css">
...
<script type="text/javascript"
  src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
  integrity="sha256-3edrmyuQ0w65f8gfBsqowzjJe2iM6n0nKciPUp8y+7E="
  crossorigin="anonymous"></script>
<script type="text/javascript" src="rulers.js"></script>
...
```

Rulers default unit is 'px' (pixels). Other supported units are 'cm' and 'in'. The reference (aka the `(0,0)` point) is the document's body top-left corner. It's possible to set another reference, by changing the `ref` option.

It's possible to set rulers' options directly from the `<script>` tag, like this:
```
<script type="text/javascript" src="rulers.js" data-ref=".page" data-unit="cm"></script>
```

### Crop marks

To display crop marks on your document, whose goal is to be printed to be able
to crop your print job : there are several solutions.

#### Simple 'crop-box'

For simple use cases, including the `crop-box.css` stylesheet in your document and adding the class name `crop-box` to HTML elements will do the job. Look at `tests/21-crop-box` to see an example.

```
...
<link rel="stylesheet" type="text/css" href="crop-box.css">
...
<div class="crop-box">
  This element<br/>
  would be<br/>
  cropped
</div>
...
```

The simple 'crop-box' method is not suitable for more complex use cases: when HTML elements are transparents or when the crop marks overlap on other HTML elements.
