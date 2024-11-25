// Function to remove accents from Vietnamese characters
function removeVietnameseDiacritics(str) {
  const accents = [
    { base: 'A', letters: 'ÁÀẠẢÃÂẤẦẬẨẪĂẰẲẴẠ' },
    { base: 'E', letters: 'ÉÈẸẺẼÊẾỀỆỂỄ' },
    { base: 'I', letters: 'ÍÌỊỈĨ' },
    { base: 'O', letters: 'ÓÒỌỎÕÔỐỒỘỔỖƠỚỜỢỞỠ' },
    { base: 'U', letters: 'ÚÙỤỦŨƯỨỪỰỬỮ' },
    { base: 'Y', letters: 'ÝỲỴỶỸ' },
    { base: 'D', letters: 'Đ' },
  ];

  return accents.reduce((str, { base, letters }) => {
    const regex = new RegExp(`[${letters}]`, 'g');
    return str.replace(regex, base);
  }, str);
}

// Constants for vowels, consonants, and Pythagorean table
const VOWELS = {
  A: 1, E: 5, I: 9, O: 6, U: 3, Y: 7,
  Ă: 1, Â: 1, Ê: 5, Ô: 6, Ơ: 6, Ư: 3,
};
const CONSONANTS = {
  B: 2, C: 3, D: 4, F: 6, G: 7, H: 8,
  J: 1, K: 2, L: 3, M: 4, N: 5, P: 7,
  Q: 8, R: 9, S: 1, T: 2, V: 4, W: 5,
  X: 6, Z: 8, Y:7,
};
const PYTHAGOREAN_TABLE = {
  ...VOWELS,
  ...CONSONANTS,
  Y: 7, // Special case, determined dynamically in isVowel
};

// Helper function to determine if a letter is a vowel
function isVowel(letter, prevLetter, nextLetter) {
  const VOWELS_EXCEPT_Y = ['A', 'E', 'I', 'O', 'U', 'Ă', 'Â', 'Ê', 'Ô', 'Ơ', 'Ư'];

  if (letter === 'Y') {
    // Trường hợp 1: "Y" ở cuối từ và không có nguyên âm trước, là nguyên âm
    if (!nextLetter && (!prevLetter || !VOWELS_EXCEPT_Y.includes(prevLetter))) {
      return true;
    }
    // Trường hợp 2: "Y" đứng sau phụ âm và không có nguyên âm liền trước hoặc sau
    if (prevLetter && !VOWELS_EXCEPT_Y.includes(prevLetter) && (!nextLetter || !VOWELS_EXCEPT_Y.includes(nextLetter))) {
      return true;
    }
    // Các trường hợp khác, "Y" được xem là phụ âm
    return false;
  }

  // Các nguyên âm thông thường
  return VOWELS_EXCEPT_Y.includes(letter);
}




// Helper function to reduce numbers to a single digit or karmic number
function reduceToKarmicOrSingleDigit(number) {
  const karmicNumbers = { 13: 4, 14: 5, 16: 7, 19: 1 };
  const masterNumbers = new Set([11, 22]);

  let reducedNumber = number;
  while (reducedNumber > 9) {
    if (karmicNumbers[reducedNumber] || masterNumbers.has(reducedNumber)) {
      break;
    }
    reducedNumber = reducedNumber
      .toString()
      .split('')
      .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }

  if (karmicNumbers[reducedNumber]) {
    return `${karmicNumbers[reducedNumber]} (${reducedNumber})`;
  } else if (masterNumbers.has(reducedNumber)) {
    return reducedNumber;
  } else {
    return reducedNumber;
  }
}

// Reduce any number to a single digit except master numbers (11, 22)
function reduceToSingleDigit(number) {
  while (number > 9 && number !== 11 && number !== 22) {
    number = number
      .toString()
      .split('')
      .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }
  return number;
}

// Generalized function to sum letters based on the character type
function sumLetters(name, checkFunction) {
  const nameParts = name.split(' ').map((part) => {
    return [...part].reduce((acc, char, idx) => {
      const prevChar = idx > 0 ? part[idx - 1].toUpperCase() : null; // Lấy ký tự trước
      const nextChar = idx < part.length - 1 ? part[idx + 1].toUpperCase() : null; // Lấy ký tự sau
      return (
        acc + (checkFunction(char.toUpperCase(), prevChar, nextChar) ? PYTHAGOREAN_TABLE[char.toUpperCase()] || 0 : 0)
      );
    }, 0);
  });
  return nameParts.reduce((acc, value) => acc + reduceToSingleDigit(value), 0);
}




// Function to get the life path number
function getLifePathNumber(day, month, year) {
  const sum =
    reduceToSingleDigit(day) +
    reduceToSingleDigit(month) +
    reduceToSingleDigit(year);
  return reduceToKarmicOrSingleDigit(sum);
}

