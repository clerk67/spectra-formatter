const format = function(data, nuc, area, freq, solvent, digits, ccDigits, printSingletMultiplicity) {
  const atm = nuc.match(/^(\d+)/)[1];
  const N = nuc.match(/([A-Za-z]+)$/)[1];
  const rows = data.split('\n');
  const cols = [];
  let result = '<b><sup>' + atm + '</sup>' + N + ' NMR</b> (' + freq + ' MHz, ' + solvent + ') &#948 ';
  for (let i = 0; i < rows.length; i++) {
    cols[i] = rows[i].split(',');
    if (cols[i].length === area + 1) {
      if (cols[i][area].indexOf('~') === -1) {
        result += parseFloat(cols[i][area]).toFixed(digits);
        if (printSingletMultiplicity) {
          result += ' (s';
          if (area) {
            result += ', ' + cols[i][0] + N;
          }
          result += ')';
        } else if (area) {
          result += ' (' + cols[i][0] + N + ')';
        }
        result += ', ';
      } else {
        result += parseFloat((cols[i][area].split('~'))[0]).toFixed(digits) + '-' + parseFloat((cols[i][area].split('~'))[1]).toFixed(digits) + ' (m';
        if (area) {
          result += ', ' + cols[i][0] + N;
        }
        result += '), ';
      }
    } else if (cols[i].length === area + 2) {
      result += ((parseFloat(cols[i][area]) + parseFloat(cols[i][area + 1])) / 2).toFixed(digits) + ' (d';
      if (area) {
        result += ', ' + cols[i][0] + N;
      }
      result += ', <i>J</i> = ' + ((cols[i][area] - cols[i][area + 1]) * freq).toFixed(ccDigits) + ' Hz), ';
    } else if (cols[i].length === area + 3) {
      result += ((parseFloat(cols[i][area]) + parseFloat(cols[i][area + 1]) + parseFloat(cols[i][area + 2])) / 3).toFixed(digits) + ' (t';
      if (area) {
        result += ', ' + cols[i][0] + N;
      }
      result += ', <i>J</i> = ' + ((cols[i][area] - cols[i][area + 2]) / 2 * freq).toFixed(ccDigits) + ' Hz), ';
    } else if (cols[i].length === area + 4) {
      result += ((parseFloat(cols[i][area]) + parseFloat(cols[i][area + 1]) + parseFloat(cols[i][area + 2]) + parseFloat(cols[i][area + 3])) / 4).toFixed(digits);
      const cconst1 = (cols[i][area] - cols[i][area + 1]) * freq;
      const cconst2 = (cols[i][area + 1] - cols[i][area + 2]) * freq;
      if (Math.abs(cconst1 - cconst2) > 1) {
        result += ' (dd';
        if (area) {
          result += ', ' + cols[i][0] + N;
        }
        result += ', <i>J</i> = ' + (parseFloat(cconst1) + parseFloat(cconst2)).toFixed(ccDigits) + ', ' + cconst1.toFixed(ccDigits) + ' Hz), ';
      } else {
        result += ' (q';
        if (area) {
          result += ', ' + cols[i][0] + N;
        }
        result += ', <i>J</i> = ' + cconst1.toFixed(ccDigits) + ' Hz), ';
      }
    } else if (cols[i].length === area + 5) {
      result += ((parseFloat(cols[i][area]) + parseFloat(cols[i][area + 1]) + parseFloat(cols[i][area + 2]) + parseFloat(cols[i][area + 3]) + parseFloat(cols[i][area + 4])) / 5).toFixed(digits) + ' (quint';
      if (area) {
        result += ', ' + cols[i][0] + N;
      }
      result += ', <i>J</i> = ' + ((cols[i][area] - cols[i][area + 4]) / 4 * freq).toFixed(ccDigits) + ' Hz), ';
    } else if (cols[i].length === area + 6) {
      result += ((parseFloat(cols[i][area]) + parseFloat(cols[i][area + 1]) + parseFloat(cols[i][area + 2]) + parseFloat(cols[i][area + 3]) + parseFloat(cols[i][area + 4]) + parseFloat(cols[i][area + 5])) / 6).toFixed(digits);
      const cconst1 = (cols[i][area] - cols[i][area + 1]) * freq;
      const cconst2 = (cols[i][area + 1] - cols[i][area + 2]) * freq;
      if (Math.abs(cconst1 - cconst2) > 1) {
        result += ' (td';
        if (area) {
          result += ', ' + cols[i][0] + N;
        }
        result += ', <i>J</i> = ' + (parseFloat(cconst1) + parseFloat(cconst2)).toFixed(ccDigits) + ', ' + cconst1.toFixed(ccDigits) + ' Hz), ';
      } else {
        result += ' (dt';
        if (area) {
          result += ', ' + cols[i][0] + N;
        }
        result += ', <i>J</i> = ' + ((cols[i][area] - cols[i][area + 3]) * freq).toFixed(ccDigits) + ', ' + cconst1.toFixed(ccDigits) + ' Hz), ';
      }
    }
  }
  return result.substring(0, result.length - 2) + ';';
}

