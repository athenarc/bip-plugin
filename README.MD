# Altmetric Badges

The goal is to create a js plugin that gets as input some DOIs makes some API calls to BIP api to display the corresponding Altmetric badges.

We want something similar to <a href="https://badge-docs.altmetric.com/getting-started.html#quick-start">badge-docs.altmetric.com</a>.

The API endpoint for fetching BIP visualization data is:

```
https://bip.imsi.athenarc.gr/api/impact-chart?id=doi_dedup___::cb6cfaed85e4b99c063233e7a981f323
```

The API endpoint for fetching BIP raw data is:

```
https://bip-api.imsi.athenarc.gr/paper/scores/10.1093%2Fnar%2Fgkx1141
```