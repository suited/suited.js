#!/bin/bash

rm -rf doc_site

mkdocs build

cp docs/html-demo.html doc_site 
