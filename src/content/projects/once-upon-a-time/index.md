---
title: Once Upon A Time
date: 2023-07-01
field: genai
summary: Our graduation project. It turns novels and stories without illustrations into images. Give it a page as text, a photo or a PDF page, and our generative model Pixel-Perfect draws four illustrations to choose from.
tags: [Generative AI, Text-to-Image, Diffusion, Graduation Project]
---

## The idea

Most novels and stories have no illustrations. Readers have to imagine every scene, and authors rarely have the budget for an illustrator. **Once Upon A Time** is our graduation project: it brings generative art to written stories, so the words on a page can become a picture.

## How it works

On the website, a user gives the system a page in any of three ways:

- **Text:** paste the page content directly
- **Image:** upload a photo of the page
- **PDF:** upload the book and choose the page number

The system extracts the page content and sends it to our generative art model, **Pixel-Perfect**. Pixel-Perfect generates **four images**, the user picks the one that fits best and **downloads** it.

<figure class="diagram">
<svg viewBox="0 0 900 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Text, an image of a page, or a PDF page go to text extraction, then to the Pixel-Perfect model, which outputs four images; the user picks and downloads one">
<defs><marker id="ou-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="d-head"/></marker></defs>
<g class="d-line">
<path d="M150 50C175 50 175 130 196 130" marker-end="url(#ou-arrow)"/>
<path d="M150 130H196" marker-end="url(#ou-arrow)"/>
<path d="M150 210C175 210 175 130 196 130" marker-end="url(#ou-arrow)"/>
<path d="M340 130H376" marker-end="url(#ou-arrow)"/>
<path d="M520 130H556" marker-end="url(#ou-arrow)"/>
<path d="M710 130H746" marker-end="url(#ou-arrow)"/>
</g>
<rect x="10" y="28" width="140" height="44" rx="10" class="d-box"/>
<text x="80" y="55" class="d-t">Page text</text>
<rect x="10" y="108" width="140" height="44" rx="10" class="d-box"/>
<text x="80" y="135" class="d-t">Photo of a page</text>
<rect x="10" y="188" width="140" height="44" rx="10" class="d-box"/>
<text x="80" y="215" class="d-t">PDF + page no.</text>
<rect x="200" y="108" width="140" height="44" rx="10" class="d-box"/>
<text x="270" y="135" class="d-t">Extract the text</text>
<rect x="380" y="108" width="140" height="44" rx="10" class="d-box d-hi"/>
<text x="450" y="135" class="d-t">Pixel-Perfect</text>
<text x="450" y="96" class="d-tag" text-anchor="middle">generative model</text>
<rect x="560" y="96" width="70" height="32" rx="6" class="d-box"/>
<rect x="636" y="96" width="70" height="32" rx="6" class="d-box d-hi"/>
<rect x="560" y="134" width="70" height="32" rx="6" class="d-box"/>
<rect x="636" y="134" width="70" height="32" rx="6" class="d-box"/>
<text x="633" y="188" class="d-tag" text-anchor="middle">4 images</text>
<rect x="750" y="108" width="140" height="44" rx="10" class="d-box d-hi"/>
<text x="820" y="135" class="d-t">Pick &amp; download</text>
</svg>
</figure>

## Results

In our evaluation, Pixel-Perfect consistently produced high-quality illustrations. Its results were better than standard Stable Diffusion and comparable to Midjourney.

## Who it's for

- **Authors** who want to add visuals to their books
- **Readers** who want to see the scenes they're reading come to life
