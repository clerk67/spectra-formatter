# Spectra Formatter

NMR text generator for Supporting Information of scientific papers

## Demo

**[Spectra Formetter demo](https://clerk67.github.io/spectra-formatter/)**

## Scripting

```html
<script src="dist/spectra-formatter.min.js" type="text/javascript"></script>
<script>
  const config = {
    nuc: '1H',  // nucleus
    area: true,  // enable integration
    ccDigits: 1,  // decimal places in coupling constants
    data: '2, 4.407, 4.328',  // peak data (see below)
    digits: 2,  // decimal places in chemical shifts
    freq: 300,  // measurement frequency in MHz
    printSingletMultiplicity: true,
    solvent: 'CDCl<sub>3</sub>',
  };
  const result = SpectraFormatter.format(config);
  if (result.error) {
    console.log('ERROR:', result.error);
  } else {
    console.log(result.output);
  }
</script>
```

## Writing peak data

The input manners are different depending on the type of nucleus.

- Integrable Spectra (e.g. <sup>1</sup>H, <sup>19</sup>F NMR)
  - For each peaks, the integral value and chemical shifts (&delta; /ppm) should be written in single line and separated by comma (format: `integral, shift`). The integral value must be an integer. Trailing commas are not allowed.
  - For split peaks (such as doublet, triplet, doublet of doublets, ...), all split peaks should be gethered into single line (format: `integral, shift[1], shift[2], ...`). The multiplicities are automatically assigned. The chemical shifts must be written in descending order.
  - For multiplet (complex) peaks, the range of chemical shifts should be specified with `~` (tilde) symbol (format: `integral, shift[1]~shift[2]`). The chemical shifts must be written in descending order.
- Non-Integrable Spectra (e.g. <sup>13</sup>C, <sup>31</sup>P NMR)
  - For each peaks, the chemical shifts (&delta; /ppm) should be written in single line (format: `shift`).
  - For split peaks (such as doublet, triplet, doublet of doublets, ...), all split peaks should be gathered into single line (format: `shift[1], shift[2], ...`). The multiplicities are automatically assigned. The chemical shifts must be written in descending order.
  - For multiplet (complex) peaks, the range of chemical shifts should be specified with `~` (tilde) symbol (format: `shift[1]~shift[2]`). The chemical shifts must be written in descending order.

## Examples

Ethyl benzoate (C<sub>6</sub>H<sub>5</sub>CO<sub>2</sub>CH<sub>2</sub>CH<sub>3</sub>)
> Reference: http://sdbs.riodb.aist.go.jp (National Institute of Advanced Industrial Science and Technology, September 8, 2014) \[[1460](http://sdbs.db.aist.go.jp/sdbs/cgi-bin/direct_frame_disp.cgi?sdbsno=1460)\]

#### <sup>1</sup>H NMR

- Input:

  ```
  2, 8.133~8.023
  3, 7.627~7.331
  2, 4.489, 4.407, 4.328, 4.250
  3, 1.458, 1.379, 1.299
  ```
- Output:

  **<sup>1</sup>H NMR** (90 MHz, CDCl<sub>3</sub>) &delta; 8.13-8.02 (m, 2H), 7.63-7.33 (m, 3H), 4.37 (q, 2H, *J* = 7.4 Hz), 1.38 (t, 3H, *J* = 7.2 Hz);

#### <sup>13</sup>C NMR

- Input:

  ```
  166.540
  132.800
  130.620
  129.570
  128.340
  60.900
  14.330
  ```
- Output:

  **<sup>13</sup>C NMR** (25.16 MHz, CDCl<sub>3</sub>) &delta; 166.5, 132.8, 130.6, 129.6, 128.3, 60.9, 14.3;

## Specifications

- Supported nucleus: <sup>1</sup>H, <sup>13</sup>C, <sup>19</sup>F, <sup>31</sup>P.
- The output format is based on [NMR Guidelines for ACS Journals](http://pubs.acs.org/paragonplus/submission/acs_nmr_guidelines.pdf).
- The multiplicities are automatically assigned for: `s`, `d`, `t`, `q`, `quint`, `dd`, `dt`, `td`, and `m` (complex pattern). `q` and `dt` are automatically distinguished from `dd` and `td` respectively by analysing coupling constants (threshold: *J* = 1.0 Hz).
