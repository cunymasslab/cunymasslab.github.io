---
layout: page
title: Software Vulnerability Prediction (SVP)
id: svp
# description: An thumbnail image for Software Vulnerability Prediction (SVP) research
img: assets/img/vuldata-thumbnail.png
importance: 10
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
