/** */ /**TASK ZS:

Shunday function yozing, bu function parametrdagi array ichida
bir marotaba takrorlangan element'ni qaytarsin

MASALAN: singleNumber([4, 2, 1, 2, 1]); return 4; */

function singleNumber(nums: number[]): number {
	const count: Record<number, number> = {};

	for (const num of nums) {
		count[num] = (count[num] || 0) + 1;
	}

	for (const num of nums) {
		if (count[num] === 1) {
			return num;
		}
	}

	throw new Error('Bitta marta uchragan element topilmadi.');
}

console.log(singleNumber([4, 2, 1, 2, 1]));

/**TASK ZR:

Shunday function yozing, bu function,
berilgan parametr string tarkibidagi raqam va sonlarni
sanab object sifatida qaytarsin.

MASALAN: countNumberAndLetters(“string152%\¥”); return {number: 3, letter: 6}; */

// function countNumberAndLetters(input: string): { number: number; letter: number } {
// 	let numberCount = 0;
// 	let letterCount = 0;

// 	for (let i = 0; i < input.length; i++) {
// 		const char = input[i];

// 		if (char >= '0' && char <= '9') {
// 			numberCount++;
// 		} else if ((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')) {
// 			letterCount++;
// 		}
// 	}

// 	return {
// 		number: numberCount,
// 		letter: letterCount,
// 	};
// }

// console.log(countNumberAndLetters('string152%\\¥'));

/**TASK ZQ:

Shunday function yozing, bu function berilgan array parametr
ichida ikki marotaba yoki undan ko'p takrorlangan sonlarni alohida
array'da yagonadan qaytarsin qaytarsin.

MASALAN: findDuplicates([1,2,3,4,5,4,3,4]); return [3, 4]; */

// function findDuplicates(arr: number[]): number[] {
// 	const seen: { [key: number]: boolean } = {};
// 	const duplicates: number[] = [];

// 	for (const num of arr) {
// 		if (seen[num]) {
// 			if (!duplicates.includes(num)) {
// 				duplicates.push(num);
// 			}
// 		} else {
// 			seen[num] = true;
// 		}
// 	}

// 	return duplicates;
// }

// console.log(findDuplicates([1, 2, 3, 4, 5, 4, 3, 4]));

/**Shunday function yozing, u 2 ta array parametr qabul qilsin.
Siz bu ikki arrayning qiymatlari o'xshash bo'lishini 
(ya'ni, ularning barcha elementlari bir xil bo'lishini) tekshirishingiz kerak.

MASALAN:
areArraysEqual([1, 2, 3], [3, 1, 2]) // true
areArraysEqual([1, 2, 3], [3, 1, 2, 1]) // true
areArraysEqual([1, 2, 3], [4, 1, 2]) // false */

// function areArraysEqual(a, b) {
// 	return a.length === b.length && a.sort().toString() === b.sort().toString();
// }

// console.log(areArraysEqual([1, 2, 3], [3, 1, 2]));
// console.log(areArraysEqual([1, 2, 3], [3, 1, 2, 1]));
// console.log(areArraysEqual([1, 2, 2], [2, 1, 2]));
/** 
 * ZO-TASK:

Shunday function yozing, u parametrdagi string ichidagi qavslar miqdori balansda ekanligini aniqlasin. Ya'ni ochish("(") va yopish(")") qavslar soni bir xil bolishi kerak.
MASALAN: areParenthesesBalanced("string()ichida(qavslar)soni()balansda") return true
*/

// function areParenthesesBalanced(str: string): boolean {
// 	let count = 0;
// 	for (const char of str) {
// 		if (char === '(') count++;
// 		else if (char === ')') {
// 			if (count === 0) return false;
// 			count--;
// 		}
// 	}
// 	return count === 0;
// }
// console.log(areParenthesesBalanced('string()ichida(qavslar)soni()balansda'));
// console.log(areParenthesesBalanced('xato(()))'));

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
