async function checkBreach(password){
    // #FIRST STEP
// #1- turn string into arrayBuffer(Binary Data)
const buffer = new TextEncoder().encode(password).buffer;
// #2- turn Binary data into HASH (for Password encryption)
const hashBuffer = await crypto.subtle.digest('SHA-1', buffer);
// #3- turn arrayBuffer into hexa string 
const hashArray = Array.from(new Uint8Array(hashBuffer));
const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
// #4- send the 5 prefix to API
const prefix = hashHex.slice(0, 5).toUpperCase();
// #5- return the 35 letter left 
const suffix = hashHex.slice(5).toUpperCase();

// SEC STEP
// #1- send a request to this addres to check our prefix
const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
// #2- reseve the result
const dataText = await response.text();

// THIRD STEP
// #1- turn datatext into array so we can read it
const lines = dataText.split('\n');
// console.log(lines);
// split every line into suffix and count 
for (const line of lines) {
    const [lineSuffix, count] = line.split(':');
    if (lineSuffix === suffix) {
        return parseInt(count);
    }
}
return 0;

}
const breachCount = await checkBreach("qZ8!kLm2$vXr9Tb");
console.log("Number of leaks:",breachCount);


