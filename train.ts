/** */ /** */ /** */ /** */ /** */

/** 
 * ZO-TASK:

Shunday function yozing, u parametrdagi string ichidagi qavslar miqdori balansda ekanligini aniqlasin. Ya'ni ochish("(") va yopish(")") qavslar soni bir xil bolishi kerak.
MASALAN: areParenthesesBalanced("string()ichida(qavslar)soni()balansda") return true
*/

function areParenthesesBalanced(str: string): boolean {
	let count = 0;
	for (const char of str) {
		if (char === '(') count++;
		else if (char === ')') {
			if (count === 0) return false;
			count--;
		}
	}
	return count === 0;
}
console.log(areParenthesesBalanced('string()ichida(qavslar)soni()balansda'));
console.log(areParenthesesBalanced('xato(()))'));

/** TASK ZN:

Shunday function yozing, uni array va number parametri bo'lsin.
Function'ning vazifasi ikkinchi parametr'da berilgan raqam, birinchi
array parametr'ning indeksi bo'yicha hisoblanib, shu indeksgacha bo'lgan
raqamlarni indeksdan tashqarida bo'lgan raqamlar bilan o'rnini
almashtirib qaytarsin.

MASALAN: rotateArray([1, 2, 3, 4, 5, 6], 3); return [5, 6, 1, 2, 3, 4];*/
// function rotateArray(arr, index) {
// 	return arr.slice(index).concat(arr.slice(0, index));
// }
// console.log(rotateArray([1, 2, 3, 4, 5, 6], 3));

/**ZL-TASK:

Shunday function yozing, u parametrda berilgan stringni kebab casega otkazib qaytarsin. Bosh harflarni kichik harflarga ham otkazsin.
MASALAN: stringToKebab(“I love Kebab”) return “i-love-kebab” */

// function stringToKebab(str: string): string {
// 	return str.toLowerCase().trim().split(/\s+/).join('-');
// }
// console.log(stringToKebab('I love Kebab'));

/**TASK ZM:

Shunday function yozing, va bu function parametr
sifatida raqamlarni qabul qilsin. Bu function qabul qilingan
raqamlarni orqasiga o'girib qaytarsin

MASALAN: reverseInteger(123456789); return 987654321;

Yuqoridagi misolda, function kiritilgan raqamlarni orqasiga
o'girib (reverse) qilib qaytarmoqda. */

// function reverseInteger(num: number): number {
// 	return Number(num.toString().split('').reverse().join(''));
// }

// console.log(reverseInteger(123456789));

/*TASK  :

Shunday function yozing, bu function har bir soniyada bir marotaba
console'ga 1'dan 5'gacha bo'lgan raqamlarni chop etsin va
5 soniyadan so'ng function o'z ishini to'xtatsin
  
MASALAN: printNumbers();*/
// function printNumbers() {
// 	let count = 1;

// 	const interval = setInterval(() => {
// 		console.log(count);
// 		count++;

// 		if (count > 5) {
// 			clearInterval(interval);
// 		}
// 	}, 1000);
// }

// printNumbers();
