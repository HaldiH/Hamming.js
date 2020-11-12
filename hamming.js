function generateHammingCode(raw_data, parity) {
    let parity_bits_n = 0;
    let parity_bits = new String();
    while (!(raw_data.length + parity_bits_n <= Math.pow(2, parity_bits_n) - 1))
        parity_bits_n++;

    console.log(parity_bits_n + ' bits of parity');
    let encoded_data = new String(raw_data);
    for (let i = 1; i <= parity_bits_n; i++) {
        let pow2 = Math.pow(2, i - 1);
        let pos = encoded_data.length - pow2 + 1;
        encoded_data = encoded_data.substring(0, pos) + 'X' + encoded_data.substring(pos);
    }

    console.log(encoded_data);

    for (let i = 1; i <= parity_bits_n; i++) { // for each parity bit ki
        let parity_sum = 0;
        let step = Math.pow(2, i - 1);
        for (let j = step; j <= encoded_data.length; j += 2 * step) {
            for (let p = 0; p < step; p++) {
                let pos = j + p;
                if (pos > encoded_data.length)
                    break;
                if (pos == step)
                    continue;
                parity_sum += parseInt(encoded_data[encoded_data.length - pos]);
            }
        }
        let k = 0;
        if (parity_sum % 2 != parity)
            k = 1;
        console.log('k' + i + ' = ' + k);
        parity_bits = k.toString() + parity_bits;
        let string_pos = encoded_data.length - Math.pow(2, i - 1);
        encoded_data = encoded_data.substring(0, string_pos) + k + encoded_data.substring(string_pos + 1);
    }
    console.log(encoded_data);
    return { encoded_data: encoded_data, parity_bits: parity_bits };
}

function checkHammingCode(encoded_data, parity) {
    let parity_bits_n = 0;
    while (!(encoded_data.length <= Math.pow(2, parity_bits_n) - 1))
        parity_bits_n++;

    let raw_data_str = new String();
    let parity_bits_str = new String();

    for (let i = parity_bits_n, l = 0; i >= 1; i--) {
        let pos = Math.pow(2, i - 1);
        parity_bits_str += encoded_data[encoded_data.length - pos];
        raw_data_str += encoded_data.substring(l, encoded_data.length - pos);
        l = encoded_data.length - pos + 1;
    }

    let parity_bits = parseInt(parity_bits_str, 2);
    let raw_data = parseInt(raw_data_str, 2);
    console.log(parity_bits_str);
    console.log(raw_data_str);


    let recalculated_parity_bits_str = generateHammingCode(raw_data_str, parity).parity_bits;
    let recalculated_parity_bits = parseInt(recalculated_parity_bits_str, 2);
    let diff = parity_bits ^ recalculated_parity_bits;
    if (diff === 0) {
        console.log('No error in message');
        return { success: true, raw_data: raw_data_str, parity_bits: parity_bits_str };
    } else {
        console.log('Error detected at position ' + diff);
        return { success: false, err_pos: diff };
    }
}
