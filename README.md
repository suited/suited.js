<!--
@Author: Roberts Karl <Karl_Roberts>
@Date:   2016-Aug-02
@Project: suited
@Last modified by:   robertk
@Last modified time: 2016-Aug-15
@License: Copyright 2016 Karl Roberts <karl.roberts@owtelse.com> and Dirk van Rensburg <dirk.van.rensburg@gmail.com>

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

-->
![travis status](https://travis-ci.org/suited/suited.js.svg?branch=master)
status: alpha.

[see the demo](https://suited.github.io/suited.js)

[see the API and howto docs](https://suited.github.io/suited.js/doc_site)

## Suited

The awesome presentation framework allowing you to flick between handy talk slides and detailed document all in a single write once file.

The page can be viewed as a normal marked up document but by clicking ctrl-S it will be toggled be to other presentation modes/representations such as slide show mode or lecture mode. Modes can also be switched by modifying the URL in a RESTful manner or clicking the number 1-9 to go the Mode matching that number.

In slide `deck` mode all 'section' elements marked with the attribute 'data-slide' or 'data-figure' as a slide that can be navigated through as in a presentation.

The slides will be treated as individual views that fill the screen.

Suited currently supports HTML mark-up and also markdown (with special syntax for slides or figures) with future language support such as reStructuredText


#### Decisions so far:

In `deck` mode -> all slides included nested are flattened in the nav order eg left and right only with nested showing after their parents.

Markdown plugin is based on MarkdownIt so we can use existing markdown it plugins for fancy markdown syntax.

---------------

### Usage
To use Suited all you need to do is add the suited.js file, found in the [Github release](https://github.com/suited/suited.js/releases) , to the bottom of you HTML's body.

You will probably also want to initially use one of our stylesheets, like css/suited-light-xxxxx.css, again found in the [Github release](https://github.com/suited/suited.js/releases), to style the slides nicely.

Then wrap &lt;section data-figure&gt; or &lt;section data-slide&gt; to parts of your document that you want to mark as figures or slides.

Alternatively wrap all your content in a &lt;div data-markdown&gt; and use the special markdown syntax to delineate slides and figures.

For examples, or as a starting point look at the [html demo](https://suited.github.io/suited.js/?mode=doc#slide-0) and the [markdown demo](https://suited.github.io/suited.js/markdown-demo.html?mode=doc#slide-0).

NB you can mix and match HTML and markdown sections.

------------------

### Development

#### installation

    # checkout the project
    git clone git@bitbucket.org:avocadornd/angular-skeleton.git
    # create a master branch.
    git checkout -b master

    # the next line assumes you have installed
    # Node.js v0.12.2 using nvm
    # as per these instructions :- https://github.com/creationix/nvm/blob/master/README.markdown
    # If you already have Node installed globally (you're crazy and headed for pain) then skip the next command
    . ./setupnvm.sh

    # get the build dependencies
    npm install

#### run tests
to run once:-

    npm run test

or to run every-time the code changes

    npm run test-debug

#### to develop
Run the build which will launch a browser that updates live with code changes so you can see the effects as you develop.

    npm run gulp


#### Generate documentation

Make sure you have `mkdocs` installed.

```
  sudo pip install mkdocs
```

Then generate the HTML documentation site using gulp

```
  npm run gulp gendocs
```

This will use the files in the `docs` directory as source to generate the documentation
site into the `doc_site` folder

#### package up the production build

    gulp package
