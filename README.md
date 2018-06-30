# css4print

Toolkit composed of small CSS or JS files to create HTML5 documents whose goal is to be printed (Paper or PDF).

Using those CSS files, it becomes very easy to create a single page document programmatically (using HTML5 and CSS) instead of using a graphical design editor. Multiple pages is also supported.

Look at the example in the [tests/](tests/) directory.

## Early versions

The first goal of these CSS files was to create a résumé. Several solutions were available:

  a) a word processor like Ms Word or LibreOffice ? They didn't offer enough design possibilities.

  b) using Adobe software (Illustrator or InDesign) ? Design offering is endless (they are amazing tools). But at each résumé modification, there was some graphical stuff to tweak again (alignment...). (Is there any "separation of content/style" in Adobe tools ?)

  c) using HTML5 and CSS ? Those technologies allow a lot creative stuff and the "separation of style and content" is already a standard. And it allow also programmatic generation of content thanks to Javascript.

Here was the beginning. To design PDF from an HTML document, some CSS rules to simulate a sheet of paper was necessary in order to the résumé to appear like a paper sheet on the screen and be rendered as-is on PDF.

Few month after, another related project was to quickly print business cards. And it was the same choice : Illustrator or HTML5 ? Using the same CSS files again, maybe it was time to create a dedicated and separated set of useful files.

So here is this repositoty containing simple easy-to-include CSS file (as well as JS helper for some specific tasks) to be able to create HTML5 documents aimed at being printed (or PDF generated).

So for now, the first commit contains the initial files `paging.css`, `printing.css`, `printing-a4.css` and `printing-letter.css`. The plan is to merge all those CSS rules into one file only (if possible, maybe different files would be needed for each paper size: `A4` or `letter`). But before merging, let's populate the `tests/` folder with some examples files.

### Similar projects

Just before writing those CSS files, I looked for same feature on the web and I couldn't find anything (I don't remember the keywords used for the search). Once written, at the time this repository creation, I found other similar projects :
- https://github.com/cognitom/paper-css, the purpose of this one is really -- really -- similar
- https://github.com/papercss/papercss   (https://getpapercss.com)
- https://github.com/BafS/Gutenberg


The purpose of the last two projects are a little bit different.


## TODO:

- ~~Upload the initial version~~
- ~~Merge all CSS into a single file~~ (still "printing-*.css" are necessary)
- Rename the single CSS file not yet `css4print.css`
- Use a minifier to create a `css4print.min.css` file
- ~~Add the possibility to create outline-cut lines around shapes. Lines that would be printed on each corner of a box for a better cutting. Simply add the class "cutting-outlines" and some javascript would create all those lines.~~
  - ~~Done. Possible enhancement, get rid (or simplify) of "z-index" used everywhere for this.~~
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

#### 'crop-box', very simple cases

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


#### 'crop-lines', specific cases

By using solely the `crop-lines.css` stylesheet, drawing crop-lines over transparent elements is not a problem any more. But it also lets the user specify which lines to draw (left, top, right or bottom). Look at the `tests/23-crops-lines-static` test for an example case.

Basically, it is necessary to embed one HTML element `crop-line-...` for each line you want to see.

```
...
<link rel="stylesheet" type="text/css" href="crop-lines.css">
...
<div class="ticket">
  <div class="crop-line-left"></div>
  <div class="crop-line-top"></div>
  <div class="crop-line-right"></div>
  <div class="crop-line-bottom"></div>
  ...
</div>
...
```

#### 'crop-lines' + JS, automatic mode

To automatically add crop-lines to HTML elements, and to deal with overlapping: using a Javascript helper was necessary. Files that need to be included are : `crop-lines.css`, `crop-lines.js` and `jquery...js` as well.

The helper script `crop-lines.js` looks for elements matching a specific selector (given by attribute `data-selector=".add-crop-lines"`). For each it creates some crop-lines elements in the background as children of the `.page` parent (unless specified differently with attribute `data-parent-selector`).

```
...
<link rel="stylesheet" type="text/css" href="crop-lines.css">
...
<script type="text/javascript"
  src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
  integrity="sha256-3edrmyuQ0w65f8gfBsqowzjJe2iM6n0nKciPUp8y+7E="
  crossorigin="anonymous"></script>
<script type="text/javascript" src="crop-lines.js" data-selector=".add-crop-lines"></script>
...
```
