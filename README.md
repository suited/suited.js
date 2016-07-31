status: pre-alpha.

## Suited

The awesome presentation framework allowing you to flick between handy talk slides and detailed document all in a single write once file.

The page can be viewed as a normal marked up document but by clicking ctrl-S it will be toggled be to other presentation modes/representatins such as slide show mode. modes can als be switched by modifying the URL in a RESTful manner.

In presentation mode all 'section' elements marked with the atribute 'data-slide' as a slide that can be navigated through as in a presentation.

The slides will be treated as individual views that fill the screen.

Initial support for HTML in slides, with future language support such as markdown or reStructuredText


#### Decisions so far:

In Deck mode -> all slides included nested are flattened in the nav order eg left and right only with nested showing after their parents.


### Development

#### instalation

    # checkout the project
    git clone git@bitbucket.org:avocadornd/angular-skeleton.git
    # create a master branch.
    git checkout -b master

    # the next line assumes you have installed
    # Node.js v0.12.2 using nvm
    # as per these instructins :- https://github.com/creationix/nvm/blob/master/README.markdown
    # If you alreeady have Node installed globbaly (you're crazy and headed for pain) then skip the next command
    . ./setupnvm.sh

    # get the build dependencies
    npm install

    # install karma and gulp as globals
      npm install -g gulp
      npm install -g karma-cli



#### run tests
either

    gulp karma

or

    karma start

#### to develp
run the build in a browser with browserify so you can see changes as you code

    gulp


#### Generate documentation

Make sure you have `mkdocs` installed.

```
  pip install mkdocs
```

Then generate the HTML documentation site using gulp

```
  gulp gendocs
```

This will use the files in the `docs` directory as source to generate the documentation
site into the `doc_site` folder

#### package up the production build

    gulp package
