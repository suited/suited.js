status: pre-alpha.

## Suited

The awesome presentation framework allowing you to flick between handy talk slides and detailed document all in a single write once file.

The page can be viewed as a normal marked up document but by clicking ctrl-S it will be toggled be to other presentation modes/representatins such as slide show mode. modes can als be switched by modifying the URL in a RESTful manner.

In presentation mode all 'section' elements marked with the atribute 'data-slide' as a slide that can be navigated through as in a presentation.

The slides will be treated as individual views that fill the screen.

Initial support for HTML in slides, with future language support such as markdown or reStructuredText


#### Decisions so far:

In Deck mode -> all slides included nested are flattened in the nav order eg left and right only with nested showing after their parents.