// Function to get the expression number (using all letters)
function getExpressionNumber(name) {
  const sum = sumLetters(name, () => true);
  return reduceToKarmicOrSingleDigit(sum);
}

// Function to get the soul urge number (sum only vowels)
function getSoulUrgeNumber(name) {
  const sum = sumLetters(name, isVowel);
  return reduceToKarmicOrSingleDigit(sum);
}

// Function to get the attitude number (sum consonants)
function getAttitudeNumber(name) {
  const sum = sumLetters(name, (char, prevChar) => !isVowel(char, prevChar));
  return reduceToKarmicOrSingleDigit(sum);
}

// Function to get the personality number (first name, all letters)
function getPersonalityNumber(name) {
  const firstName = name.split(' ').pop();
  return sumLetters(firstName, () => true);
}

// Function to get the destiny number (first name, sum vowels)
function getDestinyNumber(name) {
  const firstName = name.split(' ').pop(); // Lấy phần cuối của tên
  return sumLetters(firstName, isVowel); // Tính chỉ dựa trên nguyên âm
}


// Function to get the balance number
function getBalanceNumber(name) {
  const nameParts = name.split(' ');
  const total = nameParts.reduce((acc, part) => {
    const firstChar = part.charAt(0).toUpperCase();
    return acc + (PYTHAGOREAN_TABLE[firstChar] || 0);
  }, 0);
  return reduceToSingleDigit(total);
}

// Function to get the core strength number
function getCoreStrengthNumber(name) {
  const counts = [...name.toUpperCase()].reduce((acc, char) => {
    if (char in PYTHAGOREAN_TABLE) {
      acc[char] = (acc[char] || 0) + 1;
    }
    return acc;
  }, {});

  const dominantLetters = Object.keys(counts).filter(
    (char) => counts[char] >= 3
  );

  const numbers = dominantLetters.map((char) => PYTHAGOREAN_TABLE[char]);

  const uniqueNumbers = [...new Set(numbers)];

  return uniqueNumbers.length > 0 ? uniqueNumbers.join(', ') : 'None';
}

// Function to get the personal year number
function getPersonalYearNumber(day, month, year) {
  const currentYear = new Date().getFullYear();
  const sum =
    reduceToSingleDigit(day) +
    reduceToSingleDigit(month) +
    reduceToSingleDigit(currentYear);
  return reduceToSingleDigit(sum);
}

// Function to get lesson debt (missing numbers)
function getLessonDebt(name) {
  const allNumbers = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const numbersInName = new Set(
    [...name.toUpperCase()]
      .map((char) => PYTHAGOREAN_TABLE[char])
      .filter(Boolean)
  );
  const missingNumbers = [...allNumbers].filter(
    (num) => !numbersInName.has(num)
  );
  return missingNumbers.length > 0 ? missingNumbers.join(', ') : 'None';
}

// Function to get karmic debt number
function getKarmicDebtNumber(number) {
  const karmicDebts = [13, 14, 16, 19];
  return karmicDebts.includes(number) ? number : 'None';
}

// Function to calculate numerology based on input
function calculateNumerology() {
  const name = removeVietnameseDiacritics(document.getElementById('name').value.toUpperCase());
  const dob = document.getElementById('dob').value;
  const [day, month, year] = dob.split('/').map(Number);

  const lifePathNumber = getLifePathNumber(day, month, year);
  const expressionNumber = getExpressionNumber(name);
  const soulUrgeNumber = getSoulUrgeNumber(name);
  const attitudeNumber = getAttitudeNumber(name);
  const personalityNumber = getPersonalityNumber(name);
  const destinyNumber = getDestinyNumber(name);
  const balanceNumber = getBalanceNumber(name);
  const coreStrengthNumber = getCoreStrengthNumber(name);
  const personalYearNumber = getPersonalYearNumber(day, month, year);
  const lessonDebt = getLessonDebt(name);

  const karmicDebtNumbers = [
    getKarmicDebtNumber(lifePathNumber),
    getKarmicDebtNumber(expressionNumber),
    getKarmicDebtNumber(soulUrgeNumber),
    getKarmicDebtNumber(attitudeNumber),
  ]
    .filter((num) => num !== 'None')
    .join(', ');

  document.getElementById(
    'lifePathNumber'
  ).innerText = `Sứ Mệnh Cuộc Đời: ${lifePathNumber}`;
  document.getElementById(
    'expressionNumber'
  ).innerText = `Tố Chất Tiềm Ẩn: ${expressionNumber}`;
  document.getElementById(
    'soulUrgeNumber'
  ).innerText = `Động Lực Bên Trong: ${soulUrgeNumber}`;
  document.getElementById(
    'attitudeNumber'
  ).innerText = `Thái Độ Bên Ngoài: ${attitudeNumber}`;
  document.getElementById(
    'personalityNumber'
  ).innerText = `Phản Ứng Ban Đầu: ${personalityNumber}`;
  document.getElementById(
    'destinyNumber'
  ).innerText = `Mong Muốn Ban Đầu: ${destinyNumber}`;
  document.getElementById(
    'balanceNumber'
  ).innerText = `Số Cân Bằng: ${balanceNumber}`;
  document.getElementById(
    'coreStrengthNumber'
  ).innerText = `Năng Lượng Thành Phần Nổi Trội: ${coreStrengthNumber}`;
  document.getElementById(
    'personalYearNumber'
  ).innerText = `Năm Thần Số: ${personalYearNumber}`;
  document.getElementById('lessonDebt').innerText = `Nợ Bài Học: ${lessonDebt}`;
  document.getElementById(
    'karmicDebtNumber'
  ).innerText = `Nợ Nghiệp: ${karmicDebtNumbers}`;
}

