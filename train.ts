/*TASK  :

Shunday function yozing, bu function har bir soniyada bir marotaba
console'ga 1'dan 5'gacha bo'lgan raqamlarni chop etsin va
5 soniyadan so'ng function o'z ishini to'xtatsin
  
MASALAN: printNumbers();*/
function printNumbers() {
	let count = 1;

	const interval = setInterval(() => {
		console.log(count);
		count++;

		if (count > 5) {
			clearInterval(interval);
		}
	}, 1000);
}

printNumbers();
