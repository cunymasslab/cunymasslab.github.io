---
layout: page
permalink: /publications/
title: publications
description: Selected Publications
nav: true
nav_order: 2
earlier_papers: true
earlier_all: notcuny_chenhui_cs_jrnl_plus_conf.bib
---

<!-- _pages/publications.md -->

<!-- Bibsearch Feature -->

{% include bib_search.liquid %}

<div class="publications">

{% bibliography %}

{% if page.earlier_papers %}

  <hr>
  <hr>
  <h2>earlier publications</h2>
  <p class="post-description">earlier publications before lab formation</p>
  <div class="publications">
    {% bibliography --file {{page.earlier_all}} %}
  </div>
{% endif %}