// Function to handle keypress event
function handleKeyPress(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    calculateNumerology();
  }
}

// Function to initialize event listeners
function initializeEventListeners() {
  const inputs = document.querySelectorAll('input');
  inputs.forEach((input) => {
    input.addEventListener('keypress', handleKeyPress);
  });

  const calculateButton = document.getElementById('calculateButton');
  calculateButton.addEventListener('click', calculateNumerology);
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', initializeEventListeners);

function formatDOBInput() {
  const dobInput = document.getElementById('dob');

  dobInput.addEventListener('input', (event) => {
    let value = dobInput.value.replace(/\D/g, ''); // Loại bỏ ký tự không phải số
    if (value.length > 2 && value.length <= 4) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    } else if (value.length > 4) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4, 8)}`;
    }
    dobInput.value = value;
  });

  dobInput.addEventListener('blur', () => {
    const value = dobInput.value;
    const dobError = document.getElementById('dob-error');
    const isValid = /^(\d{2})\/(\d{2})\/(\d{4})$/.test(value);

    if (!isValid && value !== '') {
      dobError.textContent = 'Please enter a valid date in the format dd/mm/yyyy.';
    } else {
      dobError.textContent = '';
    }
  });
}

document.addEventListener('DOMContentLoaded', formatDOBInput);

function calculateNumerology() {
  const name = removeVietnameseDiacritics(document.getElementById('name').value.toUpperCase());
  const dob = document.getElementById('dob').value;
  const [day, month, year] = dob.split('/').map(Number);

  const lifePathNumber = getLifePathNumber(day, month, year);
  const expressionNumber = getExpressionNumber(name);
  const soulUrgeNumber = getSoulUrgeNumber(name);
  const attitudeNumber = getAttitudeNumber(name);
  const personalityNumber = getPersonalityNumber(name);
  const destinyNumber = getDestinyNumber(name);
  const balanceNumber = getBalanceNumber(name);
  const coreStrengthNumber = getCoreStrengthNumber(name);
  const personalYearNumber = getPersonalYearNumber(day, month, year);
  const lessonDebt = getLessonDebt(name);

  const karmicDebtNumbers = [
    getKarmicDebtNumber(lifePathNumber),
    getKarmicDebtNumber(expressionNumber),
    getKarmicDebtNumber(soulUrgeNumber),
    getKarmicDebtNumber(attitudeNumber),
  ]
    .filter((num) => num !== 'None')
    .join(', ');

  // Chuẩn bị dữ liệu cho bảng
  const resultsData = [
    ['Sứ Mệnh Cuộc Đời', lifePathNumber],
    ['Tố Chất Tiềm Ẩn', expressionNumber],
    ['Động Lực Bên Trong', soulUrgeNumber],
    ['Thái Độ Bên Ngoài', attitudeNumber],
    ['Phản Ứng Ban Đầu', personalityNumber],
    ['Mong Muốn Ban Đầu', destinyNumber],
    ['Số Cân Bằng', balanceNumber],
    ['Năng Lượng Thành Phần Nổi Trội', coreStrengthNumber],
    ['Năm Thần Số', personalYearNumber],
    ['Nợ Bài Học', lessonDebt],
    ['Nợ Nghiệp', karmicDebtNumbers],
  ];

  // Hiển thị kết quả vào bảng
  const resultsTableBody = document.getElementById('resultsTableBody');
  resultsTableBody.innerHTML = ''; // Clear previous results

  resultsData.forEach(([attribute, value]) => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${attribute}</td><td>${value}</td>`;
    resultsTableBody.appendChild(row);
  });
}
