function intToString(num : string) {
  const newnum = num.toString().replace(/[^0-9.]/g, '');
  try {
    const bignum = BigInt(newnum);
    if (bignum < 1000) {
        return num;
    }
    let si = [
      {v: 1E3, s: "K"},
      {v: 1E6, s: "M"},
      {v: 1E9, s: "B"},
      {v: 1E12, s: "T"},
      {v: 1E15, s: "P"},
      {v: 1E18, s: "E"}
      ];
    let index;
    for (index = si.length - 1; index > 0; index--) {
        if (bignum >= si[index].v) {
            break;
        }
    }
    if(bignum < Number.MAX_SAFE_INTEGER) {
      return (Number(bignum) / si[index].v).toFixed(2).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + si[index].s;
    }
    else return ((bignum / BigInt(si[index].v)).toString().replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + si[index].s);    
  } catch (error) {
    return num
  }
}


export default intToString;