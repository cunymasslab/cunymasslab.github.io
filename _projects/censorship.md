---
layout: page
title: Internet Censorship Detection
id: censorship
# description: with background image
# img: assets/img/12.jpg
importance: 1
category: work
related_publications: false
---


{% assign parts = page.url | split: '/' %}
{% assign pname = parts | last %}

{% assign p = site.data.projects | find: 'id', pname %}

{{p.desc}}


## Related Publications

<div class="publications">

{% bibliography --file {{p.pubs}} %}

</div>
