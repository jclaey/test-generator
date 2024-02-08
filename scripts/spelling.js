const addTitleBtn = document.querySelector('#add-title-btn')
const wordArea = document.querySelector('#words')
const submitBtn = document.querySelector('#submit-btn')
const renderArea = document.querySelector('#test-render-area')
const wordError = document.querySelector('#word-error-area')
const titleInput = document.querySelector('#title-input')

const createTest = () => {
    if (wordArea.value === '') {
        wordError.textContent = 'Please enter some test words'
        wordError.style.color = 'red'
        return
    }

    if (!wordArea.value.includes(',')) {
        wordError.textContent = 'Please make sure the values you entered are separated by commas (,)'
        wordError.style.color = 'red'
        return
    }

    const regExp = /[^a-zA-Z,\s]/g

    if (wordArea.value.match(regExp) !== null) {
        wordError.textContent = 'Please make sure the values you entered only contain letters, spaces, and commas (,)'
        wordError.style.color = 'red'
        return
    }

    const wordsArray = wordArea.value.split(',')

    wordsArray.forEach((word, index) => {
        if (word[0] === ' ') {
            wordsArray[index] = word.slice(1)
        }
    })

    let testWords = []
    wordsArray.forEach(word => {
        let choices = replace(word)
        shuffle(choices)
        testWords.push(choices)
    })

    if (!localStorage.getItem('simpleSpellingTest')) {
        localStorage.setItem('simpleSpellingTest', JSON.stringify({
            title: titleInput.value,
            testWords
        }))
    }

    const storedTest = JSON.parse(localStorage.getItem('simpleSpellingTest'))

    storedTest.testWords.forEach(word => {
        shuffle(word)
    })

    storedTest.title = titleInput.value
    storedTest.testWords = testWords

    localStorage.setItem('simpleSpellingTest', JSON.stringify(storedTest))

    titleInput.value = ''
    wordArea.value = ''

    renderTest()
}

const renderTest = () => {
    if (!localStorage.getItem('simpleSpellingTest')) {
        renderArea.innerHTML = `<p>No test yet. Please create one.</p>`
    } else {
        const test = JSON.parse(localStorage.getItem('simpleSpellingTest'))

        renderArea.innerHTML = ''
        renderArea.innerHTML += `<h2 style="font-size: 24px; margin-bottom: 1rem;">${sanitize(test.title)}</h2>`

        test.testWords.forEach((word, index) => {
            let output = `
                <div style="margin-bottom: 2rem">
                <p>${index + 1}.</p>
            `
    
            word.forEach((iteration, index) => {
                output += `
                    <p style="margin-left: 1rem">${index === 0 ? 'a.' : index === 1 ? 'b.' : index === 2 ? 'c.' : 'd.'} ${sanitize(iteration)}</p>
                `
            })
    
            output += `</div>`
            renderArea.innerHTML += output
        })

        renderArea.innerHTML += `
            <div>
                <button type="button" class="button mb-2" id="randomize-btn">Randomize Questions</button>
            </div>
            <div>
                <button type="button" class="button" id="print-btn">Print Test</button>
            </div>
        `

        document.querySelector('#randomize-btn').addEventListener('click', randomize)
        document.querySelector('#print-btn').addEventListener('click', printTest)
    }
}

const printTest = () => {
    let output = ``
    
    const storedTest = JSON.parse(localStorage.getItem('simpleSpellingTest'))

    output += `
        <div style="margin: 2rem 0 2rem 0; font-family: sans-serif; font-size: 32px;">
          <h2 style="text-align: center;" class="is-size-1">${sanitize(storedTest.title)}</h2>
        </div>
        <div>
            <p style="margin-bottom: 3rem;">Instructions: Circle the correct spelling for each word</p>
        </div>
      `

    storedTest.testWords.forEach((word, index) => {
        output += `
            <div style="margin-bottom: 2rem">
                <p>${index + 1}.</p>
        `

        word.forEach((iteration, index) => {
            output += `
                    <p style="margin-left: 1rem">${index === 0 ? 'a.' : index === 1 ? 'b.' : index === 2 ? 'c.' : 'd.'} ${sanitize(iteration)}</p>
                `
        })
    })

    let printWin = window.open('')
    printWin.document.write(output)
    printWin.print()
    printWin.stop()
}

const sanitize = string => {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
    };
    const reg = /[&<>"'/]/ig;
    return string.replace(reg, (match)=>(map[match]));
  }

const randomize = () => {
    const storedTest = JSON.parse(localStorage.getItem('simpleSpellingTest'))

    const testWords = storedTest.testWords

    shuffle(testWords)

    storedTest.testWords = testWords

    localStorage.setItem('simpleSpellingTest', JSON.stringify(storedTest))

    renderTest()
}

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    while (currentIndex > 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
}

// Switch letters around to form new, incorrect spellings of word
const replace = word => {
    let choices = [word]

    while (choices.length < 4) {
        let result = word.split('')
        let indexes = []

        for (let i = 0; i <= 2; i++) {
            let num1 = Math.floor(Math.random() * (word.length - 1)) + 1
            let num2 = Math.floor(Math.random() * (word.length - 1)) + 1

            if (indexes.includes(num1) || indexes.includes(num2)) {
                i--
            } else {
                result[num1] = result[num2]
                result[num2] = word[num1]

                indexes.push(num1, num2)
            }
        }

        result = result.join('')

        if (!choices.includes(result)) {
            result = dropDuplicateLetter(result)
            choices.push(result)
        }
    }

    return choices
}

// Drop duplicate letters
const dropDuplicateLetter = word => {
    let result = word.split('')
    let left = 0
    let right = 1

    while (right < result.length) {
        if (result[left] === result[right]) {
            result = result.slice(0, right).concat(result.slice(right + 1))
        }

        left = right
        right += 1
    }

    return result.join('')
}

// console.log(replace('california', 2, []))

submitBtn.addEventListener('click', createTest)

renderTest()