function soundex(word) {
    if (!isNaN(word)) { // handle numeric cases
        return word
    }
    var s = word.charAt(0).toUpperCase();
    var si = 1;
    var c = 0;
    let mappings = "01230120022455012623010202"
    while ((s.length < 4) && (si < word.length)) {
        c = word.charAt(si).toUpperCase().charCodeAt(0) - 65;
        if ((c >= 0 && c <= 25) && (mappings.charAt(c) !== '0') && (mappings.charAt(c) !== s.charAt(si - 1))) {
            s = s + mappings.charAt(c);
        }
        si++;
    }
    s = s + "000";
    s = s.substring(0, 4);
    return s;
}

function LevenshteinDistance(a, b){
    // initialize matrix
    var matrix = Array(a.length + 1);
    for (var i = 0; i < a.length + 1; i++) {
        matrix[i] = Array(b.length + 1)
        matrix[i].fill(0, 0, b.length + 1);
    }
    for (var i = 0; i < a.length + 1; i++) {
        matrix[i][0] = i;
    }
    for (var j = 0; j < b.length + 1; j++) {
        matrix[0][j] = j;
    }
    // calculations
    var val1;
    var val2;
    var val3;
    for (var i = 1; i < a.length + 1; i++) {
        for (var j = 1; j < b.length + 1; j++) {
            // val1 = val at left of curr pos, val2 = val at top of curr pos
            // if char at curr pos match for both words a & b, val3 = (top-left pos)
            // else val3 = (top-left pos) + 1
            // get val at pos = min(val1, val2, val3)
            val1 = matrix[i][j - 1] + 1;
            val2 = matrix[i - 1][j] + 1;
            if (a.charAt(i - 1) === b.charAt(j - 1)) {
                val3 = matrix[i - 1][j - 1];
            } else {
                val3 = matrix[i - 1][j - 1] + 1;
            }
            matrix[i][j] = Math.min(val1, val2, val3);
        }
    }
    return matrix[a.length][b.length];
}
/*
fizzbuzz
F120, F221, 2
F120, F220, 1
F120, B220, 2
F120, 1, 3
*/

export function getSimilarity(a, b) {
    window.alert(a.concat(b));
    a = soundex(a);
    b = soundex(b);
    window.alert(a.concat(", ", b, ", ", LevenshteinDistance(a, b)))
    return LevenshteinDistance(a, b)
}