---
layout: page
permalink: /publications/
title: publications
description: Selected Publications
nav: true
nav_order: 2
earlier_papers: true
earlier_jrnl: notcuny_chenhui_jrnl.bib
earlier_conf: notcuny_chenhui_conf.bib
earlier_bookedit: notcuny_chenhui_bkedt.bib
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
	    <h3>journal papers</h3>
			{% bibliography --file {{page.earlier_jrnl}} %}
	</div>
	<div class="publications">
	    <h3>conference papers</h3>
			{% bibliography --file {{page.earlier_conf}} %}
	</div>
	<div class="publications">
	    <h3>edited books</h3>
			{% bibliography --file {{page.earlier_bookedit}} %}
	</div>
{% endif %}