window.SpectraFormatter = {
  format: function(config) {
    if (!config || !config.data) {
      return { error: 'INVALID_INPUT' };
    }
    const data = config.data;
    if (config.nuc && !config.nuc.match(/^\d+[A-Za-z]+$/)) {
      return { error: 'INVALID_NUCLEUS' };
    }
    const nuc = config.nuc;
    if (config.freq && (isNaN(config.freq) || config.freq <= 0)) {
      return { error: 'INVALID_FREQUENCY' };
    }
    const freq = config.freq ? config.freq : 400;
    const area = config.area ? 1 : 0;
    let solvent = config.solvent ? config.solvent : 'CDCl3';
    solvent = solvent.replace(/\d+/g, '<sub>$&</sub>').replace(/-d/, '-<em>d</em>');
    if (config.digits && (isNaN(config.digits) || config.digits <= 0)) {
      return { error: 'INVALID_DIGITS_OF_CHEMICAL_SHIFTS' };
    }
    const digits = config.digits ? config.digits : 2;
    if (config.ccDigits && (isNaN(config.ccDigits) || config.ccDigits <= 0)) {
      return { error: 'INVALID_DIGITS_OF_COUPLING_CONSTANTS' };
    }
    const ccDigits = config.ccDigits ? config.ccDigits : 1;
    const rows = data.split('\n');
    const cols = [];
    for (let i = 0; i < rows.length; i++) {
      if (rows[i] == '' && i < rows.length - 1) {
        return { error: 'EMPTY_LINE_FOUND' };
      }
      if (rows[i] == '' && i == rows.length - 1) {
        return true;
      }
      cols[i] = rows[i].split(',');
      for (let j = 0; j < cols[i].length; j++) {
        if (cols[i][j] == '') {
          return { error: 'INVALID_COMMAS_FOUND' };
        }
        if (isNaN(cols[i][j]) && cols[i][j].indexOf('~') == -1) {
          return { error: 'NON_NUMERIC_CHARACTERS_FOUND' };
        }
        if (cols[i][j] > 1000 || cols[i][j] < -1000) {
          return { error: 'EXTRAORDINARY_VALUES_FOUND' };
        }
      }
      if (area && cols[i][0] != parseInt(cols[i][0])) {
        return { error: 'AREA_RATIO_NOT_FOUND' };
      }
      else if (area == 0 && cols[i][0].indexOf('.') == -1) {
        return { error: 'INVALID_AREA_RATIO_FOUND' };
      }
    }
    return {
      error: null,
      output: format(data, nuc, area, freq, solvent, digits, ccDigits, config.printSingletMultiplicity),
    };
  },
};
