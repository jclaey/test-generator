const testTitleInput = document.querySelector('#title')
const questionInput = document.querySelector('#question')
const answerOneInput = document.querySelector('#answer-one')
const answerTwoInput = document.querySelector('#answer-two')
const answerThreeInput = document.querySelector('#answer-three')
const answerFourInput = document.querySelector('#answer-four')
const submitBtn = document.querySelector('#submit-btn')
const testRenderArea = document.querySelector('#test-render-area')
const addTitleBtn = document.querySelector('#add-title-btn')
const questionErrorArea = document.querySelector('#question-error-area')
import randomize from "./modules/randomize.mjs"

const addTitle = e => {
    e.preventDefault()

    const test = JSON.parse(localStorage.getItem('test'))

    test.title = testTitleInput.value

    localStorage.setItem('test', JSON.stringify(test))

    testTitleInput.value = ''

    renderTest()
}

const createTestQuestion = e => {
    e.preventDefault()

    questionErrorArea.innerText = ''

    if (questionInput.value === '' || answerOneInput.value === '' || answerTwoInput.value === '' || answerThreeInput.value === '' || answerFourInput.value === '') {
        questionErrorArea.innerText = 'Error: Please fill out the entire form before submitting'
        questionErrorArea.style.display = 'block'
        return
    }

    const test = JSON.parse(localStorage.getItem('test'))

    const hasLength = test.questions.length > 0 ? true : false

    const answers = [
        {
            content: answerOneInput.value,
            isCorrect: true
        },
        {
            content: answerTwoInput.value,
            isCorrect: false
        },
        {
            content: answerThreeInput.value,
            isCorrect: false
        },
        {
            content: answerFourInput.value,
            isCorrect: false
        }
    ]

    randomize(answers)

    const testQuestion = {
        id: hasLength ? test.questions[test.questions.length - 1].id + 1 : 1,
        text: questionInput.value,
        answers
    }

    test.questions.push(testQuestion)
    localStorage.setItem('test', JSON.stringify(test))

    renderTest()

    questionInput.value = ''
    answerOneInput.value = ''
    answerTwoInput.value = ''
    answerThreeInput.value = ''
    answerFourInput.value = ''
}

const renderTest = () => {
    if (!localStorage.getItem('test')) {
        const test = {
            title: '',
            questions: []
        }

        localStorage.setItem('test', JSON.stringify(test))
    }

    const storedTest = JSON.parse(localStorage.getItem('test'))

    let output = ''

    if (storedTest.title === '') {
        output += `
            <h2>No title yet.</h2>
        `
    } else {
        output += `
            <div class="mb-4">
                <span class="is-size-4 mr-5">${storedTest.title}</span>
                <button class="delete-btn button is-danger"  id="delete-title-btn" type="button">Delete</button>
            </div>
        `
    }

    if (storedTest.questions.length === 0) {
        output += `
            <p>
                <small>No questions yet.</small>
            </p>
        `
    } else {
        storedTest.questions.forEach(question => {
            output += `
                <div class="mb-4">
                    <div>
                        ${storedTest.questions.indexOf(question) + 1}. ${question.text}
                        <button type="button" class="delete-btn button is-danger is-small" data-questionid=${question.id}>Delete</button>
                    </div>
                    <ol type="a">
                        <li style="color: ${question.answers[0].isCorrect ? 'green' : 'black'}">${question.answers[0].content}</li>
                        <li style="color: ${question.answers[1].isCorrect ? 'green' : 'black'}">${question.answers[1].content}</li>
                        <li style="color: ${question.answers[2].isCorrect ? 'green' : 'black'}">${question.answers[2].content}</li>
                        <li style="color: ${question.answers[3].isCorrect ? 'green' : 'black'}">${question.answers[3].content}</li>
                    </ol>
                </div>
            `
        })

        output += `
            <div>
                <button type="button" id="randomize-btn" class="button mb-2">Randomize Questions</button>
            </div>
        `
    }

    output += `
        <div>
            <button type="button" id="print-btn" class="button">Print Test</button>
        </div>
    `

    testRenderArea.innerHTML = output

    if (document.querySelector('#delete-title-btn') !== null) {
        document.querySelector('#delete-title-btn').addEventListener('click', deleteTitle)
    }

    if (document.querySelector('#randomize-btn') !== null) {
        document.querySelector('#randomize-btn').addEventListener('click', e => {
            e.preventDefault()
            const test = JSON.parse(localStorage.getItem('test'))
            const arr = test.questions
            randomize(arr)
            test.questions = arr
            localStorage.setItem('test', JSON.stringify(test))
            renderTest()
        })
    }

    document.querySelectorAll('.delete-btn').forEach(node => node.addEventListener('click', deleteQuestion))
    document.querySelector('#print-btn').addEventListener('click', printTest)
}

const deleteQuestion = e => {
    e.preventDefault()
    const test = JSON.parse(localStorage.getItem('test'))
    test.questions = test.questions.filter(question => question.id !== Number(e.target.getAttribute('data-questionid')))
    localStorage.setItem('test', JSON.stringify(test))
    renderTest()
}

const deleteTitle = e => {
    e.preventDefault()
    const test = JSON.parse(localStorage.getItem('test'))
    test.title = ''
    localStorage.setItem('test', JSON.stringify(test))
    renderTest()
}

const printTest = () => {
    let output = ``

    const storedTest = JSON.parse(localStorage.getItem('test'))
  
    if (storedTest.questions.length === 0) {
      alert('Please create a test to print')
    } else {
      output += `
        <div style="margin: 2rem 0 5rem 0; font-family: sans-serif; font-size: 32px;">
          <h2 style="text-align: center;" class="is-size-1">${storedTest.title}</h2>
        </div>
      `
  
      storedTest.questions.forEach((question, index) => {
        output += `
            <div>
                <p>${index + 1}. ${question.text}</p>
                <ol type="a">
                    <li>${question.answers[0].content}</li>
                    <li>${question.answers[1].content}</li>
                    <li>${question.answers[2].content}</li>
                    <li>${question.answers[3].content}</li>
                </ol>
            </div>
        `
      })
  
      let printWin = window.open('')
      printWin.document.write(output)
      printWin.print()
      printWin.stop()
    }
}

renderTest()

addTitleBtn.addEventListener('click', addTitle)
submitBtn.addEventListener('click', createTestQuestion)